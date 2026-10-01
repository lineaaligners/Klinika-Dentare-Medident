// Public Academy data (no sign-in). A plain fetch on purpose: the marketing site
// stays free of the Supabase client, which only loads inside the portal.

export interface Testimonial {
  name: string;
  city: string | null;
  course_title_en: string;
  course_title_sq: string | null;
  rating: number;
  comment: string;
  date: string;
}

const env: any = (import.meta as any).env || {};

/** Doctor feedback the academy chose to show on the Academy page ([] when none or offline). */
export async function fetchPublicTestimonials(): Promise<Testimonial[]> {
  const url: string | undefined = env.VITE_SUPABASE_URL;
  const key: string | undefined = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/rpc/academy_public_testimonials`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as Testimonial[]) : [];
  } catch {
    return [];
  }
}
