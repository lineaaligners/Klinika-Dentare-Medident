import { supabase } from './supabaseClient';
import {
  Profile,
  ProfileDetails,
  PortalCourse,
  PortalLesson,
  Assignment,
  Lang,
  CatalogCourse,
  RequestResult,
  CourseRequest,
  QuizQuestion,
  QuizQuestionWithKey,
  QuizResult,
  CourseStatus,
  Certificate,
  VerifiedCertificate,
  LessonComment,
  AdminComment,
  UpcomingWebinar,
  AdminStats,
  DoctorProgress,
  LessonStat,
  CourseFeedback,
  AdminFeedback,
  ContinueLearning,
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

/** The address of the portal on this site — used in email links. */
export function portalUrl(): string {
  return `${window.location.origin}/academy/portal`;
}

// ── Auth ────────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  return sb().auth.signInWithPassword({ email: email.trim(), password });
}

// Doctor self-registration. Name and practice details travel as sign-up
// metadata; the database trigger turns them into an academy profile with role
// 'doctor' (never admin).
export async function signUp(email: string, password: string, details: ProfileDetails) {
  return sb().auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: details.full_name.trim(),
        clinic: details.clinic.trim(),
        city: details.city.trim(),
        country: details.country.trim(),
        phone: details.phone.trim(),
      },
      emailRedirectTo: portalUrl(),
    },
  });
}

/** Sends a "reset your password" email (works only once SMTP is set up in Supabase). */
export async function requestPasswordReset(email: string) {
  return sb().auth.resetPasswordForEmail(email.trim(), { redirectTo: portalUrl() });
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

/** Doctors update their own name and practice details (never the role). */
export async function updateMyProfile(details: ProfileDetails): Promise<Profile> {
  const { data, error } = await sb().rpc('academy_update_my_profile', {
    p_full_name: details.full_name,
    p_clinic: details.clinic,
    p_city: details.city,
    p_country: details.country,
    p_phone: details.phone,
  });
  if (error) throw error;
  return data as Profile;
}

/** Records that the user opened the portal (for "active doctors" stats). */
export async function touchPresence(): Promise<void> {
  await sb().rpc('academy_touch');
}

export function isProfileComplete(p: Profile | null | undefined): boolean {
  return Boolean(p && p.full_name?.trim() && p.clinic?.trim() && p.phone?.trim());
}

// ── Doctor-facing data (row-level security returns only what they may see) ────
/** Courses the user can open. Admins see every published course (preview). */
export async function fetchMyCourses(includeAll = false): Promise<PortalCourse[]> {
  if (includeAll) {
    const { data, error } = await sb()
      .from('academy_courses')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data || []) as PortalCourse[];
  }
  const user = await getSessionUser();
  if (!user) return [];
  const { data, error } = await sb()
    .from('academy_assignments')
    .select('course:academy_courses(*)')
    .eq('doctor_id', user.userId);
  if (error) throw error;
  return ((data || []) as any[])
    .map((row) => row.course as PortalCourse | null)
    .filter((c): c is PortalCourse => Boolean(c && c.is_published))
    .sort((a, b) => a.sort_order - b.sort_order);
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
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
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

/** Live webinars (from now minus 3 hours) in the courses this user can open. */
export async function fetchUpcomingWebinars(): Promise<UpcomingWebinar[]> {
  const since = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const { data, error } = await sb()
    .from('academy_lessons')
    .select('*, course:academy_courses!inner(title_en, title_sq, is_published)')
    .eq('kind', 'webinar_live')
    .eq('course.is_published', true) // drafts never show on the dashboard
    .gte('webinar_at', since)
    .order('webinar_at', { ascending: true })
    .limit(20);
  if (error) return [];
  return (data || []) as UpcomingWebinar[];
}

// ── Catalog & access requests ────────────────────────────────────────────────
export async function fetchCatalog(): Promise<CatalogCourse[]> {
  const { data, error } = await sb().rpc('academy_catalog');
  if (error) throw error;
  return (data || []) as CatalogCourse[];
}

export async function requestCourse(courseId: string, message: string): Promise<RequestResult> {
  const { data, error } = await sb().rpc('academy_request_course', { p_course_id: courseId, p_message: message });
  if (error) throw error;
  const result = data as RequestResult;
  if (result === 'requested') void notify('course_requested', { course_id: courseId });
  return result;
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

// ── Progress & views ──────────────────────────────────────────────────────────
export async function fetchMyProgress(): Promise<Set<string>> {
  const { data, error } = await sb().from('academy_lesson_progress').select('lesson_id');
  if (error) return new Set<string>();
  return new Set<string>((data || []).map((r: any) => r.lesson_id));
}

export async function setProgress(lessonId: string, done: boolean): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;
  if (done) {
    const { error } = await sb().from('academy_lesson_progress').upsert({ doctor_id: user.userId, lesson_id: lessonId });
    if (error) throw error;
  } else {
    const { error } = await sb().from('academy_lesson_progress').delete().eq('lesson_id', lessonId).eq('doctor_id', user.userId);
    if (error) throw error;
  }
}

/** Remembers that this doctor opened the lesson (for "who watched what"). */
export async function trackLessonView(lessonId: string): Promise<void> {
  await sb().rpc('academy_track_view', { p_lesson_id: lessonId });
}

// ── Continue where you left off ───────────────────────────────────────────────
/** The lesson to reopen on the dashboard (null when there is nothing to continue). */
export async function fetchContinueLearning(): Promise<ContinueLearning | null> {
  const { data, error } = await sb().rpc('academy_continue_learning');
  if (error) return null;
  return (data as ContinueLearning) || null;
}

/** Seconds into an uploaded video where the doctor stopped last time (0 = start). */
export async function fetchLessonPosition(lessonId: string): Promise<number> {
  const user = await getSessionUser();
  if (!user) return 0;
  const { data } = await sb()
    .from('academy_lesson_views')
    .select('position_seconds')
    .eq('doctor_id', user.userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();
  return Number((data as any)?.position_seconds) || 0;
}

export async function saveLessonPosition(lessonId: string, seconds: number): Promise<void> {
  await sb().rpc('academy_save_position', { p_lesson_id: lessonId, p_seconds: Math.max(0, Math.floor(seconds)) });
}

// ── Course feedback ───────────────────────────────────────────────────────────
export async function fetchMyFeedback(courseId: string): Promise<CourseFeedback | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const { data, error } = await sb()
    .from('academy_course_feedback')
    .select('*')
    .eq('doctor_id', user.userId)
    .eq('course_id', courseId)
    .maybeSingle();
  if (error) return null;
  return (data as CourseFeedback) || null;
}

export async function submitFeedback(courseId: string, rating: number, comment: string, allowQuote: boolean): Promise<CourseFeedback> {
  const { data, error } = await sb().rpc('academy_submit_feedback', {
    p_course_id: courseId,
    p_rating: rating,
    p_comment: comment,
    p_allow_quote: allowQuote,
  });
  if (error) throw error;
  return data as CourseFeedback;
}

// ── Course status, quiz & certificates ───────────────────────────────────────
export async function fetchCourseStatus(courseId: string): Promise<CourseStatus | null> {
  const { data, error } = await sb().rpc('academy_course_status', { p_course_id: courseId });
  if (error) return null;
  return data as CourseStatus;
}

export async function fetchQuizQuestions(courseId: string): Promise<QuizQuestion[]> {
  const { data, error } = await sb()
    .from('academy_quiz_questions')
    .select('id, course_id, question_en, question_sq, options, sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as QuizQuestion[];
}

export async function submitQuiz(courseId: string, answers: Record<string, number>): Promise<QuizResult> {
  const { data, error } = await sb().rpc('academy_submit_quiz', { p_course_id: courseId, p_answers: answers });
  if (error) throw error;
  return data as QuizResult;
}

export async function claimCertificate(courseId: string): Promise<Certificate> {
  const { data, error } = await sb().rpc('academy_claim_certificate', { p_course_id: courseId });
  if (error) throw error;
  return data as Certificate;
}

export async function fetchMyCertificates(): Promise<Certificate[]> {
  const user = await getSessionUser();
  if (!user) return [];
  const { data, error } = await sb()
    .from('academy_certificates')
    .select('*')
    .eq('doctor_id', user.userId)
    .is('revoked_at', null)
    .order('issued_at', { ascending: false });
  if (error) return [];
  return (data || []) as Certificate[];
}

/** Public check of a certificate code (works without signing in). */
export async function verifyCertificate(code: string): Promise<VerifiedCertificate | null> {
  const { data, error } = await sb().rpc('academy_verify_certificate', { p_code: code });
  if (error) throw error;
  return (data as VerifiedCertificate) || null;
}

export function certificateVerifyUrl(code: string): string {
  return `${window.location.origin}/academy/verify/${encodeURIComponent(code)}`;
}

/** LinkedIn "Add license or certification", pre-filled for this certificate. */
export function linkedInAddUrl(cert: Certificate): string {
  const issued = new Date(cert.issued_at);
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: cert.course_title_en,
    organizationName: 'Medident Academy',
    issueYear: String(issued.getFullYear()),
    issueMonth: String(issued.getMonth() + 1),
    certUrl: certificateVerifyUrl(cert.code),
    certId: cert.code,
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

// ── Lesson Q&A ───────────────────────────────────────────────────────────────
export async function fetchComments(lessonId: string): Promise<LessonComment[]> {
  const { data, error } = await sb()
    .from('academy_lesson_comments')
    .select('id, lesson_id, author_id, parent_id, author_name, author_is_admin, body, created_at')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as LessonComment[];
}

export async function postComment(lessonId: string, body: string, parentId: string | null): Promise<LessonComment> {
  const user = await getSessionUser();
  if (!user) throw new Error('Not signed in');
  const { data, error } = await sb()
    .from('academy_lesson_comments')
    .insert({ lesson_id: lessonId, author_id: user.userId, parent_id: parentId, body })
    .select('id, lesson_id, author_id, parent_id, author_name, author_is_admin, body, created_at')
    .single();
  if (error) throw error;
  const comment = data as LessonComment;
  void notify('comment_posted', { comment_id: comment.id });
  return comment;
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await sb().from('academy_lesson_comments').delete().eq('id', id);
  if (error) throw error;
}

// ── Email notifications (server function; best effort, never blocks the UI) ──
export interface NotifyResult {
  sent: number;
  failed: number;
  smtp: boolean;
  skipped?: string;
}

/** Tells the email function what just happened. Best effort: null when it could not be reached. */
export async function notify(action: string, payload: Record<string, any>): Promise<NotifyResult | null> {
  try {
    const token = await getAccessToken();
    if (!token) return null;
    const res = await fetch('/api/portal-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, ...payload }),
    });
    if (!res.ok) return null;
    const json: any = await res.json().catch(() => ({}));
    return { sent: Number(json.sent) || 0, failed: Number(json.failed) || 0, smtp: Boolean(json.smtp), skipped: json.skipped || undefined };
  } catch {
    return null;
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

/** Save a new lesson order: each lesson's sort_order becomes its position. */
export async function adminReorderLessons(ordered: PortalLesson[]): Promise<void> {
  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i].sort_order !== i) await adminUpdateLesson(ordered[i].id, { sort_order: i });
  }
}

/** Per-lesson viewers / completions for the admin course editor. */
export async function adminLessonStats(courseId: string): Promise<Record<string, LessonStat>> {
  const { data, error } = await sb().rpc('academy_admin_lesson_stats', { p_course_id: courseId });
  if (error) return {};
  const map: Record<string, LessonStat> = {};
  for (const row of (data || []) as LessonStat[]) map[row.lesson_id] = row;
  return map;
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

export async function adminRemoveFile(bucket: string, path: string): Promise<void> {
  await sb().storage.from(bucket).remove([path]);
}

export function bucketForKind(kind: PortalLesson['kind']): string {
  return kind === 'pdf' ? BUCKET_MATERIALS : BUCKET_VIDEOS;
}

// ── Admin: quiz ──────────────────────────────────────────────────────────────
export async function adminFetchQuiz(courseId: string): Promise<QuizQuestionWithKey[]> {
  const questions = await fetchQuizQuestions(courseId);
  if (questions.length === 0) return [];
  const { data, error } = await sb()
    .from('academy_quiz_keys')
    .select('question_id, correct_index')
    .in('question_id', questions.map((q) => q.id));
  if (error) throw error;
  const keys = new Map<string, number>((data || []).map((k: any) => [k.question_id, k.correct_index]));
  return questions.map((q) => ({ ...q, correct_index: keys.has(q.id) ? (keys.get(q.id) as number) : null }));
}

export async function adminSaveQuestion(
  courseId: string,
  question: { id?: string; question_en: string; question_sq: string | null; options: { en: string; sq?: string }[]; sort_order: number },
  correctIndex: number,
): Promise<void> {
  const row = {
    course_id: courseId,
    question_en: question.question_en,
    question_sq: question.question_sq,
    options: question.options,
    sort_order: question.sort_order,
  };
  let id = question.id;
  if (id) {
    const { error } = await sb().from('academy_quiz_questions').update(row).eq('id', id);
    if (error) throw error;
  } else {
    const { data, error } = await sb().from('academy_quiz_questions').insert(row).select('id').single();
    if (error) throw error;
    id = (data as any).id as string;
  }
  const { error: kErr } = await sb()
    .from('academy_quiz_keys')
    .upsert({ question_id: id, correct_index: correctIndex });
  if (kErr) throw kErr;
}

export async function adminDeleteQuestion(id: string): Promise<void> {
  const { error } = await sb().from('academy_quiz_questions').delete().eq('id', id);
  if (error) throw error;
}

// ── Admin: doctors, assignments & requests ────────────────────────────────────
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
  if (!error) void notify('course_assigned', { doctor_id: doctorId, course_id: courseId });
}

export async function adminUnassign(doctorId: string, courseId: string): Promise<void> {
  const { error } = await sb().from('academy_assignments').delete().eq('doctor_id', doctorId).eq('course_id', courseId);
  if (error) throw error;
}

export async function adminFetchRequests(): Promise<CourseRequest[]> {
  const { data, error } = await sb()
    .from('academy_course_requests')
    .select(
      '*, doctor:academy_profiles(full_name, email, clinic, city, country, phone, created_at), course:academy_courses(title_en, title_sq)',
    )
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data || []) as CourseRequest[];
}

export async function adminDecideRequest(requestId: string, approve: boolean): Promise<void> {
  const { error } = await sb().rpc('academy_decide_request', { p_request_id: requestId, p_approve: approve });
  if (error) throw error;
  void notify('request_decided', { request_id: requestId });
}

// ── Admin: Q&A and statistics ─────────────────────────────────────────────────
export async function adminFetchRecentComments(): Promise<AdminComment[]> {
  const { data, error } = await sb()
    .from('academy_lesson_comments')
    .select(
      'id, lesson_id, author_id, parent_id, author_name, author_is_admin, body, created_at, lesson:academy_lessons(id, title_en, title_sq, course_id, course:academy_courses(title_en, title_sq))',
    )
    .order('created_at', { ascending: false })
    .limit(400);
  if (error) throw error;
  // Embedded rows are single objects at runtime (many-to-one); the untyped client guesses arrays.
  return (data || []) as unknown as AdminComment[];
}

export async function adminStats(): Promise<AdminStats> {
  const { data, error } = await sb().rpc('academy_admin_stats');
  if (error) throw error;
  return data as AdminStats;
}

export async function adminDoctorProgress(): Promise<DoctorProgress[]> {
  const { data, error } = await sb().rpc('academy_admin_doctor_progress');
  if (error) throw error;
  return (data || []) as DoctorProgress[];
}

/** Withdraw (or restore) a certificate. A withdrawn one no longer verifies and cannot be re-claimed. */
export async function adminSetCertificateRevoked(code: string, revoked: boolean): Promise<void> {
  const { error } = await sb().rpc('academy_set_certificate_revoked', { p_code: code, p_revoked: revoked });
  if (error) throw error;
}

/** Every certificate, withdrawn ones included (for the Excel export). */
export async function adminFetchCertificates(): Promise<Certificate[]> {
  const { data, error } = await sb().from('academy_certificates').select('*').order('issued_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Certificate[];
}

export async function adminFetchFeedback(): Promise<AdminFeedback[]> {
  const { data, error } = await sb()
    .from('academy_course_feedback')
    .select('*, doctor:academy_profiles(full_name, email, clinic, city), course:academy_courses(title_en, title_sq)')
    .order('updated_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data || []) as unknown as AdminFeedback[];
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
