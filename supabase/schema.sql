-- ============================================================================
--  MEDIDENT ACADEMY — Doctor Portal schema  (dedicated Supabase project)
-- ----------------------------------------------------------------------------
--  Everything is prefixed  academy_  (tables / functions) and  academy-
--  (storage buckets). Doctors create their own account from the portal's
--  "Create account" screen; the trigger in §2b gives every new login an academy
--  profile with role 'doctor'. Doctors see NOTHING until an admin assigns them
--  courses (Admin -> Assignments), so the admin stays in control of access.
--
--  Run this ONCE in the project:  SQL Editor -> New query -> paste all -> Run.
--  Safe to re-run.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------------
create table if not exists public.academy_profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'doctor' check (role in ('doctor', 'admin')),
  created_at  timestamptz not null default now()
);

create table if not exists public.academy_courses (
  id             uuid primary key default gen_random_uuid(),
  title_en       text not null,
  title_sq       text,
  description_en text,
  description_sq text,
  cover_path     text,
  sort_order     int  not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now()
);

create table if not exists public.academy_lessons (
  id             uuid primary key default gen_random_uuid(),
  course_id      uuid not null references public.academy_courses (id) on delete cascade,
  title_en       text not null,
  title_sq       text,
  description_en text,
  description_sq text,
  kind           text not null check (kind in ('video', 'webinar_recorded', 'webinar_live', 'pdf')),
  storage_path   text,
  external_url   text,
  webinar_at     timestamptz,
  join_url       text,
  duration_min   int,
  sort_order     int  not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.academy_assignments (
  id          uuid primary key default gen_random_uuid(),
  doctor_id   uuid not null references public.academy_profiles (id) on delete cascade,
  course_id   uuid not null references public.academy_courses (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unique (doctor_id, course_id)
);

create table if not exists public.academy_lesson_progress (
  doctor_id    uuid not null references public.academy_profiles (id) on delete cascade,
  lesson_id    uuid not null references public.academy_lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (doctor_id, lesson_id)
);

create index if not exists idx_academy_lessons_course     on public.academy_lessons (course_id);
create index if not exists idx_academy_assignments_doctor on public.academy_assignments (doctor_id);
create index if not exists idx_academy_assignments_course on public.academy_assignments (course_id);
create index if not exists idx_academy_progress_doctor    on public.academy_lesson_progress (doctor_id);

-- Make the tables reachable by the API roles (RLS below still gates every row).
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on
  public.academy_profiles, public.academy_courses, public.academy_lessons,
  public.academy_assignments, public.academy_lesson_progress
  to anon, authenticated;


-- ---------------------------------------------------------------------------
-- 2. ADMIN HELPER  (security definer -> bypasses RLS, so no policy recursion)
-- ---------------------------------------------------------------------------
create or replace function public.academy_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.academy_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- ---------------------------------------------------------------------------
-- 2b. SELF-REGISTRATION TRIGGER
--     Every new login (a doctor using "Create account", or an account the admin
--     adds) gets an academy profile. The role is ALWAYS 'doctor' — it is never
--     read from client-supplied sign-up data, so nobody can register as admin.
-- ---------------------------------------------------------------------------
create or replace function public.academy_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.academy_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'doctor'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists academy_on_auth_user_created on auth.users;
create trigger academy_on_auth_user_created
  after insert on auth.users
  for each row execute function public.academy_handle_new_user();


-- ---------------------------------------------------------------------------
-- 3. ROW-LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.academy_profiles        enable row level security;
alter table public.academy_courses         enable row level security;
alter table public.academy_lessons         enable row level security;
alter table public.academy_assignments     enable row level security;
alter table public.academy_lesson_progress enable row level security;

-- profiles: a user reads their own row; admins read all; only admins write.
-- (No self-update policy: it would let a doctor change their own role.)
drop policy if exists "academy_profiles: self or admin read" on public.academy_profiles;
create policy "academy_profiles: self or admin read"
  on public.academy_profiles for select
  using (id = auth.uid() or public.academy_is_admin());

drop policy if exists "academy_profiles: admin write" on public.academy_profiles;
create policy "academy_profiles: admin write"
  on public.academy_profiles for all
  using (public.academy_is_admin())
  with check (public.academy_is_admin());

-- courses
drop policy if exists "academy_courses: read if assigned or admin" on public.academy_courses;
create policy "academy_courses: read if assigned or admin"
  on public.academy_courses for select
  using (
    public.academy_is_admin()
    or exists (
      select 1 from public.academy_assignments a
      where a.course_id = academy_courses.id and a.doctor_id = auth.uid()
    )
  );

drop policy if exists "academy_courses: admin write" on public.academy_courses;
create policy "academy_courses: admin write"
  on public.academy_courses for all
  using (public.academy_is_admin())
  with check (public.academy_is_admin());

-- lessons
drop policy if exists "academy_lessons: read if course assigned or admin" on public.academy_lessons;
create policy "academy_lessons: read if course assigned or admin"
  on public.academy_lessons for select
  using (
    public.academy_is_admin()
    or exists (
      select 1 from public.academy_assignments a
      where a.course_id = academy_lessons.course_id and a.doctor_id = auth.uid()
    )
  );

drop policy if exists "academy_lessons: admin write" on public.academy_lessons;
create policy "academy_lessons: admin write"
  on public.academy_lessons for all
  using (public.academy_is_admin())
  with check (public.academy_is_admin());

-- assignments
drop policy if exists "academy_assignments: read own or admin" on public.academy_assignments;
create policy "academy_assignments: read own or admin"
  on public.academy_assignments for select
  using (doctor_id = auth.uid() or public.academy_is_admin());

drop policy if exists "academy_assignments: admin write" on public.academy_assignments;
create policy "academy_assignments: admin write"
  on public.academy_assignments for all
  using (public.academy_is_admin())
  with check (public.academy_is_admin());

-- progress
drop policy if exists "academy_progress: doctor manages own" on public.academy_lesson_progress;
create policy "academy_progress: doctor manages own"
  on public.academy_lesson_progress for all
  using (doctor_id = auth.uid())
  with check (doctor_id = auth.uid());

drop policy if exists "academy_progress: admin read" on public.academy_lesson_progress;
create policy "academy_progress: admin read"
  on public.academy_lesson_progress for select
  using (public.academy_is_admin());


-- ---------------------------------------------------------------------------
-- 4. STORAGE BUCKETS  (private videos + materials, public covers)
--     Files are stored under  <course_id>/...  so the rules can check
--     "is this doctor assigned to that course?".
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('academy-videos',    'academy-videos',    false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('academy-materials', 'academy-materials', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('academy-covers',    'academy-covers',    true)  on conflict (id) do nothing;

drop policy if exists "academy storage: read if assigned" on storage.objects;
create policy "academy storage: read if assigned"
  on storage.objects for select
  using (
    bucket_id in ('academy-videos', 'academy-materials')
    and (
      public.academy_is_admin()
      or exists (
        select 1 from public.academy_assignments a
        where a.doctor_id = auth.uid()
          and a.course_id = ((storage.foldername(name))[1])::uuid
      )
    )
  );

drop policy if exists "academy storage: admin writes private" on storage.objects;
create policy "academy storage: admin writes private"
  on storage.objects for all
  using (bucket_id in ('academy-videos', 'academy-materials') and public.academy_is_admin())
  with check (bucket_id in ('academy-videos', 'academy-materials') and public.academy_is_admin());

drop policy if exists "academy storage: public read covers" on storage.objects;
create policy "academy storage: public read covers"
  on storage.objects for select
  using (bucket_id = 'academy-covers');

drop policy if exists "academy storage: admin writes covers" on storage.objects;
create policy "academy storage: admin writes covers"
  on storage.objects for all
  using (bucket_id = 'academy-covers' and public.academy_is_admin())
  with check (bucket_id = 'academy-covers' and public.academy_is_admin());


-- ---------------------------------------------------------------------------
-- 5. MAKE YOURSELF ADMIN
-- ---------------------------------------------------------------------------
--  a) Create your own login: register through the portal's "Create account"
--     screen (or Authentication -> Users -> "Add user", ticking Auto Confirm).
--  b) Run the statement below with that email to promote it to admin:
--
--     insert into public.academy_profiles (id, email, full_name, role)
--     select id, email, '', 'admin' from auth.users where email = 'you@example.com'
--     on conflict (id) do update set role = 'admin';
--
--  From then on, manage everything from the in-app Admin area.
-- ============================================================================
