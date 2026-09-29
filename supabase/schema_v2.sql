-- ============================================================================
--  MEDIDENT ACADEMY — Doctor Portal upgrade v2
-- ----------------------------------------------------------------------------
--  Adds: practice details on profiles, course catalog + access requests,
--  quizzes, certificates (with public verification), lesson Q&A, lesson view
--  tracking, webinar announcement/reminder bookkeeping and admin statistics.
--
--  Run AFTER schema.sql:  SQL Editor -> New query -> paste all -> Run.
--  Safe to re-run. Nothing here removes data.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. PROFILES — practice details + last activity
-- ---------------------------------------------------------------------------
alter table public.academy_profiles
  add column if not exists clinic       text,
  add column if not exists city         text,
  add column if not exists country      text,
  add column if not exists phone        text,
  add column if not exists last_seen_at timestamptz;

-- Names a doctor cannot use: an admin's or a course instructor's name, so nobody
-- can post in the Q&A or be issued a certificate under a staff member's name.
-- Comparison ignores case, spaces, punctuation and titles ("Dr.", "Prof.").
create or replace function public.academy_norm_name(p text)
returns text
language sql
immutable
set search_path = public
as $$
  select regexp_replace(
           regexp_replace(' ' || lower(coalesce(p, '')) || ' ', '(\s)(dr|prof|doc)(\.|\s)', '\1', 'g'),
           '[\s\.,''`"’-]+', '', 'g');
$$;

-- (plpgsql: the instructor column is only added further down, in section 2.)
create or replace function public.academy_name_is_reserved(p_name text, p_uid uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v text := public.academy_norm_name(p_name);
begin
  if v = '' then return false; end if;
  return exists (select 1 from public.academy_profiles p
                  where p.role = 'admin' and p.id is distinct from p_uid
                    and public.academy_norm_name(p.full_name) = v)
      or exists (select 1 from public.academy_courses c
                  where public.academy_norm_name(c.instructor_name) = v);
end;
$$;

-- Sign-up trigger (replaces the v1 version): also copies the practice details a
-- doctor types on the sign-up form. The role is still ALWAYS 'doctor', and a
-- reserved (staff) name is left blank for the doctor to fill in under Account.
create or replace function public.academy_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.academy_profiles (id, email, full_name, role, clinic, city, country, phone)
  values (
    new.id,
    new.email,
    case when public.academy_name_is_reserved(new.raw_user_meta_data ->> 'full_name', new.id) then ''
         else left(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 120) end,
    'doctor',
    nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'clinic',  '')), 160), ''),
    nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'city',    '')), 80),  ''),
    nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'country', '')), 80),  ''),
    nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'phone',   '')), 40),  '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Doctors edit their own details through this function only. It can never
-- touch the role column (there is still no self-update policy on the table).
create or replace function public.academy_update_my_profile(
  p_full_name text, p_clinic text, p_city text, p_country text, p_phone text
)
returns public.academy_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.academy_profiles;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if coalesce(trim(p_full_name), '') = '' then raise exception 'name_required'; end if;
  if not public.academy_is_admin() and public.academy_name_is_reserved(p_full_name, auth.uid()) then
    raise exception 'name_reserved';
  end if;
  update public.academy_profiles set
    full_name = left(trim(p_full_name), 120),
    clinic    = nullif(left(trim(coalesce(p_clinic,  '')), 160), ''),
    city      = nullif(left(trim(coalesce(p_city,    '')), 80),  ''),
    country   = nullif(left(trim(coalesce(p_country, '')), 80),  ''),
    phone     = nullif(left(trim(coalesce(p_phone,   '')), 40),  '')
  where id = auth.uid()
  returning * into r;
  if r.id is null then raise exception 'no_profile'; end if;
  return r;
end;
$$;

-- Marks the signed-in user as active (called when the portal opens).
create or replace function public.academy_touch()
returns void
language sql
security definer
set search_path = public
as $$
  update public.academy_profiles set last_seen_at = now() where id = auth.uid();
$$;


-- ---------------------------------------------------------------------------
-- 2. COURSES & LESSONS — instructor, quiz pass mark, webinar bookkeeping
-- ---------------------------------------------------------------------------
alter table public.academy_courses
  add column if not exists instructor_name   text,
  add column if not exists quiz_pass_percent int not null default 70;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'academy_courses_quiz_pass_percent_check') then
    alter table public.academy_courses
      add constraint academy_courses_quiz_pass_percent_check check (quiz_pass_percent between 1 and 100);
  end if;
end;
$$;

alter table public.academy_lessons
  add column if not exists announced_at     timestamptz,
  add column if not exists reminder_sent_at timestamptz;

-- Moving a live webinar to a new time re-arms its reminder email.
create or replace function public.academy_lessons_reset_reminder()
returns trigger
language plpgsql
as $$
begin
  -- A new date/time re-arms the reminder and lets the admin email the change.
  if new.webinar_at is distinct from old.webinar_at then
    new.reminder_sent_at := null;
    new.announced_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists academy_lessons_reset_reminder on public.academy_lessons;
create trigger academy_lessons_reset_reminder
  before update on public.academy_lessons
  for each row execute function public.academy_lessons_reset_reminder();

-- Access helpers (security definer -> no RLS recursion).
create or replace function public.academy_is_assigned(p_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.academy_assignments
    where course_id = p_course_id and doctor_id = auth.uid()
  );
$$;

-- A doctor sees a course (and its lessons, Q&A, webinars) only while it is
-- assigned to them AND published; drafts stay hidden.
create or replace function public.academy_can_access_course(p_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.academy_is_admin() or exists (
    select 1
    from public.academy_assignments a
    join public.academy_courses c on c.id = a.course_id
    where a.course_id = p_course_id and a.doctor_id = auth.uid() and c.is_published
  );
$$;

create or replace function public.academy_can_access_lesson(p_lesson_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.academy_is_admin() or exists (
    select 1
    from public.academy_lessons l
    join public.academy_courses c on c.id = l.course_id
    join public.academy_assignments a on a.course_id = l.course_id
    where l.id = p_lesson_id and a.doctor_id = auth.uid() and c.is_published
  );
$$;

-- v1 read policies, now also hiding unpublished (draft) courses from doctors.
drop policy if exists "academy_courses: read if assigned or admin" on public.academy_courses;
create policy "academy_courses: read if assigned or admin"
  on public.academy_courses for select
  using (public.academy_can_access_course(id));

drop policy if exists "academy_lessons: read if course assigned or admin" on public.academy_lessons;
create policy "academy_lessons: read if course assigned or admin"
  on public.academy_lessons for select
  using (public.academy_can_access_course(course_id));

-- Progress may only be recorded for lessons the doctor can actually open.
drop policy if exists "academy_progress: doctor manages own" on public.academy_lesson_progress;
create policy "academy_progress: doctor manages own"
  on public.academy_lesson_progress for all
  using (doctor_id = auth.uid())
  with check (doctor_id = auth.uid() and public.academy_can_access_lesson(lesson_id));


-- ---------------------------------------------------------------------------
-- 3. COURSE CATALOG & ACCESS REQUESTS
-- ---------------------------------------------------------------------------
create table if not exists public.academy_course_requests (
  id          uuid primary key default gen_random_uuid(),
  doctor_id   uuid not null references public.academy_profiles (id) on delete cascade,
  course_id   uuid not null references public.academy_courses (id) on delete cascade,
  message     text,
  status      text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at  timestamptz not null default now(),
  decided_at  timestamptz,
  notified_at timestamptz,                 -- admins emailed about this request
  unique (doctor_id, course_id)
);
alter table public.academy_course_requests add column if not exists notified_at timestamptz;
create index if not exists idx_academy_requests_status on public.academy_course_requests (status);

alter table public.academy_course_requests enable row level security;

drop policy if exists "academy_requests: read own or admin" on public.academy_course_requests;
create policy "academy_requests: read own or admin"
  on public.academy_course_requests for select
  using (doctor_id = auth.uid() or public.academy_is_admin());

drop policy if exists "academy_requests: admin write" on public.academy_course_requests;
create policy "academy_requests: admin write"
  on public.academy_course_requests for all
  using (public.academy_is_admin())
  with check (public.academy_is_admin());

-- Published courses a signed-in doctor can browse, with their own access state.
create or replace function public.academy_catalog()
returns table (
  id uuid, title_en text, title_sq text, description_en text, description_sq text,
  cover_path text, instructor_name text, sort_order int,
  lesson_count int, assigned boolean, request_status text
)
language sql
stable
security definer
set search_path = public
as $$
  select c.id, c.title_en, c.title_sq, c.description_en, c.description_sq,
         c.cover_path, c.instructor_name, c.sort_order,
         (select count(*)::int from public.academy_lessons l where l.course_id = c.id),
         exists (select 1 from public.academy_assignments a where a.course_id = c.id and a.doctor_id = auth.uid()),
         (select r.status from public.academy_course_requests r where r.course_id = c.id and r.doctor_id = auth.uid())
  from public.academy_courses c
  where c.is_published and auth.uid() is not null
  order by c.sort_order, c.created_at;
$$;

-- Doctor asks for access. Returns: requested | already_pending | already_assigned
-- | profile_incomplete | not_found.
create or replace function public.academy_request_course(p_course_id uuid, p_message text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid    uuid := auth.uid();
  v_status text;
  v_prof   public.academy_profiles;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if not exists (select 1 from public.academy_courses where id = p_course_id and is_published) then
    return 'not_found';
  end if;
  if public.academy_is_assigned(p_course_id) then return 'already_assigned'; end if;

  select * into v_prof from public.academy_profiles where id = v_uid;
  if coalesce(trim(v_prof.full_name), '') = '' or coalesce(trim(v_prof.clinic), '') = ''
     or coalesce(trim(v_prof.phone), '') = '' then
    return 'profile_incomplete';
  end if;

  select status into v_status from public.academy_course_requests
  where doctor_id = v_uid and course_id = p_course_id;
  if v_status = 'pending' then return 'already_pending'; end if;

  insert into public.academy_course_requests (doctor_id, course_id, message, status, created_at, decided_at)
  values (v_uid, p_course_id, nullif(left(trim(coalesce(p_message, '')), 1000), ''), 'pending', now(), null)
  on conflict (doctor_id, course_id) do update
    set status = 'pending', message = excluded.message, created_at = now(),
        decided_at = null, notified_at = null;
  return 'requested';
end;
$$;

-- Admin approves (-> assignment) or declines a request.
create or replace function public.academy_decide_request(p_request_id uuid, p_approve boolean)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.academy_course_requests;
begin
  if not public.academy_is_admin() then raise exception 'admins_only'; end if;
  update public.academy_course_requests
     set status = case when p_approve then 'approved' else 'declined' end,
         decided_at = now()
   where id = p_request_id
  returning * into r;
  if r.id is null then raise exception 'not_found'; end if;
  if p_approve then
    insert into public.academy_assignments (doctor_id, course_id)
    values (r.doctor_id, r.course_id)
    on conflict (doctor_id, course_id) do nothing;
  end if;
  return json_build_object('id', r.id, 'doctor_id', r.doctor_id, 'course_id', r.course_id, 'status', r.status);
end;
$$;

-- Assigning a course by hand also settles any pending request for it.
create or replace function public.academy_assignment_approves_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.academy_course_requests
     set status = 'approved', decided_at = now()
   where doctor_id = new.doctor_id and course_id = new.course_id and status = 'pending';
  return new;
end;
$$;

drop trigger if exists academy_assignment_approves_request on public.academy_assignments;
create trigger academy_assignment_approves_request
  after insert on public.academy_assignments
  for each row execute function public.academy_assignment_approves_request();


-- ---------------------------------------------------------------------------
-- 4. QUIZZES — questions are readable by assigned doctors, answer keys are not
-- ---------------------------------------------------------------------------
create table if not exists public.academy_quiz_questions (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.academy_courses (id) on delete cascade,
  question_en  text not null,
  question_sq  text,
  options      jsonb not null,             -- [{"en": "...", "sq": "..."}, ...]  2..6 items
  sort_order   int  not null default 0,
  created_at   timestamptz not null default now(),
  constraint academy_quiz_options_shape
    check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) between 2 and 6)
);
create index if not exists idx_academy_quiz_questions_course on public.academy_quiz_questions (course_id);

create table if not exists public.academy_quiz_keys (
  question_id   uuid primary key references public.academy_quiz_questions (id) on delete cascade,
  correct_index int  not null check (correct_index between 0 and 5)
);

create table if not exists public.academy_quiz_attempts (
  id          uuid primary key default gen_random_uuid(),
  doctor_id   uuid not null references public.academy_profiles (id) on delete cascade,
  course_id   uuid not null references public.academy_courses (id) on delete cascade,
  correct     int  not null,
  total       int  not null,
  score       int  not null,
  passed      boolean not null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_academy_quiz_attempts_doctor on public.academy_quiz_attempts (doctor_id, course_id);

alter table public.academy_quiz_questions enable row level security;
alter table public.academy_quiz_keys      enable row level security;
alter table public.academy_quiz_attempts  enable row level security;

drop policy if exists "academy_quiz_questions: read if assigned or admin" on public.academy_quiz_questions;
create policy "academy_quiz_questions: read if assigned or admin"
  on public.academy_quiz_questions for select
  using (public.academy_is_admin() or public.academy_is_assigned(course_id));

drop policy if exists "academy_quiz_questions: admin write" on public.academy_quiz_questions;
create policy "academy_quiz_questions: admin write"
  on public.academy_quiz_questions for all
  using (public.academy_is_admin())
  with check (public.academy_is_admin());

drop policy if exists "academy_quiz_keys: admin only" on public.academy_quiz_keys;
create policy "academy_quiz_keys: admin only"
  on public.academy_quiz_keys for all
  using (public.academy_is_admin())
  with check (public.academy_is_admin());

drop policy if exists "academy_quiz_attempts: read own or admin" on public.academy_quiz_attempts;
create policy "academy_quiz_attempts: read own or admin"
  on public.academy_quiz_attempts for select
  using (doctor_id = auth.uid() or public.academy_is_admin());

drop policy if exists "academy_quiz_attempts: admin delete" on public.academy_quiz_attempts;
create policy "academy_quiz_attempts: admin delete"
  on public.academy_quiz_attempts for delete
  using (public.academy_is_admin());

-- Grades a quiz on the server. p_answers = {"<question id>": <chosen index>, ...}
-- At most 5 tries per rolling 24 hours, and which questions were wrong is only
-- shown once the quiz is passed — so the answer key cannot be worked out by
-- trial and error. The right answers themselves are never returned.
create or replace function public.academy_submit_quiz(p_course_id uuid, p_answers jsonb)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_total   int;
  v_correct int;
  v_pass    int;
  v_score   int;
  v_passed  boolean;
  v_wrong   json;
  v_recent  int;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if not (public.academy_is_assigned(p_course_id) or public.academy_is_admin()) then
    raise exception 'no_access';
  end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then raise exception 'bad_answers'; end if;

  select count(*) into v_total from public.academy_quiz_questions where course_id = p_course_id;
  if v_total = 0 then raise exception 'no_quiz'; end if;

  select count(*) into v_recent from public.academy_quiz_attempts
   where doctor_id = v_uid and course_id = p_course_id and created_at > now() - interval '24 hours';
  if v_recent >= 5 and not public.academy_is_admin() then raise exception 'too_many_attempts'; end if;

  with graded as (
    select q.id,
           case when (p_answers ->> q.id::text) ~ '^[0-9]$'
                then (p_answers ->> q.id::text)::int = k.correct_index
                else false end as ok
    from public.academy_quiz_questions q
    left join public.academy_quiz_keys k on k.question_id = q.id
    where q.course_id = p_course_id
  )
  select count(*) filter (where ok),
         coalesce(json_agg(id) filter (where not coalesce(ok, false)), '[]'::json)
    into v_correct, v_wrong
  from graded;

  select quiz_pass_percent into v_pass from public.academy_courses where id = p_course_id;
  v_score  := round(100.0 * v_correct / v_total);
  v_passed := v_score >= coalesce(v_pass, 70);

  insert into public.academy_quiz_attempts (doctor_id, course_id, correct, total, score, passed)
  values (v_uid, p_course_id, v_correct, v_total, v_score, v_passed);

  return json_build_object(
    'correct', v_correct, 'total', v_total, 'score', v_score,
    'passed', v_passed, 'pass_percent', coalesce(v_pass, 70),
    'wrong', case when v_passed then v_wrong else '[]'::json end,
    'attempts_left', case when public.academy_is_admin() then 5 else greatest(0, 4 - v_recent) end
  );
end;
$$;


-- ---------------------------------------------------------------------------
-- 5. CERTIFICATES — issued by the server when a doctor has earned one
-- ---------------------------------------------------------------------------
create table if not exists public.academy_certificates (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,
  doctor_id        uuid not null references public.academy_profiles (id) on delete cascade,
  course_id        uuid references public.academy_courses (id) on delete set null,
  doctor_name      text not null,
  course_title_en  text not null,
  course_title_sq  text,
  instructor_name  text,
  issued_at        timestamptz not null default now(),
  revoked_at       timestamptz,            -- withdrawn by an admin: no longer verifies
  unique (doctor_id, course_id)
);
alter table public.academy_certificates add column if not exists revoked_at timestamptz;

alter table public.academy_certificates enable row level security;

drop policy if exists "academy_certificates: read own or admin" on public.academy_certificates;
create policy "academy_certificates: read own or admin"
  on public.academy_certificates for select
  using (doctor_id = auth.uid() or public.academy_is_admin());

-- No delete: deleting would let the doctor claim a fresh code. Admins revoke
-- (and can restore) with academy_set_certificate_revoked() instead.
drop policy if exists "academy_certificates: admin delete" on public.academy_certificates;

create or replace function public.academy_set_certificate_revoked(p_code text, p_revoked boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.academy_is_admin() then raise exception 'admins_only'; end if;
  update public.academy_certificates
     set revoked_at = case when p_revoked then coalesce(revoked_at, now()) else null end
   where code = upper(trim(p_code));
  if not found then raise exception 'not_found'; end if;
end;
$$;

-- Everything the course page needs to show progress, quiz and certificate state.
create or replace function public.academy_course_status(p_course_id uuid)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_total   int;
  v_done    int;
  v_q       int;
  v_passed  boolean;
  v_best    int;
  v_pass    int;
  v_code    text;
  v_issued  timestamptz;
  v_revoked timestamptz;
  v_recent  int;
  v_retry   timestamptz;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if not (public.academy_is_admin() or public.academy_is_assigned(p_course_id)) then
    raise exception 'no_access';
  end if;

  select count(*) into v_total from public.academy_lessons where course_id = p_course_id;
  select count(*) into v_done
  from public.academy_lesson_progress p
  join public.academy_lessons l on l.id = p.lesson_id
  where l.course_id = p_course_id and p.doctor_id = v_uid;
  select count(*) into v_q from public.academy_quiz_questions where course_id = p_course_id;
  select coalesce(bool_or(passed), false), max(score) into v_passed, v_best
  from public.academy_quiz_attempts where course_id = p_course_id and doctor_id = v_uid;
  select quiz_pass_percent into v_pass from public.academy_courses where id = p_course_id;
  select code, issued_at, revoked_at into v_code, v_issued, v_revoked
  from public.academy_certificates where course_id = p_course_id and doctor_id = v_uid;
  select count(*), min(created_at) + interval '24 hours' into v_recent, v_retry
  from public.academy_quiz_attempts
  where course_id = p_course_id and doctor_id = v_uid and created_at > now() - interval '24 hours';

  return json_build_object(
    'lessons_total',  v_total,
    'lessons_done',   v_done,
    'quiz_questions', v_q,
    'quiz_passed',    v_passed,
    'best_score',     v_best,
    'pass_percent',   coalesce(v_pass, 70),
    'quiz_attempts_left', case when public.academy_is_admin() then 5 else greatest(0, 5 - v_recent) end,
    'quiz_retry_at',  case when v_recent >= 5 and not public.academy_is_admin() then v_retry end,
    'eligible',       v_total > 0 and v_done >= v_total and (v_q = 0 or v_passed),
    'certificate',    case when v_code is null or v_revoked is not null then null
                           else json_build_object('code', v_code, 'issued_at', v_issued) end,
    'certificate_revoked', v_revoked is not null
  );
end;
$$;

-- Issues (or returns the existing) certificate once every lesson is complete and
-- the quiz, if the course has one, is passed.
create or replace function public.academy_claim_certificate(p_course_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid    uuid := auth.uid();
  v_status json;
  v_name   text;
  v_course public.academy_courses;
  v_code   text;
  v_row    public.academy_certificates;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if not public.academy_is_assigned(p_course_id) then raise exception 'no_access'; end if;

  select * into v_row from public.academy_certificates where doctor_id = v_uid and course_id = p_course_id;
  if v_row.id is not null then
    if v_row.revoked_at is not null then raise exception 'revoked'; end if;
    return row_to_json(v_row);
  end if;

  v_status := public.academy_course_status(p_course_id);
  if not (v_status ->> 'eligible')::boolean then raise exception 'not_eligible'; end if;

  select nullif(trim(full_name), '') into v_name from public.academy_profiles where id = v_uid;
  if v_name is null then raise exception 'name_required'; end if;
  select * into v_course from public.academy_courses where id = p_course_id;

  loop
    v_code := 'MA-' || upper(substr(md5(gen_random_uuid()::text), 1, 4))
           || '-'   || upper(substr(md5(gen_random_uuid()::text), 1, 4));
    exit when not exists (select 1 from public.academy_certificates where code = v_code);
  end loop;

  insert into public.academy_certificates
    (code, doctor_id, course_id, doctor_name, course_title_en, course_title_sq, instructor_name)
  values
    (v_code, v_uid, p_course_id, v_name, v_course.title_en, v_course.title_sq, v_course.instructor_name)
  on conflict (doctor_id, course_id) do nothing
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.academy_certificates where doctor_id = v_uid and course_id = p_course_id;
  end if;
  return row_to_json(v_row);
end;
$$;

-- Public check used by the /academy/verify page (works without signing in).
create or replace function public.academy_verify_certificate(p_code text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'code', c.code, 'doctor_name', c.doctor_name,
    'course_title_en', c.course_title_en, 'course_title_sq', c.course_title_sq,
    'instructor_name', c.instructor_name, 'issued_at', c.issued_at
  )
  from public.academy_certificates c
  where c.code = upper(trim(p_code)) and c.revoked_at is null
  limit 1;
$$;


-- ---------------------------------------------------------------------------
-- 6. LESSON Q&A — everyone in the course sees the thread
-- ---------------------------------------------------------------------------
create table if not exists public.academy_lesson_comments (
  id               uuid primary key default gen_random_uuid(),
  lesson_id        uuid not null references public.academy_lessons (id) on delete cascade,
  author_id        uuid not null references public.academy_profiles (id) on delete cascade,
  parent_id        uuid references public.academy_lesson_comments (id) on delete cascade,
  author_name      text,
  author_is_admin  boolean not null default false,
  body             text not null check (char_length(body) between 1 and 4000),
  created_at       timestamptz not null default now(),
  notified_at      timestamptz                -- email about this comment already sent
);
alter table public.academy_lesson_comments add column if not exists notified_at timestamptz;
create index if not exists idx_academy_comments_lesson on public.academy_lesson_comments (lesson_id, created_at);
create index if not exists idx_academy_comments_parent on public.academy_lesson_comments (parent_id);

-- Name/badge come from the author's profile (never from the client); replies
-- are kept one level deep and must belong to the same lesson.
create or replace function public.academy_comments_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent public.academy_lesson_comments;
begin
  select coalesce(nullif(trim(p.full_name), ''), split_part(p.email, '@', 1)), p.role = 'admin'
    into new.author_name, new.author_is_admin
  from public.academy_profiles p
  where p.id = new.author_id;

  if new.parent_id is not null then
    select * into v_parent from public.academy_lesson_comments where id = new.parent_id;
    if v_parent.id is null or v_parent.lesson_id <> new.lesson_id then
      raise exception 'bad_parent';
    end if;
    if v_parent.parent_id is not null then
      new.parent_id := v_parent.parent_id;
    end if;
  end if;

  new.body := trim(new.body);
  new.created_at := now();
  new.notified_at := null;
  return new;
end;
$$;

drop trigger if exists academy_comments_before_insert on public.academy_lesson_comments;
create trigger academy_comments_before_insert
  before insert on public.academy_lesson_comments
  for each row execute function public.academy_comments_before_insert();

alter table public.academy_lesson_comments enable row level security;

drop policy if exists "academy_comments: read if lesson accessible" on public.academy_lesson_comments;
create policy "academy_comments: read if lesson accessible"
  on public.academy_lesson_comments for select
  using (public.academy_can_access_lesson(lesson_id));

drop policy if exists "academy_comments: post if lesson accessible" on public.academy_lesson_comments;
create policy "academy_comments: post if lesson accessible"
  on public.academy_lesson_comments for insert
  with check (author_id = auth.uid() and public.academy_can_access_lesson(lesson_id));

drop policy if exists "academy_comments: delete own or admin" on public.academy_lesson_comments;
create policy "academy_comments: delete own or admin"
  on public.academy_lesson_comments for delete
  using (author_id = auth.uid() or public.academy_is_admin());


-- ---------------------------------------------------------------------------
-- 7. LESSON VIEWS — "who watched what"
-- ---------------------------------------------------------------------------
create table if not exists public.academy_lesson_views (
  doctor_id        uuid not null references public.academy_profiles (id) on delete cascade,
  lesson_id        uuid not null references public.academy_lessons (id) on delete cascade,
  first_viewed_at  timestamptz not null default now(),
  last_viewed_at   timestamptz not null default now(),
  view_count       int not null default 1,
  primary key (doctor_id, lesson_id)
);

alter table public.academy_lesson_views enable row level security;

drop policy if exists "academy_views: read own or admin" on public.academy_lesson_views;
create policy "academy_views: read own or admin"
  on public.academy_lesson_views for select
  using (doctor_id = auth.uid() or public.academy_is_admin());

create or replace function public.academy_track_view(p_lesson_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.academy_can_access_lesson(p_lesson_id) then
    return;
  end if;
  insert into public.academy_lesson_views (doctor_id, lesson_id)
  values (auth.uid(), p_lesson_id)
  on conflict (doctor_id, lesson_id) do update
    set last_viewed_at = now(),
        view_count = public.academy_lesson_views.view_count + 1;
  update public.academy_profiles set last_seen_at = now() where id = auth.uid();
end;
$$;


-- ---------------------------------------------------------------------------
-- 8. ADMIN STATISTICS
-- ---------------------------------------------------------------------------
create or replace function public.academy_admin_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v json;
begin
  if not public.academy_is_admin() then raise exception 'admins_only'; end if;

  with lesson_counts as (
    select course_id, count(*)::int as n from public.academy_lessons group by course_id
  ),
  done as (
    select l.course_id, p.doctor_id, count(*)::int as n
    from public.academy_lesson_progress p
    join public.academy_lessons l on l.id = p.lesson_id
    group by l.course_id, p.doctor_id
  ),
  per_assign as (
    select a.course_id, a.doctor_id, coalesce(lc.n, 0) as total, coalesce(d.n, 0) as done
    from public.academy_assignments a
    left join lesson_counts lc on lc.course_id = a.course_id
    left join done d on d.course_id = a.course_id and d.doctor_id = a.doctor_id
  ),
  course_rows as (
    select
      c.id, c.title_en, c.title_sq, c.is_published, c.sort_order,
      coalesce(lc.n, 0) as lessons,
      (select count(*)::int from per_assign pa where pa.course_id = c.id) as assigned,
      (select count(*)::int from per_assign pa
        where pa.course_id = c.id and pa.total > 0 and pa.done >= pa.total) as completed,
      (select coalesce(round(avg(least(pa.done, pa.total)::numeric / nullif(pa.total, 0) * 100)), 0)::int
         from per_assign pa where pa.course_id = c.id) as avg_progress,
      (select count(*)::int from public.academy_certificates ce
        where ce.course_id = c.id and ce.revoked_at is null) as certificates,
      (select count(*)::int from public.academy_quiz_questions q where q.course_id = c.id) as quiz_questions,
      (select count(distinct qa.doctor_id)::int from public.academy_quiz_attempts qa
        where qa.course_id = c.id and qa.passed) as quiz_passed,
      (select count(*)::int from public.academy_course_requests r
        where r.course_id = c.id and r.status = 'pending') as pending_requests
    from public.academy_courses c
    left join lesson_counts lc on lc.course_id = c.id
  )
  select json_build_object(
    'doctors',          (select count(*) from public.academy_profiles where role = 'doctor'),
    'active_7d',        (select count(*) from public.academy_profiles
                          where role = 'doctor' and last_seen_at > now() - interval '7 days'),
    'new_30d',          (select count(*) from public.academy_profiles
                          where role = 'doctor' and created_at > now() - interval '30 days'),
    'courses',          (select count(*) from public.academy_courses),
    'assignments',      (select count(*) from public.academy_assignments),
    'certificates',     (select count(*) from public.academy_certificates where revoked_at is null),
    'pending_requests', (select count(*) from public.academy_course_requests where status = 'pending'),
    'open_questions',   (select count(*) from public.academy_lesson_comments q
                          where q.parent_id is null and not q.author_is_admin
                            and not exists (select 1 from public.academy_lesson_comments r
                                            where r.parent_id = q.id and r.author_is_admin)),
    'course_stats',     coalesce((select json_agg(row_to_json(cr) order by cr.sort_order) from course_rows cr), '[]'::json),
    'recent_certificates', coalesce((
        select json_agg(x order by x.issued_at desc)
        from (select code, doctor_name, course_title_en, course_title_sq, issued_at, revoked_at
              from public.academy_certificates order by issued_at desc limit 10) x
      ), '[]'::json)
  ) into v;
  return v;
end;
$$;

create or replace function public.academy_admin_doctor_progress()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.academy_is_admin() then raise exception 'admins_only'; end if;
  return coalesce((
    select json_agg(d order by d.last_seen_at desc nulls last, d.full_name)
    from (
      select p.id, p.full_name, p.email, p.clinic, p.city, p.country, p.phone, p.created_at, p.last_seen_at,
        coalesce((
          select json_agg(json_build_object(
            'course_id',        a.course_id,
            'title_en',         c.title_en,
            'title_sq',         c.title_sq,
            'lessons_total',    (select count(*) from public.academy_lessons l where l.course_id = a.course_id),
            'lessons_done',     (select count(*) from public.academy_lesson_progress pr
                                  join public.academy_lessons l on l.id = pr.lesson_id
                                  where l.course_id = a.course_id and pr.doctor_id = p.id),
            'last_viewed_at',   (select max(v.last_viewed_at) from public.academy_lesson_views v
                                  join public.academy_lessons l on l.id = v.lesson_id
                                  where l.course_id = a.course_id and v.doctor_id = p.id),
            'best_score',       (select max(qa.score) from public.academy_quiz_attempts qa
                                  where qa.course_id = a.course_id and qa.doctor_id = p.id),
            'certificate_code', (select ce.code from public.academy_certificates ce
                                  where ce.course_id = a.course_id and ce.doctor_id = p.id
                                    and ce.revoked_at is null)
          ) order by c.sort_order)
          from public.academy_assignments a
          join public.academy_courses c on c.id = a.course_id
          where a.doctor_id = p.id
        ), '[]'::json) as courses
      from public.academy_profiles p
      where p.role = 'doctor'
    ) d
  ), '[]'::json);
end;
$$;

create or replace function public.academy_admin_lesson_stats(p_course_id uuid)
returns table (lesson_id uuid, viewers int, completions int)
language sql
stable
security definer
set search_path = public
as $$
  select l.id,
         (select count(*)::int from public.academy_lesson_views v where v.lesson_id = l.id),
         (select count(*)::int from public.academy_lesson_progress p where p.lesson_id = l.id)
  from public.academy_lessons l
  where l.course_id = p_course_id and public.academy_is_admin();
$$;


-- ---------------------------------------------------------------------------
-- 9. PRIVILEGES
--    Tables: API roles may try, row-level security decides. Functions: only
--    signed-in users, except the public certificate check.
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on
  public.academy_course_requests, public.academy_quiz_questions, public.academy_quiz_keys,
  public.academy_quiz_attempts, public.academy_certificates, public.academy_lesson_comments,
  public.academy_lesson_views
  to authenticated;

grant select, insert, update, delete on
  public.academy_profiles, public.academy_courses, public.academy_lessons,
  public.academy_assignments, public.academy_lesson_progress,
  public.academy_course_requests, public.academy_quiz_questions, public.academy_quiz_keys,
  public.academy_quiz_attempts, public.academy_certificates, public.academy_lesson_comments,
  public.academy_lesson_views
  to service_role;

revoke all on function public.academy_update_my_profile(text, text, text, text, text) from public, anon;
revoke all on function public.academy_touch()                                        from public, anon;
revoke all on function public.academy_catalog()                                      from public, anon;
revoke all on function public.academy_request_course(uuid, text)                     from public, anon;
revoke all on function public.academy_decide_request(uuid, boolean)                  from public, anon;
revoke all on function public.academy_submit_quiz(uuid, jsonb)                       from public, anon;
revoke all on function public.academy_course_status(uuid)                            from public, anon;
revoke all on function public.academy_claim_certificate(uuid)                        from public, anon;
revoke all on function public.academy_track_view(uuid)                               from public, anon;
revoke all on function public.academy_admin_stats()                                  from public, anon;
revoke all on function public.academy_admin_doctor_progress()                        from public, anon;
revoke all on function public.academy_admin_lesson_stats(uuid)                       from public, anon;
revoke all on function public.academy_set_certificate_revoked(text, boolean)          from public, anon;
revoke all on function public.academy_name_is_reserved(text, uuid)                    from public, anon, authenticated;

grant execute on function public.academy_update_my_profile(text, text, text, text, text) to authenticated;
grant execute on function public.academy_touch()                                        to authenticated;
grant execute on function public.academy_catalog()                                      to authenticated;
grant execute on function public.academy_request_course(uuid, text)                     to authenticated;
grant execute on function public.academy_decide_request(uuid, boolean)                  to authenticated;
grant execute on function public.academy_submit_quiz(uuid, jsonb)                       to authenticated;
grant execute on function public.academy_course_status(uuid)                            to authenticated;
grant execute on function public.academy_claim_certificate(uuid)                        to authenticated;
grant execute on function public.academy_track_view(uuid)                               to authenticated;
grant execute on function public.academy_admin_stats()                                  to authenticated;
grant execute on function public.academy_admin_doctor_progress()                        to authenticated;
grant execute on function public.academy_admin_lesson_stats(uuid)                       to authenticated;
grant execute on function public.academy_set_certificate_revoked(text, boolean)          to authenticated;

grant execute on function public.academy_verify_certificate(text) to anon, authenticated;


-- ---------------------------------------------------------------------------
-- 10. DATA — instructors for the two courses created at launch
-- ---------------------------------------------------------------------------
update public.academy_courses set instructor_name = 'Dr. Lendita Islami Nallbani'
 where instructor_name is null and title_en = 'Implantology & Sinus Lift';
update public.academy_courses set instructor_name = 'Dr. Faton Loci'
 where instructor_name is null and title_en = 'Aesthetic Preparation & Crown Placement';
