// Vercel Serverless Function — Doctor Portal emails.
//
//   POST  (signed-in portal users)  -> one notification for something that just
//         happened: a course was assigned, a request was made or decided, a live
//         webinar was scheduled, a question/answer was posted.
//   GET   (Vercel Cron, once a day)  -> reminders for live webinars in the next
//         ~30 hours.
//
// Emails go out through the academy's SMTP mailbox (env SMTP_*). Without those
// variables every call is a harmless no-op, so the portal keeps working.
// Each action re-checks permissions and loads its data itself with the service
// role — the browser only says WHAT happened, never who to email or what to say.
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export const config = { maxDuration: 60 };

const PORTAL_URL = process.env.PORTAL_URL || 'https://medident-ks.com/academy/portal';
const CONTACT_EMAIL = process.env.ACADEMY_CONTACT_EMAIL || 'medident-ks@gmail.com';
const TIME_ZONE = 'Europe/Belgrade'; // Kosovo time
const FRESH_MINUTES = 15; // doctor-triggered emails only for things created this recently

type Lang = 'sq' | 'en';
interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; content: string; contentType: string }[];
}
interface Person {
  email: string | null;
  full_name: string | null;
}

// ── Sending ───────────────────────────────────────────────────────────────────
const smtpReady = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transport: any = null;
function getTransport() {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 465);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      pool: true,
      maxConnections: 2,
    });
  }
  return transport;
}

async function sendAll(mails: Mail[]): Promise<{ sent: number; failed: number }> {
  if (!smtpReady() || mails.length === 0) return { sent: 0, failed: 0 };
  const from = process.env.SMTP_FROM || `Medident Academy <${process.env.SMTP_USER}>`;
  let sent = 0;
  let failed = 0;
  for (const m of mails) {
    try {
      await getTransport().sendMail({ from, replyTo: CONTACT_EMAIL, ...m });
      sent++;
    } catch (e: any) {
      failed++;
      console.error('portal-notify: send failed', m.to, e?.message);
    }
  }
  return { sent, failed };
}

// ── Formatting helpers ────────────────────────────────────────────────────────
const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const oneLine = (s: unknown) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim();
const firstName = (p: Person | null | undefined) => oneLine(p?.full_name) || oneLine(p?.email?.split('@')[0]) || '';
const pick = (en: string | null | undefined, sq: string | null | undefined, lang: Lang) =>
  lang === 'sq' ? sq || en || '' : en || sq || '';

function when(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const text = new Intl.DateTimeFormat(lang === 'sq' ? 'sq-AL' : 'en-GB', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
  return `${text} ${lang === 'sq' ? '(ora e Kosovës)' : '(Kosovo time)'}`;
}

interface Section {
  title: string;
  paragraphs: string[]; // already-escaped HTML
}

/** One email with an Albanian and an English section and a single button. */
function bilingual(preheader: string, sq: Section, en: Section, cta = { url: PORTAL_URL, label: 'Hap portalin · Open the portal' }) {
  const block = (s: Section) => `
    <h2 style="margin:0 0 12px;font-size:19px;line-height:1.3;color:#0f172a;font-weight:800">${esc(s.title)}</h2>
    ${s.paragraphs.map((p) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155">${p}</p>`).join('')}`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f1f5f9">
<span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<tr><td style="padding:22px 28px;border-bottom:1px solid #e2e8f0">
<div style="font-size:17px;font-weight:900;letter-spacing:-0.5px;color:#0f172a">MEDIDENT<span style="color:#2563eb">.</span>ACADEMY</div>
<div style="font-size:9px;font-weight:800;letter-spacing:3px;color:#94a3b8;text-transform:uppercase;margin-top:2px">Doctor Portal</div>
</td></tr>
<tr><td style="padding:28px 28px 8px">${block(sq)}</td></tr>
<tr><td style="padding:0 28px"><div style="border-top:1px dashed #e2e8f0;margin:8px 0 20px"></div></td></tr>
<tr><td style="padding:0 28px 8px">${block(en)}</td></tr>
<tr><td style="padding:8px 28px 30px">
<a href="${esc(cta.url)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:0.5px;padding:13px 22px;border-radius:12px">${esc(cta.label)}</a>
</td></tr>
<tr><td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;line-height:1.6;color:#94a3b8">
Medident Academy · Klinika Dentare Medident · Pejë, Kosovo<br>
Pyetje? · Questions? <a href="mailto:${esc(CONTACT_EMAIL)}" style="color:#64748b">${esc(CONTACT_EMAIL)}</a>
</td></tr>
</table></td></tr></table></body></html>`;
  const plain = (s: Section) =>
    `${s.title}\n\n${s.paragraphs.map((p) => p.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")).join('\n\n')}`;
  const text = `${plain(sq)}\n\n— — —\n\n${plain(en)}\n\n${cta.url}\n\nMedident Academy · Pejë, Kosovo · ${CONTACT_EMAIL}`;
  return { html, text };
}

// ── Calendar file for live webinars ───────────────────────────────────────────
function icsText(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}
function icsFold(line: string) {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 73) {
    out.push(rest.slice(0, 73));
    rest = ' ' + rest.slice(73);
  }
  out.push(rest);
  return out.join('\r\n');
}
function webinarIcs(lesson: any, courseTitle: string): string {
  const start = new Date(lesson.webinar_at);
  const end = new Date(start.getTime() + (Number(lesson.duration_min) || 60) * 60000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const title = `${lesson.title_en}${courseTitle ? ` — ${courseTitle}` : ''}`;
  const desc = `Medident Academy live webinar.${lesson.join_url ? `\nJoin: ${lesson.join_url}` : ''}\nPortal: ${PORTAL_URL}`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Medident Academy//Doctor Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${lesson.id}@medident-ks.com`,
    `SEQUENCE:${Math.floor(Date.now() / 60000)}`, // newer file updates the same calendar entry
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${icsText(title)}`,
    `DESCRIPTION:${icsText(desc)}`,
    `LOCATION:${icsText(lesson.join_url || 'Medident Academy portal')}`,
    ...(lesson.join_url ? [`URL:${lesson.join_url}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .map(icsFold)
    .join('\r\n');
}

// ── Email templates ───────────────────────────────────────────────────────────
function accessGrantedMail(doctor: Person, course: any): Mail | null {
  if (!doctor.email) return null;
  const name = esc(firstName(doctor));
  const { html, text } = bilingual(
    'You now have access to a new course',
    {
      title: 'Keni qasje në një kurs të ri',
      paragraphs: [
        `Përshëndetje ${name},`,
        `Tani keni qasje në kursin <strong>${esc(pick(course.title_en, course.title_sq, 'sq'))}</strong> në Akademinë Medident. Hyni në portal për të parë mësimet, webinaret dhe materialet.`,
      ],
    },
    {
      title: 'You have access to a new course',
      paragraphs: [
        `Hello ${name},`,
        `You now have access to <strong>${esc(course.title_en)}</strong> at Medident Academy. Sign in to the portal to see the lessons, webinars and materials.`,
      ],
    },
  );
  return {
    to: doctor.email,
    subject: oneLine(`Kurs i ri · New course: ${course.title_en} — Medident Academy`),
    html,
    text,
  };
}

function requestDeclinedMail(doctor: Person, course: any): Mail | null {
  if (!doctor.email) return null;
  const name = esc(firstName(doctor));
  const { html, text } = bilingual(
    'About your course request',
    {
      title: 'Rreth kërkesës suaj për kurs',
      paragraphs: [
        `Përshëndetje ${name},`,
        `Kërkesa juaj për kursin <strong>${esc(pick(course.title_en, course.title_sq, 'sq'))}</strong> nuk u miratua këtë herë. Për pyetje, na shkruani në <a href="mailto:${esc(CONTACT_EMAIL)}">${esc(CONTACT_EMAIL)}</a>.`,
      ],
    },
    {
      title: 'About your course request',
      paragraphs: [
        `Hello ${name},`,
        `Your request for <strong>${esc(course.title_en)}</strong> was not approved this time. If you have questions, write to us at <a href="mailto:${esc(CONTACT_EMAIL)}">${esc(CONTACT_EMAIL)}</a>.`,
      ],
    },
  );
  return { to: doctor.email, subject: oneLine(`Kërkesa juaj · Your course request — Medident Academy`), html, text };
}

function requestToAdminMail(admin: Person, doctor: any, course: any, message: string | null): Mail | null {
  if (!admin.email) return null;
  const details = [
    `<strong>${esc(doctor.full_name || doctor.email)}</strong> (${esc(doctor.email)})`,
    [doctor.clinic, doctor.city, doctor.country].filter(Boolean).map(esc).join(', '),
    doctor.phone ? `☎ ${esc(doctor.phone)}` : '',
  ]
    .filter(Boolean)
    .join('<br>');
  const msg = message ? `<em>“${esc(message)}”</em>` : '';
  const { html, text } = bilingual(
    'A doctor asked for access to a course',
    {
      title: 'Kërkesë e re për kurs',
      paragraphs: [`Një mjek kërkon qasje në <strong>${esc(pick(course.title_en, course.title_sq, 'sq'))}</strong>:`, details, msg, 'Miratoni ose refuzoni te Admin → Kërkesat.'].filter(Boolean),
    },
    {
      title: 'New course request',
      paragraphs: [`A doctor is asking for access to <strong>${esc(course.title_en)}</strong>:`, details, msg, 'Approve or decline in Admin → Requests.'].filter(Boolean),
    },
    { url: PORTAL_URL, label: 'Shqyrto · Review' },
  );
  return {
    to: admin.email,
    subject: oneLine(`Kërkesë e re · New request: ${doctor.full_name || doctor.email} → ${course.title_en}`),
    html,
    text,
  };
}

function webinarMail(doctor: Person, lesson: any, course: any, kind: 'announce' | 'reminder'): Mail | null {
  if (!doctor.email) return null;
  const name = esc(firstName(doctor));
  const title = (lang: Lang) => esc(pick(lesson.title_en, lesson.title_sq, lang));
  const courseTitle = (lang: Lang) => esc(pick(course?.title_en, course?.title_sq, lang));
  const join = lesson.join_url
    ? { sq: `Linku: <a href="${esc(lesson.join_url)}">${esc(lesson.join_url)}</a>`, en: `Join link: <a href="${esc(lesson.join_url)}">${esc(lesson.join_url)}</a>` }
    : { sq: 'Linku do të jetë në portal.', en: 'The join link will be in the portal.' };
  const isReminder = kind === 'reminder';
  const { html, text } = bilingual(
    isReminder ? 'Reminder: live webinar soon' : 'New live webinar scheduled',
    {
      title: isReminder ? 'Kujtesë: webinar së shpejti' : 'Webinar i ri live',
      paragraphs: [
        `Përshëndetje ${name},`,
        `${isReminder ? 'Ju kujtojmë për webinarin' : 'U planifikua webinari'} <strong>${title('sq')}</strong>${course ? ` (kursi ${courseTitle('sq')})` : ''}.`,
        `🗓 <strong>${esc(when(lesson.webinar_at, 'sq'))}</strong>`,
        join.sq,
      ],
    },
    {
      title: isReminder ? 'Reminder: live webinar soon' : 'New live webinar',
      paragraphs: [
        `Hello ${name},`,
        `${isReminder ? 'A reminder about' : 'A live webinar has been scheduled:'} <strong>${title('en')}</strong>${course ? ` (${courseTitle('en')})` : ''}.`,
        `🗓 <strong>${esc(when(lesson.webinar_at, 'en'))}</strong>`,
        join.en,
      ],
    },
  );
  return {
    to: doctor.email,
    subject: oneLine(`${isReminder ? 'Kujtesë · Reminder' : 'Webinar i ri · New webinar'}: ${lesson.title_en} — Medident Academy`),
    html,
    text,
    attachments: [{ filename: 'webinar.ics', content: webinarIcs(lesson, course?.title_en || ''), contentType: 'text/calendar; charset=utf-8; method=PUBLISH' }],
  };
}

function questionToAdminMail(admin: Person, comment: any, lesson: any, course: any, isReply: boolean): Mail | null {
  if (!admin.email) return null;
  const who = esc(comment.author_name || 'A doctor');
  const where = `${esc(lesson?.title_en || '')}${course ? ` — ${esc(course.title_en)}` : ''}`;
  const quote = `<em>“${esc(comment.body).replace(/\n/g, '<br>')}”</em>`;
  const { html, text } = bilingual(
    isReply ? 'New reply in a lesson thread' : 'New question from a doctor',
    {
      title: isReply ? 'Përgjigje e re në diskutim' : 'Pyetje e re nga një mjek',
      paragraphs: [`<strong>${who}</strong> te <strong>${where}</strong>:`, quote, 'Përgjigjuni te Admin → Pyetjet ose direkt te mësimi.'],
    },
    {
      title: isReply ? 'New reply in a lesson thread' : 'New question from a doctor',
      paragraphs: [`<strong>${who}</strong> on <strong>${where}</strong>:`, quote, 'Answer in Admin → Q&A or directly under the lesson.'],
    },
    { url: PORTAL_URL, label: 'Përgjigju · Answer' },
  );
  return { to: admin.email, subject: oneLine(`${isReply ? 'Përgjigje · Reply' : 'Pyetje · Question'}: ${lesson?.title_en || 'lesson'} — Medident Academy`), html, text };
}

function answerToDoctorMail(doctor: Person, answer: any, lesson: any): Mail | null {
  if (!doctor.email) return null;
  const name = esc(firstName(doctor));
  const quote = `<em>“${esc(answer.body).replace(/\n/g, '<br>')}”</em>`;
  const { html, text } = bilingual(
    'Your question was answered',
    {
      title: 'Pyetja juaj mori përgjigje',
      paragraphs: [`Përshëndetje ${name},`, `Akademia iu përgjigj pyetjes suaj te <strong>${esc(pick(lesson?.title_en, lesson?.title_sq, 'sq'))}</strong>:`, quote],
    },
    {
      title: 'Your question was answered',
      paragraphs: [`Hello ${name},`, `The academy answered your question on <strong>${esc(lesson?.title_en || '')}</strong>:`, quote],
    },
  );
  return { to: doctor.email, subject: oneLine(`Përgjigje · Answer: ${lesson?.title_en || 'your question'} — Medident Academy`), html, text };
}

// ── Data helpers ──────────────────────────────────────────────────────────────
async function adminRecipients(db: any): Promise<Person[]> {
  const { data } = await db.from('academy_profiles').select('email, full_name').eq('role', 'admin');
  const list: Person[] = (data || []).filter((p: Person) => p.email);
  const extra = String(process.env.ADMIN_NOTIFY_EMAIL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const email of extra) if (!list.some((p) => p.email?.toLowerCase() === email.toLowerCase())) list.push({ email, full_name: null });
  return list;
}

async function courseDoctors(db: any, courseId: string): Promise<Person[]> {
  const { data } = await db
    .from('academy_assignments')
    .select('doctor:academy_profiles(email, full_name, role)')
    .eq('course_id', courseId);
  return (data || []).map((r: any) => r.doctor).filter((d: any) => d && d.email && d.role === 'doctor');
}

const isFresh = (iso: string | null | undefined) =>
  Boolean(iso) && Date.now() - new Date(iso as string).getTime() < FRESH_MINUTES * 60 * 1000;

// "Send once" flags are claimed atomically BEFORE sending: only one request can
// flip the column from NULL, so parallel or repeated calls never send twice.
async function claimOnce(db: any, table: string, column: string, id: string): Promise<boolean> {
  const { data, error } = await db
    .from(table)
    .update({ [column]: new Date().toISOString() })
    .eq('id', id)
    .is(column, null)
    .select('id');
  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}
// Nothing went out after all (every send failed / nobody to tell yet) -> allow a retry.
async function releaseClaim(db: any, table: string, column: string, id: string) {
  await db.from(table).update({ [column]: null }).eq('id', id);
}

// ── Daily webinar reminders (Vercel Cron) ─────────────────────────────────────
async function sendWebinarReminders(db: any) {
  const now = new Date();
  const until = new Date(now.getTime() + 30 * 60 * 60 * 1000);
  const { data: lessons, error } = await db
    .from('academy_lessons')
    .select('id, course_id, title_en, title_sq, webinar_at, join_url, duration_min, course:academy_courses(title_en, title_sq, is_published)')
    .eq('kind', 'webinar_live')
    .is('reminder_sent_at', null)
    .gte('webinar_at', now.toISOString())
    .lte('webinar_at', until.toISOString());
  if (error) throw error;
  let sent = 0;
  let failed = 0;
  let webinars = 0;
  for (const lesson of lessons || []) {
    if (!lesson.course?.is_published || !smtpReady()) continue;
    if (!(await claimOnce(db, 'academy_lessons', 'reminder_sent_at', lesson.id))) continue;
    const doctors = await courseDoctors(db, lesson.course_id);
    const mails = doctors.map((d) => webinarMail(d, lesson, lesson.course, 'reminder')).filter(Boolean) as Mail[];
    const r = await sendAll(mails);
    sent += r.sent;
    failed += r.failed;
    webinars++;
    if (r.sent === 0) await releaseClaim(db, 'academy_lessons', 'reminder_sent_at', lesson.id);
  }
  return { ok: true, webinars, sent, failed, smtp: smtpReady() };
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return res.status(500).json({ error: 'Server not configured' });
  // Untyped on purpose: embedded relations come back as single objects (many-to-one).
  const db: any = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  try {
    if (req.method === 'GET') {
      // Only Vercel Cron should call this. With CRON_SECRET set, Vercel sends it
      // automatically and nothing else gets in. Without it, only the cron's user
      // agent is accepted — and the job is idempotent anyway (each reminder is
      // claimed once), so a stray call can never repeat an email.
      const secret = process.env.CRON_SECRET;
      if (secret) {
        if (req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'Unauthorized' });
      } else if (!String(req.headers['user-agent'] || '').startsWith('vercel-cron/')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.status(200).json(await sendWebinarReminders(db));
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    const token = String(authHeader).replace(/^Bearer\s+/i, '').trim();
    if (!token) return res.status(401).json({ error: 'Missing session token' });
    const { data: userData, error: userErr } = await db.auth.getUser(token);
    if (userErr || !userData?.user) return res.status(401).json({ error: 'Invalid or expired session' });
    const callerId = userData.user.id;
    const { data: me } = await db.from('academy_profiles').select('id, role').eq('id', callerId).single();
    if (!me) return res.status(403).json({ error: 'No portal profile' });
    const isAdmin = me.role === 'admin';

    const body = req.body || {};
    const action = String(body.action || '');
    const done = (r: { sent: number; failed: number }) => res.status(200).json({ ok: true, ...r, smtp: smtpReady() });

    // Admin gave a doctor access to a course.
    if (action === 'course_assigned') {
      if (!isAdmin) return res.status(403).json({ error: 'Admins only' });
      const { data: a } = await db
        .from('academy_assignments')
        .select('doctor:academy_profiles(email, full_name), course:academy_courses(title_en, title_sq)')
        .eq('doctor_id', String(body.doctor_id || ''))
        .eq('course_id', String(body.course_id || ''))
        .maybeSingle();
      if (!a) return res.status(404).json({ error: 'Assignment not found' });
      return done(await sendAll([accessGrantedMail(a.doctor, a.course)].filter(Boolean) as Mail[]));
    }

    // Admin approved or declined a request.
    if (action === 'request_decided') {
      if (!isAdmin) return res.status(403).json({ error: 'Admins only' });
      const { data: r } = await db
        .from('academy_course_requests')
        .select('status, doctor:academy_profiles(email, full_name), course:academy_courses(title_en, title_sq)')
        .eq('id', String(body.request_id || ''))
        .maybeSingle();
      if (!r || r.status === 'pending') return res.status(404).json({ error: 'Decided request not found' });
      const mail = r.status === 'approved' ? accessGrantedMail(r.doctor, r.course) : requestDeclinedMail(r.doctor, r.course);
      return done(await sendAll([mail].filter(Boolean) as Mail[]));
    }

    // A doctor asked for a course -> tell the admins (once per request).
    if (action === 'course_requested') {
      const { data: r } = await db
        .from('academy_course_requests')
        .select('id, message, status, created_at, notified_at, doctor:academy_profiles(email, full_name, clinic, city, country, phone), course:academy_courses(title_en, title_sq)')
        .eq('doctor_id', callerId)
        .eq('course_id', String(body.course_id || ''))
        .maybeSingle();
      if (!r || r.status !== 'pending' || r.notified_at || !isFresh(r.created_at)) return done({ sent: 0, failed: 0 });
      if (!smtpReady()) return done({ sent: 0, failed: 0 });
      if (!(await claimOnce(db, 'academy_course_requests', 'notified_at', r.id))) return done({ sent: 0, failed: 0 });
      const admins = await adminRecipients(db);
      const result = await sendAll(admins.map((adm) => requestToAdminMail(adm, r.doctor, r.course, r.message)).filter(Boolean) as Mail[]);
      if (result.sent === 0) await releaseClaim(db, 'academy_course_requests', 'notified_at', r.id);
      return done(result);
    }

    // Admin scheduled a live webinar -> tell every doctor in that course (once).
    if (action === 'webinar_announced') {
      if (!isAdmin) return res.status(403).json({ error: 'Admins only' });
      const { data: lesson } = await db
        .from('academy_lessons')
        .select('id, course_id, kind, title_en, title_sq, webinar_at, join_url, duration_min, announced_at, course:academy_courses(title_en, title_sq, is_published)')
        .eq('id', String(body.lesson_id || ''))
        .maybeSingle();
      if (!lesson || lesson.kind !== 'webinar_live' || !lesson.webinar_at) return res.status(404).json({ error: 'Live webinar not found' });
      const skip = (reason: string) => res.status(200).json({ ok: true, sent: 0, failed: 0, smtp: smtpReady(), skipped: reason });
      if (lesson.announced_at) return skip('already_announced');
      if (!lesson.course?.is_published) return skip('unpublished');
      if (new Date(lesson.webinar_at).getTime() < Date.now()) return skip('past');
      const doctors = await courseDoctors(db, lesson.course_id);
      if (doctors.length === 0) return skip('no_doctors');
      if (!smtpReady()) return done({ sent: 0, failed: 0 });
      if (!(await claimOnce(db, 'academy_lessons', 'announced_at', lesson.id))) return skip('already_announced');
      const result = await sendAll(doctors.map((d) => webinarMail(d, lesson, lesson.course, 'announce')).filter(Boolean) as Mail[]);
      // Kept only once someone actually got it, so the admin can try again later.
      if (result.sent === 0) await releaseClaim(db, 'academy_lessons', 'announced_at', lesson.id);
      return done(result);
    }

    // Someone posted in a lesson's Q&A.
    if (action === 'comment_posted') {
      const { data: c } = await db
        .from('academy_lesson_comments')
        .select('id, lesson_id, author_id, parent_id, author_name, author_is_admin, body, created_at, notified_at, lesson:academy_lessons(title_en, title_sq, course:academy_courses(title_en, title_sq))')
        .eq('id', String(body.comment_id || ''))
        .eq('author_id', callerId)
        .maybeSingle();
      if (!c || c.notified_at || !isFresh(c.created_at)) return done({ sent: 0, failed: 0 });
      if (!smtpReady()) return done({ sent: 0, failed: 0 });
      if (!(await claimOnce(db, 'academy_lesson_comments', 'notified_at', c.id))) return done({ sent: 0, failed: 0 });

      let mails: Mail[] = [];
      if (c.author_is_admin) {
        // An academy answer -> the doctor who asked (if it's a reply to a doctor).
        if (c.parent_id) {
          const { data: parent } = await db
            .from('academy_lesson_comments')
            .select('author_id, author_is_admin, author:academy_profiles(email, full_name)')
            .eq('id', c.parent_id)
            .maybeSingle();
          if (parent && !parent.author_is_admin && parent.author_id !== callerId) {
            mails = [answerToDoctorMail(parent.author, c, c.lesson)].filter(Boolean) as Mail[];
          }
        }
      } else {
        // At most one alert per doctor every 2 minutes (the admin sees every
        // message in the Q&A tab anyway).
        const { count: recent } = await db
          .from('academy_lesson_comments')
          .select('id', { count: 'exact', head: true })
          .eq('author_id', callerId)
          .neq('id', c.id)
          .gt('notified_at', new Date(Date.now() - 2 * 60 * 1000).toISOString());
        if (!recent) {
          const admins = await adminRecipients(db);
          mails = admins.map((adm) => questionToAdminMail(adm, c, c.lesson, c.lesson?.course, Boolean(c.parent_id))).filter(Boolean) as Mail[];
        }
      }
      const result = await sendAll(mails);
      if (mails.length > 0 && result.sent === 0) await releaseClaim(db, 'academy_lesson_comments', 'notified_at', c.id);
      return done(result);
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e: any) {
    console.error('portal-notify error:', e?.message || e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
