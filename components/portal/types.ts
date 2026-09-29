// Shared types for the Medident Academy Doctor Portal.

export type Lang = 'en' | 'sq';

export type LessonKind = 'video' | 'webinar_recorded' | 'webinar_live' | 'pdf';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'doctor' | 'admin';
  created_at?: string;
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
  created_at?: string;
}

export interface Assignment {
  id: string;
  doctor_id: string;
  course_id: string;
  assigned_at?: string;
}

// Storage bucket ids (kept in one place so app + policies stay in sync).
export const BUCKET_VIDEOS = 'academy-videos';
export const BUCKET_MATERIALS = 'academy-materials';
export const BUCKET_COVERS = 'academy-covers';
