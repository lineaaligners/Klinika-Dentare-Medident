// Shared types for the Medident Academy Doctor Portal.

export type Lang = 'en' | 'sq';

export type LessonKind = 'video' | 'webinar_recorded' | 'webinar_live' | 'pdf';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'doctor' | 'admin';
  created_at?: string;
  clinic?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  last_seen_at?: string | null;
}

/** Practice details a doctor gives at sign-up / in Account. */
export interface ProfileDetails {
  full_name: string;
  clinic: string;
  city: string;
  country: string;
  phone: string;
}

export interface PortalCourse {
  id: string;
  title_en: string;
  title_sq: string | null;
  description_en: string | null;
  description_sq: string | null;
  cover_path: string | null;
  sort_order: number;
  is_published: boolean;
  instructor_name?: string | null;
  quiz_pass_percent?: number;
  /** Continuing-education hours printed on the certificate. */
  cpd_hours?: number | null;
  created_at?: string;
}

export interface PortalLesson {
  id: string;
  course_id: string;
  title_en: string;
  title_sq: string | null;
  description_en: string | null;
  description_sq: string | null;
  kind: LessonKind;
  storage_path: string | null;
  external_url: string | null;
  webinar_at: string | null;
  join_url: string | null;
  duration_min: number | null;
  sort_order: number;
  announced_at?: string | null;
  created_at?: string;
}

export interface Assignment {
  id: string;
  doctor_id: string;
  course_id: string;
  assigned_at?: string;
}

// ── Catalog & requests ───────────────────────────────────────────────────────
export type RequestStatus = 'pending' | 'approved' | 'declined';

export interface CatalogCourse {
  id: string;
  title_en: string;
  title_sq: string | null;
  description_en: string | null;
  description_sq: string | null;
  cover_path: string | null;
  instructor_name: string | null;
  sort_order: number;
  lesson_count: number;
  assigned: boolean;
  request_status: RequestStatus | null;
}

export type RequestResult =
  | 'requested'
  | 'already_pending'
  | 'already_assigned'
  | 'profile_incomplete'
  | 'not_found';

export interface CourseRequest {
  id: string;
  doctor_id: string;
  course_id: string;
  message: string | null;
  status: RequestStatus;
  created_at: string;
  decided_at: string | null;
  doctor?: Pick<Profile, 'full_name' | 'email' | 'clinic' | 'city' | 'country' | 'phone' | 'created_at'> | null;
  course?: Pick<PortalCourse, 'title_en' | 'title_sq'> | null;
}

// ── Quizzes ──────────────────────────────────────────────────────────────────
export interface QuizOption {
  en: string;
  sq?: string;
}

export interface QuizQuestion {
  id: string;
  course_id: string;
  question_en: string;
  question_sq: string | null;
  options: QuizOption[];
  sort_order: number;
}

/** Admin view of a question, including which option is correct. */
export interface QuizQuestionWithKey extends QuizQuestion {
  correct_index: number | null;
}

export interface QuizResult {
  correct: number;
  total: number;
  score: number;
  passed: boolean;
  pass_percent: number;
  /** Ids of wrongly answered questions — only filled in once the quiz is passed. */
  wrong: string[];
  /** Tries left in the current 24-hour window (5 per day). */
  attempts_left: number;
}

// ── Course status & certificates ─────────────────────────────────────────────
export interface CourseStatus {
  lessons_total: number;
  lessons_done: number;
  quiz_questions: number;
  quiz_passed: boolean;
  best_score: number | null;
  pass_percent: number;
  quiz_attempts_left: number;
  /** When the daily attempt limit is reached: the time a new try is allowed. */
  quiz_retry_at: string | null;
  eligible: boolean;
  certificate: { code: string; issued_at: string } | null;
  /** The academy withdrew this doctor's certificate for the course. */
  certificate_revoked: boolean;
}

export interface Certificate {
  id: string;
  code: string;
  doctor_id: string;
  course_id: string | null;
  doctor_name: string;
  course_title_en: string;
  course_title_sq: string | null;
  instructor_name: string | null;
  issued_at: string;
  revoked_at?: string | null;
  cpd_hours?: number | null;
}

export interface VerifiedCertificate {
  code: string;
  doctor_name: string;
  course_title_en: string;
  course_title_sq: string | null;
  instructor_name: string | null;
  issued_at: string;
  cpd_hours?: number | null;
}

// ── Feedback ─────────────────────────────────────────────────────────────────
export interface CourseFeedback {
  doctor_id: string;
  course_id: string;
  rating: number;
  comment: string | null;
  allow_quote: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminFeedback extends CourseFeedback {
  doctor?: Pick<Profile, 'full_name' | 'email' | 'clinic' | 'city'> | null;
  course?: Pick<PortalCourse, 'title_en' | 'title_sq'> | null;
}

// ── Continue where you left off ──────────────────────────────────────────────
export interface ContinueLearning {
  course_id: string;
  course_title_en: string;
  course_title_sq: string | null;
  cover_path: string | null;
  lesson_id: string;
  lesson_title_en: string;
  lesson_title_sq: string | null;
  kind: LessonKind;
  position_seconds: number;
  lessons_total: number;
  lessons_done: number;
}

// ── Lesson Q&A ───────────────────────────────────────────────────────────────
export interface LessonComment {
  id: string;
  lesson_id: string;
  author_id: string;
  parent_id: string | null;
  author_name: string | null;
  author_is_admin: boolean;
  body: string;
  created_at: string;
}

export interface AdminComment extends LessonComment {
  lesson?: {
    id: string;
    title_en: string;
    title_sq: string | null;
    course_id: string;
    course?: { title_en: string; title_sq: string | null } | null;
  } | null;
}

// ── Webinars ─────────────────────────────────────────────────────────────────
export interface UpcomingWebinar extends PortalLesson {
  course?: { title_en: string; title_sq: string | null } | null;
}

// ── Admin statistics ─────────────────────────────────────────────────────────
export interface CourseStat {
  id: string;
  title_en: string;
  title_sq: string | null;
  is_published: boolean;
  lessons: number;
  assigned: number;
  completed: number;
  avg_progress: number;
  certificates: number;
  quiz_questions: number;
  quiz_passed: number;
  pending_requests: number;
}

export interface AdminStats {
  doctors: number;
  active_7d: number;
  new_30d: number;
  courses: number;
  assignments: number;
  certificates: number;
  pending_requests: number;
  open_questions: number;
  course_stats: CourseStat[];
  recent_certificates: Pick<Certificate, 'code' | 'doctor_name' | 'course_title_en' | 'course_title_sq' | 'issued_at' | 'revoked_at'>[];
}

export interface DoctorCourseProgress {
  course_id: string;
  title_en: string;
  title_sq: string | null;
  lessons_total: number;
  lessons_done: number;
  last_viewed_at: string | null;
  best_score: number | null;
  certificate_code: string | null;
}

export interface DoctorProgress {
  id: string;
  full_name: string | null;
  email: string | null;
  clinic: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  created_at: string;
  last_seen_at: string | null;
  courses: DoctorCourseProgress[];
}

export interface LessonStat {
  lesson_id: string;
  viewers: number;
  completions: number;
}

// Storage bucket ids (kept in one place so app + policies stay in sync).
export const BUCKET_VIDEOS = 'academy-videos';
export const BUCKET_MATERIALS = 'academy-materials';
export const BUCKET_COVERS = 'academy-covers';
