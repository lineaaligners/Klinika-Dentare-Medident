import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Vite exposes only VITE_-prefixed vars to the browser bundle.
// We read them defensively so the PUBLIC marketing site still builds and runs
// even if the portal has not been configured with Supabase keys yet.
const env: any = (import.meta as any).env || {};
const url: string | undefined = env.VITE_SUPABASE_URL;
const anonKey: string | undefined = env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured: boolean = Boolean(url && anonKey);

// A single shared client for the whole portal. Null when env vars are absent —
// the portal then shows a friendly "not configured yet" screen instead of
// throwing and taking down the rest of the app.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'medident_portal_auth',
      },
    })
  : null;
