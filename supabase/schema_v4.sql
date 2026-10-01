-- ============================================================================
--  MEDIDENT ACADEMY — Doctor Portal upgrade v4
-- ----------------------------------------------------------------------------
--  Adds: testimonials on the public Academy page (feedback the doctor allowed
--  to be quoted AND the academy chose to show) and announcements to doctors
--  (every doctor or one course; shown on the dashboard, optionally emailed).
--
--  Run AFTER schema_v3.sql:  SQL Editor -> New query -> paste all -> Run.
--  Safe to re-run. Nothing here removes data.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. TESTIMONIALS — the academy picks which quotable feedback goes public
-- ---------------------------------------------------------------------------
alter table public.academy_course_feedback add column if not exists featured boolean not null default false;

-- Same as v3, plus: changing the stars or the comment takes the feedback off
-- the website until the academy picks it again, and withdrawing permission to
-- quote always does.
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
    set rating      = excluded.rating,
        comment     = excluded.comment,
        allow_quote = excluded.allow_quote,
        updated_at  = now(),
        featured    = public.academy_course_feedback.featured
                      and excluded.allow_quote
                      and excluded.rating = public.academy_course_feedback.rating
                      and excluded.comment is not distinct from public.academy_course_feedback.comment
  returning * into r;
  return r;
end;
$$;

-- Admin: show or hide one doctor's feedback on the public Academy page.
create or replace function public.academy_set_feedback_featured(
  p_doctor_id uuid, p_course_id uuid, p_featured boolean
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.academy_course_feedback;
begin
  if not public.academy_is_admin() then raise exception 'admins_only'; end if;
  select * into r from public.academy_course_feedback where doctor_id = p_doctor_id and course_id = p_course_id;
  if r.doctor_id is null then raise exception 'not_found'; end if;
  if coalesce(p_featured, false) and (not r.allow_quote or coalesce(trim(r.comment), '') = '') then
    raise exception 'not_quotable';
  end if;
  update public.academy_course_feedback
     set featured = coalesce(p_featured, false)
   where doctor_id = p_doctor_id and course_id = p_course_id;
  return coalesce(p_featured, false);
end;
$$;

-- What the public Academy page shows (works without signing in): name, city,
-- course, stars and comment — nothing else about the doctor.
create or replace function public.academy_public_testimonials()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(json_agg(t order by t.rating desc, t.date desc), '[]'::json)
  from (
    select nullif(trim(p.full_name), '') as name,
           nullif(trim(p.city), '')      as city,
           c.title_en                    as course_title_en,
           c.title_sq                    as course_title_sq,
           f.rating,
           f.comment,
           f.updated_at                  as date
      from public.academy_course_feedback f
      join public.academy_profiles p on p.id = f.doctor_id
      join public.academy_courses  c on c.id = f.course_id
     where f.featured and f.allow_quote and c.is_published
       and coalesce(trim(f.comment), '') <> ''
       and nullif(trim(p.full_name), '') is not null
     order by f.rating desc, f.updated_at desc
     limit 12
  ) t;
$$;


-- ---------------------------------------------------------------------------
-- 2. ANNOUNCEMENTS — to every doctor, or to the doctors of one course
-- ---------------------------------------------------------------------------
create table if not exists public.academy_announcements (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid references public.academy_courses (id) on delete cascade,   -- null = every doctor
  title_en    text check (title_en is null or char_length(title_en) <= 200),
  title_sq    text check (title_sq is null or char_length(title_sq) <= 200),
  body_en     text check (body_en is null or char_length(body_en) <= 4000),
  body_sq     text check (body_sq is null or char_length(body_sq) <= 4000),
  send_email  boolean not null default false,
  emailed_at  timestamptz,                                  -- set once by the email function
  created_by  uuid default auth.uid() references public.academy_profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  constraint academy_announcements_has_text check (
    coalesce(nullif(trim(title_en), ''), nullif(trim(title_sq), '')) is not null
    and coalesce(nullif(trim(body_en), ''), nullif(trim(body_sq), '')) is not null
  )
);

create index if not exists academy_announcements_created_idx on public.academy_announcements (created_at desc);

alter table public.academy_announcements enable row level security;

drop policy if exists "academy_announcements: read if addressed or admin" on public.academy_announcements;
create policy "academy_announcements: read if addressed or admin"
  on public.academy_announcements for select
  using (
    public.academy_is_admin()
    or (course_id is null and exists (select 1 from public.academy_profiles p where p.id = auth.uid()))
    or (course_id is not null and public.academy_can_access_course(course_id))
  );

drop policy if exists "academy_announcements: admin insert" on public.academy_announcements;
create policy "academy_announcements: admin insert"
  on public.academy_announcements for insert
  with check (public.academy_is_admin());

drop policy if exists "academy_announcements: admin update" on public.academy_announcements;
create policy "academy_announcements: admin update"
  on public.academy_announcements for update
  using (public.academy_is_admin()) with check (public.academy_is_admin());

drop policy if exists "academy_announcements: admin delete" on public.academy_announcements;
create policy "academy_announcements: admin delete"
  on public.academy_announcements for delete
  using (public.academy_is_admin());

-- Announcements a doctor closed on the dashboard.
create table if not exists public.academy_announcement_dismissals (
  doctor_id       uuid not null references public.academy_profiles (id) on delete cascade,
  announcement_id uuid not null references public.academy_announcements (id) on delete cascade,
  dismissed_at    timestamptz not null default now(),
  primary key (doctor_id, announcement_id)
);

alter table public.academy_announcement_dismissals enable row level security;

drop policy if exists "academy_dismissals: read own" on public.academy_announcement_dismissals;
create policy "academy_dismissals: read own"
  on public.academy_announcement_dismissals for select
  using (doctor_id = auth.uid());

-- The dashboard list: announcements for this doctor from the last 60 days that
-- they haven't closed, newest first.
create or replace function public.academy_my_announcements()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(json_agg(x order by x.created_at desc), '[]'::json)
  from (
    select a.id, a.course_id, a.title_en, a.title_sq, a.body_en, a.body_sq, a.created_at,
           c.title_en as course_title_en, c.title_sq as course_title_sq
      from public.academy_announcements a
      left join public.academy_courses c on c.id = a.course_id
     where auth.uid() is not null
       and a.created_at > now() - interval '60 days'
       and (
         (a.course_id is null and exists (select 1 from public.academy_profiles p where p.id = auth.uid()))
         or (a.course_id is not null and public.academy_can_access_course(a.course_id))
       )
       and not exists (select 1 from public.academy_announcement_dismissals d
                        where d.doctor_id = auth.uid() and d.announcement_id = a.id)
     order by a.created_at desc
     limit 5
  ) x;
$$;

create or replace function public.academy_dismiss_announcement(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  insert into public.academy_announcement_dismissals (doctor_id, announcement_id)
  select p.id, a.id
    from public.academy_profiles p, public.academy_announcements a
   where p.id = auth.uid() and a.id = p_id
  on conflict do nothing;
end;
$$;


-- ---------------------------------------------------------------------------
-- 3. PRIVILEGES
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.academy_announcements to authenticated;
grant select on public.academy_announcement_dismissals to authenticated;
grant select, insert, update, delete on public.academy_announcements, public.academy_announcement_dismissals to service_role;

revoke all on function public.academy_submit_feedback(uuid, int, text, boolean)       from public, anon;
revoke all on function public.academy_set_feedback_featured(uuid, uuid, boolean)       from public, anon;
revoke all on function public.academy_my_announcements()                               from public, anon;
revoke all on function public.academy_dismiss_announcement(uuid)                       from public, anon;

grant execute on function public.academy_submit_feedback(uuid, int, text, boolean)     to authenticated;
grant execute on function public.academy_set_feedback_featured(uuid, uuid, boolean)     to authenticated;
grant execute on function public.academy_my_announcements()                             to authenticated;
grant execute on function public.academy_dismiss_announcement(uuid)                     to authenticated;
grant execute on function public.academy_public_testimonials()                          to anon, authenticated;
