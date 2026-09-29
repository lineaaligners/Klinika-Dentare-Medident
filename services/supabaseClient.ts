import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Vite exposes only VITE_-prefixed vars to the browser bundle.
// We read them defensively so the PUBLIC marketing site still builds and runs
// even if the portal has not been configured with Supabase keys yet.
const env: any = (import.meta as any).env || {};
const url: string | undefined = env.VITE_SUPABASE_URL;
const anonKey: string | undefined = env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured: boolean = Boolean(url && anonKey);

// Links from Supabase emails (password reset, email confirmation) land on the
// portal with details in the URL hash. Capture them BEFORE the client below
// reads and clears the hash, so the portal knows to show "set a new password"
// or explain an expired link.
const initialHash = typeof window !== 'undefined' ? window.location.hash || '' : '';
const hashParams = new URLSearchParams(initialHash.replace(/^#/, ''));
export const authRedirect: { recovery: boolean; error: string | null } = {
  /** The visitor arrived from a "reset your password" email. */
  recovery: hashParams.get('type') === 'recovery',
  /** The link was invalid or expired (Supabase puts the reason in the hash). */
  error: hashParams.get('error_description') || hashParams.get('error') || null,
};

/** The email-link state belongs to the first portal visit only. */
export function clearAuthRedirect() {
  authRedirect.recovery = false;
  authRedirect.error = null;
}

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
