// Public Supabase config for /pergjigje (URL + anon key are public by design).
export default function handler(_req: any, res: any) {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return res.status(500).json({ error: 'not_configured' });
  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).json({ url, anonKey });
}
