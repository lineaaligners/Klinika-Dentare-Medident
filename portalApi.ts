import { supabase } from './supabaseClient';
import {
  Profile,
  PortalCourse,
  PortalLesson,
  Assignment,
  Lang,
  BUCKET_VIDEOS,
  BUCKET_MATERIALS,
  BUCKET_COVERS,
} from '../components/portal/types';

function sb() {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

/** Pick the right language, falling back to the other if one is empty. */
export function localized(en: string | null | undefined, sq: string | null | undefined, lang: Lang): string {
  if (lang === 'sq') return (sq || en || '').toString();
  return (en || sq || '').toString();
}

// ── Auth ────────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  return sb().auth.signInWithPassword({ email: email.trim(), password });
}

// Doctor self-registration. full_name travels as sign-up metadata; the database
// trigger turns it into an academy profile with role 'doctor' (never admin).
export async function signUp(email: string, password: string, fullName: string) {
  return sb().auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { full_name: fullName.trim() },
      emailRedirectTo: `${window.location.origin}/academy/portal`,
    },
  });
}

export async function signOut() {
  return sb().auth.signOut();
}

export async function getSessionUser(): Promise<{ userId: string; email: string | null } | null> {
  const { data } = await sb().auth.getSession();
  const s = data.session;
  return s ? { userId: s.user.id, email: s.user.email ?? null } : null;
}

export async function getAccessToken(): Promise<string | null> {
  const { data } = await sb().auth.getSession();
  return data.session?.access_token ?? null;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await sb().from('academy_profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data as Profile;
}

// Self-service password change for the signed-in user. Touches only the auth
// password — never the profile row / role — so it's safe for doctors.
export async function changeMyPassword(newPassword: string) {
  return sb().auth.updateUser({ password: newPassword });
}

// ── Doctor-facing data (row-level security returns only what they may see) ────
export async function fetchMyCourses(): Promise<PortalCourse[]> {
  const { data, error } = await sb()
    .from('academy_courses')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []) as PortalCourse[];
}

export async function fetchCourse(id: string): Promise<PortalCourse | null> {
  const { data, error } = await sb().from('academy_courses').select('*').eq('id', id).single();
  if (error) return null;
  return data as PortalCourse;
}

export async function fetchLessons(courseId: string): Promise<PortalLesson[]> {
  const { data, error } = await sb()
    .from('academy_lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []) as PortalLesson[];
}

// Lightweight (lesson id -> course id) index across every course the doctor may
// see — used to compute per-course progress on the dashboard in one query.
export async function fetchLessonIndex(): Promise<{ id: string; course_id: string }[]> {
  const { data, error } = await sb().from('academy_lessons').select('id, course_id');
  if (error) return [];
  return (data || []) as { id: string; course_id: string }[];
}

// ── Storage URLs ──────────────────────────────────────────────────────────────
export async function signedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string | null> {
  const { data, error } = await sb().storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export function coverUrl(path: string | null): string | null {
  if (!path || !supabase) return null;
  return supabase.storage.from(BUCKET_COVERS).getPublicUrl(path).data.publicUrl;
}

/** Resolve the playable/downloadable URL for a lesson (external link or signed storage URL). */
export async function lessonMediaUrl(lesson: PortalLesson): Promise<string | null> {
  if (lesson.external_url) return lesson.external_url;
  if (!lesson.storage_path) return null;
  const bucket = lesson.kind === 'pdf' ? BUCKET_MATERIALS : BUCKET_VIDEOS;
  return signedUrl(bucket, lesson.storage_path);
}

// ── Progress (optional "mark complete") ──────────────────────────────────────
export async function fetchMyProgress(): Promise<Set<string>> {
  const { data, error } = await sb().from('academy_lesson_progress').select('lesson_id');
  if (error) return new Set<string>();
  return new Set<string>((data || []).map((r: any) => r.lesson_id));
}

export async function setProgress(lessonId: string, done: boolean): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;
  if (done) {
    await sb().from('academy_lesson_progress').upsert({ doctor_id: user.userId, lesson_id: lessonId });
  } else {
    await sb().from('academy_lesson_progress').delete().eq('lesson_id', lessonId).eq('doctor_id', user.userId);
  }
}

// ── Admin: courses & lessons (authenticated client; RLS allows admin writes) ──
export async function adminFetchCourses(): Promise<PortalCourse[]> {
  const { data, error } = await sb().from('academy_courses').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []) as PortalCourse[];
}

export async function adminCreateCourse(payload: Partial<PortalCourse>): Promise<PortalCourse> {
  const { data, error } = await sb().from('academy_courses').insert(payload).select().single();
  if (error) throw error;
  return data as PortalCourse;
}

export async function adminUpdateCourse(id: string, payload: Partial<PortalCourse>): Promise<void> {
  const { error } = await sb().from('academy_courses').update(payload).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteCourse(id: string): Promise<void> {
  const { error } = await sb().from('academy_courses').delete().eq('id', id);
  if (error) throw error;
}

export async function adminCreateLesson(payload: Partial<PortalLesson>): Promise<PortalLesson> {
  const { data, error } = await sb().from('academy_lessons').insert(payload).select().single();
  if (error) throw error;
  return data as PortalLesson;
}

export async function adminUpdateLesson(id: string, payload: Partial<PortalLesson>): Promise<void> {
  const { error } = await sb().from('academy_lessons').update(payload).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteLesson(id: string): Promise<void> {
  const { error } = await sb().from('academy_lessons').delete().eq('id', id);
  if (error) throw error;
}

// ── Admin: uploads (client-side to storage; RLS restricts to admins) ──────────
export async function adminUploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { data, error } = await sb().storage.from(bucket).upload(path, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return data.path;
}

export function bucketForKind(kind: PortalLesson['kind']): string {
  return kind === 'pdf' ? BUCKET_MATERIALS : BUCKET_VIDEOS;
}

// ── Admin: doctors & assignments ──────────────────────────────────────────────
export async function adminListDoctors(): Promise<Profile[]> {
  const { data, error } = await sb()
    .from('academy_profiles')
    .select('*')
    .eq('role', 'doctor')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as Profile[];
}

export async function adminFetchAssignments(): Promise<Assignment[]> {
  const { data, error } = await sb().from('academy_assignments').select('*');
  if (error) throw error;
  return (data || []) as Assignment[];
}

export async function adminAssign(doctorId: string, courseId: string): Promise<void> {
  const { error } = await sb().from('academy_assignments').insert({ doctor_id: doctorId, course_id: courseId });
  if (error && !String(error.message).includes('duplicate')) throw error;
}

export async function adminUnassign(doctorId: string, courseId: string): Promise<void> {
  const { error } = await sb().from('academy_assignments').delete().eq('doctor_id', doctorId).eq('course_id', courseId);
  if (error) throw error;
}

// ── Admin: privileged auth actions (server function w/ service-role key) ──────
async function adminApi(action: string, payload: Record<string, any>): Promise<any> {
  const token = await getAccessToken();
  const res = await fetch('/api/portal-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
    body: JSON.stringify({ action, ...payload }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

export async function adminCreateDoctor(email: string, password: string, fullName: string): Promise<Profile> {
  const json = await adminApi('create_doctor', { email, password, full_name: fullName });
  return json.doctor as Profile;
}

export async function adminDeleteDoctor(id: string): Promise<void> {
  await adminApi('delete_doctor', { id });
}

export async function adminResetDoctorPassword(id: string, password: string): Promise<void> {
  await adminApi('reset_password', { id, password });
}
