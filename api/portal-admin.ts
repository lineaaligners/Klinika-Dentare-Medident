// Vercel Serverless Function — privileged Doctor Portal admin actions.
//
// This is the ONLY place the Supabase service-role key is used. That key can
// bypass every row-level-security rule, so it must never reach the browser.
// Every request is authenticated: the caller must present a valid session token
// AND be an admin before any action runs.
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  const token = String(authHeader).replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return res.status(401).json({ error: 'Missing session token' });
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1) Verify the caller's session token.
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  const callerId = userData.user.id;

  // 2) Confirm the caller is an admin.
  const { data: prof, error: profErr } = await admin
    .from('academy_profiles')
    .select('role')
    .eq('id', callerId)
    .single();
  if (profErr || !prof || prof.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }

  const body = req.body || {};
  const action = body.action;

  try {
    if (action === 'create_doctor') {
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const full_name = String(body.full_name || '').trim();
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'A valid email is required' });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // doctor can log in immediately, no email step
        user_metadata: { full_name, role: 'doctor' },
      });
      if (error) return res.status(400).json({ error: error.message });
      // No global trigger in a shared project — create the academy profile explicitly.
      const { error: pErr } = await admin
        .from('academy_profiles')
        .insert({ id: data.user.id, email: data.user.email, full_name, role: 'doctor' });
      if (pErr && !String(pErr.message).toLowerCase().includes('duplicate')) {
        return res.status(400).json({ error: pErr.message });
      }
      return res.status(200).json({
        doctor: { id: data.user.id, email: data.user.email, full_name, role: 'doctor' },
      });
    }

    if (action === 'delete_doctor') {
      const id = String(body.id || '');
      if (!id) return res.status(400).json({ error: 'Missing doctor id' });
      if (id === callerId) return res.status(400).json({ error: 'You cannot delete your own account' });
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ ok: true });
    }

    if (action === 'reset_password') {
      const id = String(body.id || '');
      const password = String(body.password || '');
      if (!id) return res.status(400).json({ error: 'Missing doctor id' });
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    console.error('portal-admin error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
