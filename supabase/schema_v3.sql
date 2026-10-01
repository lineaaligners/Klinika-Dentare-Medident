-- ============================================================================
--  MEDIDENT ACADEMY — Doctor Portal upgrade v3
-- ----------------------------------------------------------------------------
--  Adds: CPD hours (on courses and printed on certificates), course feedback
--  (stars, comment, permission to quote), and "continue where you left off"
--  (saved video position + the next lesson to open).
--
--  Run AFTER schema_v2.sql:  SQL Editor -> New query -> paste all -> Run.
--  Safe to re-run. Nothing here removes data.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. CPD HOURS — set per course, copied onto each certificate when issued
-- ---------------------------------------------------------------------------
alter table public.academy_courses      add column if not exists cpd_hours numeric(5,1);
alter table public.academy_certificates add column if not exists cpd_hours numeric(5,1);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'academy_courses_cpd_hours_check') then
    alter table public.academy_courses
      add constraint academy_courses_cpd_hours_check check (cpd_hours is null or (cpd_hours > 0 and cpd_hours <= 999));
  end if;
end;
$$;

-- Same as v2, plus the CPD hours snapshot.
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
    (code, doctor_id, course_id, doctor_name, course_title_en, course_title_sq, instructor_name, cpd_hours)
  values
    (v_code, v_uid, p_course_id, v_name, v_course.title_en, v_course.title_sq, v_course.instructor_name, v_course.cpd_hours)
  on conflict (doctor_id, course_id) do nothing
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.academy_certificates where doctor_id = v_uid and course_id = p_course_id;
  end if;
  return row_to_json(v_row);
end;
$$;

-- Same as v2, plus the CPD hours.
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
    'instructor_name', c.instructor_name, 'issued_at', c.issued_at, 'cpd_hours', c.cpd_hours
  )
  from public.academy_certificates c
  where c.code = upper(trim(p_code)) and c.revoked_at is null
  limit 1;
$$;


-- ---------------------------------------------------------------------------
-- 2. COURSE FEEDBACK — one rating per doctor and course (can be updated)
-- ---------------------------------------------------------------------------
create table if not exists public.academy_course_feedback (
  doctor_id    uuid not null references public.academy_profiles (id) on delete cascade,
  course_id    uuid not null references public.academy_courses (id) on delete cascade,
  rating       int  not null check (rating between 1 and 5),
  comment      text check (comment is null or char_length(comment) <= 2000),
  allow_quote  boolean not null default false,   -- may be quoted as a testimonial
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (doctor_id, course_id)
);

alter table public.academy_course_feedback enable row level security;

drop policy if exists "academy_feedback: read own or admin" on public.academy_course_feedback;
create policy "academy_feedback: read own or admin"
  on public.academy_course_feedback for select
  using (doctor_id = auth.uid() or public.academy_is_admin());

drop policy if exists "academy_feedback: admin delete" on public.academy_course_feedback;
create policy "academy_feedback: admin delete"
  on public.academy_course_feedback for delete
  using (public.academy_is_admin());

-- Doctors write feedback only through this function (no insert/update policy).
create or replace function public.academy_submit_feedback(
  p_course_id uuid, p_rating int, p_comment text, p_allow_quote boolean
)
returns public.academy_course_feedback
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  r     public.academy_course_feedback;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if public.academy_is_admin() then raise exception 'not_for_admins'; end if;
  if not public.academy_can_access_course(p_course_id) then raise exception 'no_access'; end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then raise exception 'bad_rating'; end if;

  insert into public.academy_course_feedback (doctor_id, course_id, rating, comment, allow_quote)
  values (v_uid, p_course_id, p_rating,
          nullif(left(trim(coalesce(p_comment, '')), 2000), ''), coalesce(p_allow_quote, false))
  on conflict (doctor_id, course_id) do update
    set rating = excluded.rating, comment = excluded.comment,
        allow_quote = excluded.allow_quote, updated_at = now()
  returning * into r;
  return r;
end;
$$;


-- ---------------------------------------------------------------------------
-- 3. CONTINUE WHERE YOU LEFT OFF — video position + next lesson
-- ---------------------------------------------------------------------------
alter table public.academy_lesson_views add column if not exists position_seconds int not null default 0;

-- Saves how far a doctor got in a video (called every few seconds while it plays).
create or replace function public.academy_save_position(p_lesson_id uuid, p_seconds int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or p_seconds is null or p_seconds < 0
     or not public.academy_can_access_lesson(p_lesson_id) then
    return;
  end if;
  insert into public.academy_lesson_views (doctor_id, lesson_id, position_seconds)
  values (auth.uid(), p_lesson_id, least(p_seconds, 86400))
  on conflict (doctor_id, lesson_id) do update
    set position_seconds = excluded.position_seconds,
        last_viewed_at   = now();
end;
$$;

-- The lesson to reopen on the dashboard: the last one opened, or, when that one
-- is already complete, the first unfinished lesson of the same course.
-- Live webinars are left out (they have their own "Upcoming webinars" card).
-- Returns null when there is nothing to continue.
create or replace function public.academy_continue_learning()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid       uuid := auth.uid();
  v_last_id   uuid;
  v_last_pos  int;
  v_course_id uuid;
  v_lesson_id uuid;
  v_pos       int := 0;
begin
  if v_uid is null then return null; end if;

  select v.lesson_id, v.position_seconds, l.course_id
    into v_last_id, v_last_pos, v_course_id
    from public.academy_lesson_views v
    join public.academy_lessons l on l.id = v.lesson_id
   where v.doctor_id = v_uid
     and l.kind <> 'webinar_live'
     and public.academy_can_access_lesson(v.lesson_id)
   order by v.last_viewed_at desc
   limit 1;
  if v_last_id is null then return null; end if;

  if exists (select 1 from public.academy_lesson_progress p
              where p.doctor_id = v_uid and p.lesson_id = v_last_id) then
    select l.id into v_lesson_id
      from public.academy_lessons l
     where l.course_id = v_course_id
       and l.kind <> 'webinar_live'
       and not exists (select 1 from public.academy_lesson_progress p
                        where p.doctor_id = v_uid and p.lesson_id = l.id)
     order by l.sort_order, l.created_at
     limit 1;
    if v_lesson_id is null then return null; end if;   -- the whole course is done
    select v.position_seconds into v_pos
      from public.academy_lesson_views v
     where v.doctor_id = v_uid and v.lesson_id = v_lesson_id;
  else
    v_lesson_id := v_last_id;
    v_pos := v_last_pos;
  end if;

  return (
    select json_build_object(
      'course_id',        c.id,
      'course_title_en',  c.title_en,
      'course_title_sq',  c.title_sq,
      'cover_path',       c.cover_path,
      'lesson_id',        l.id,
      'lesson_title_en',  l.title_en,
      'lesson_title_sq',  l.title_sq,
      'kind',             l.kind,
      'position_seconds', coalesce(v_pos, 0),
      'lessons_total',    (select count(*) from public.academy_lessons x where x.course_id = c.id),
      'lessons_done',     (select count(*) from public.academy_lesson_progress p
                            join public.academy_lessons x on x.id = p.lesson_id
                           where x.course_id = c.id and p.doctor_id = v_uid)
    )
    from public.academy_lessons l
    join public.academy_courses c on c.id = l.course_id
    where l.id = v_lesson_id
  );
end;
$$;


-- ---------------------------------------------------------------------------
-- 4. PRIVILEGES
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.academy_course_feedback to authenticated;
grant select, insert, update, delete on public.academy_course_feedback to service_role;

revoke all on function public.academy_submit_feedback(uuid, int, text, boolean) from public, anon;
revoke all on function public.academy_save_position(uuid, int)                  from public, anon;
revoke all on function public.academy_continue_learning()                       from public, anon;

grant execute on function public.academy_submit_feedback(uuid, int, text, boolean) to authenticated;
grant execute on function public.academy_save_position(uuid, int)                  to authenticated;
grant execute on function public.academy_continue_learning()                       to authenticated;
grant execute on function public.academy_verify_certificate(text)                  to anon, authenticated;
