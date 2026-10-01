import React, { useEffect, useState } from 'react';
import { AdminAnnouncement, AdminStats, Lang, PortalCourse } from '../types';
import {
  adminFetchAnnouncements,
  adminCreateAnnouncement,
  adminDeleteAnnouncement,
  adminFetchCourses,
  adminStats,
  notify,
  NotifyResult,
  localized,
} from '../../../services/portalApi';
import { linkify } from '../Announcements';
import { Loader2, Megaphone, Mail, MailCheck, Trash2, Send, Users } from 'lucide-react';

const t = {
  en: {
    newTitle: 'New announcement',
    intro: 'Shown at the top of the doctors’ dashboard for 60 days (each doctor can close it), and emailed if you tick the box.',
    audience: 'Who gets it',
    everyone: 'All doctors',
    draft: 'draft',
    doctors: (n: number) => `${n} ${n === 1 ? 'doctor' : 'doctors'}`,
    titleEn: 'Title (English)',
    titleSq: 'Title (Albanian)',
    bodyEn: 'Message (English)',
    bodySq: 'Message (Albanian)',
    langHint: 'One language is enough — doctors see the other one when a translation is missing.',
    email: 'Also send it by email',
    publish: 'Publish',
    needText: 'Write a title and a message (in at least one language).',
    published: 'Published on the dashboard.',
    history: 'Sent so far',
    none: 'No announcements yet.',
    emailed: (d: string) => `Emailed ${d}`,
    notEmailed: 'Not emailed',
    sendEmail: 'Send by email',
    del: 'Delete',
    confirmDelete: 'Delete this announcement? Doctors will no longer see it.',
    error: 'Could not save. Please try again.',
    r: {
      sent: (n: number, f: number) => `Emailed to ${n} ${n === 1 ? 'doctor' : 'doctors'}${f ? ` (${f} failed)` : ''}.`,
      noSmtp: 'Email is not set up yet — it can be sent from here once the Gmail app password is in place.',
      unreachable: 'The email service could not be reached. Try “Send by email” again later.',
      already: 'This one was already emailed.',
      noDoctors: 'Nobody to email yet.',
      unpublished: 'The course is a draft, so no email was sent.',
      failed: 'The email could not be sent. Please try again.',
    },
  },
  sq: {
    newTitle: 'Njoftim i ri',
    intro: 'Shfaqet në krye të faqes së mjekëve për 60 ditë (secili mjek mund ta mbyllë) dhe dërgohet me email nëse e zgjidhni.',
    audience: 'Kujt i dërgohet',
    everyone: 'Të gjithë mjekët',
    draft: 'draft',
    doctors: (n: number) => `${n} ${n === 1 ? 'mjek' : 'mjekë'}`,
    titleEn: 'Titulli (Anglisht)',
    titleSq: 'Titulli (Shqip)',
    bodyEn: 'Mesazhi (Anglisht)',
    bodySq: 'Mesazhi (Shqip)',
    langHint: 'Mjafton një gjuhë — mjekët shohin tjetrën kur mungon përkthimi.',
    email: 'Dërgoje edhe me email',
    publish: 'Publiko',
    needText: 'Shkruani titullin dhe mesazhin (të paktën në një gjuhë).',
    published: 'U publikua në faqen e mjekëve.',
    history: 'Të dërguara deri tani',
    none: 'Ende pa njoftime.',
    emailed: (d: string) => `Dërguar me email më ${d}`,
    notEmailed: 'Pa email',
    sendEmail: 'Dërgo me email',
    del: 'Fshi',
    confirmDelete: 'Të fshihet ky njoftim? Mjekët nuk do ta shohin më.',
    error: 'Nuk u ruajt. Provoni përsëri.',
    r: {
      sent: (n: number, f: number) => `U dërgua me email te ${n} ${n === 1 ? 'mjek' : 'mjekë'}${f ? ` (${f} dështuan)` : ''}.`,
      noSmtp: 'Email-i nuk është konfiguruar ende — mund ta dërgoni nga këtu pasi të vendoset fjalëkalimi i aplikacionit Gmail.',
      unreachable: 'Shërbimi i email-it nuk u arrit. Provoni “Dërgo me email” më vonë.',
      already: 'Ky njoftim është dërguar tashmë me email.',
      noDoctors: 'Ende nuk ka kujt t’i dërgohet.',
      unpublished: 'Kursi është draft, prandaj nuk u dërgua email.',
      failed: 'Email-i nuk u dërgua. Provoni përsëri.',
    },
  },
};

const empty = { course_id: '', title_en: '', title_sq: '', body_en: '', body_sq: '', send_email: true };

const AnnouncementsAdmin: React.FC<{ lang: Lang }> = ({ lang }) => {
  const s = t[lang];
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';
  const [items, setItems] = useState<AdminAnnouncement[] | null>(null);
  const [courses, setCourses] = useState<PortalCourse[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ id: string | null; text: string; ok: boolean } | null>(null);

  const load = () =>
    adminFetchAnnouncements()
      .then(setItems)
      .catch((e) => {
        setItems([]);
        setError(e.message || s.error);
      });

  useEffect(() => {
    load();
    adminFetchCourses().then(setCourses).catch(() => {});
    adminStats().then(setStats).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const audienceCount = (courseId: string): number | null => {
    if (!stats) return null;
    if (!courseId) return stats.doctors;
    return stats.course_stats.find((c) => c.id === courseId)?.assigned ?? null;
  };

  const explain = (r: NotifyResult | null): { text: string; ok: boolean } => {
    if (!r) return { text: s.r.unreachable, ok: false };
    if (r.skipped === 'already_emailed') return { text: s.r.already, ok: true };
    if (r.skipped === 'no_doctors') return { text: s.r.noDoctors, ok: false };
    if (r.skipped === 'unpublished') return { text: s.r.unpublished, ok: false };
    if (!r.smtp) return { text: s.r.noSmtp, ok: false };
    if (r.sent > 0) return { text: s.r.sent(r.sent, r.failed), ok: true };
    return { text: s.r.failed, ok: false };
  };

  const sendEmail = async (id: string) => {
    setBusyId(id);
    setNotice(null);
    const r = await notify('announcement_posted', { announcement_id: id });
    setNotice({ id, ...explain(r) });
    setBusyId(null);
    load();
  };

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = (v: string) => v.trim() || null;
    const payload = {
      course_id: form.course_id || null,
      title_en: clean(form.title_en),
      title_sq: clean(form.title_sq),
      body_en: clean(form.body_en),
      body_sq: clean(form.body_sq),
      send_email: form.send_email,
    };
    if (!(payload.title_en || payload.title_sq) || !(payload.body_en || payload.body_sq)) return setError(s.needText);
    setBusy(true);
    setError('');
    setNotice(null);
    try {
      const created = await adminCreateAnnouncement(payload);
      setForm({ ...empty, course_id: form.course_id });
      if (payload.send_email) {
        const r = await notify('announcement_posted', { announcement_id: created.id });
        const ex = explain(r);
        setNotice({ id: created.id, text: `${s.published} ${ex.text}`, ok: ex.ok });
      } else {
        setNotice({ id: created.id, text: s.published, ok: true });
      }
      await load();
    } catch (err: any) {
      setError(err?.message || s.error);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(s.confirmDelete)) return;
    setBusyId(id);
    try {
      await adminDeleteAnnouncement(id);
      setItems((list) => (list || []).filter((a) => a.id !== id));
    } catch (err: any) {
      setError(err?.message || s.error);
    } finally {
      setBusyId(null);
    }
  };

  const label = 'block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5';
  const input = 'w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white';
  const count = audienceCount(form.course_id);
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-10">
      <form onSubmit={publish} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Megaphone size={18} className="text-blue-600" /> {s.newTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{s.intro}</p>
        </div>

        <div className="grid sm:grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div>
            <label className={label}>{s.audience}</label>
            <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className={input}>
              <option value="">{s.everyone}</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {localized(c.title_en, c.title_sq, lang)}
                  {c.is_published ? '' : ` (${s.draft})`}
                </option>
              ))}
            </select>
          </div>
          {count !== null && (
            <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 pb-3">
              <Users size={14} className="text-slate-400" /> {s.doctors(count)}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>{s.titleSq}</label>
            <input value={form.title_sq} onChange={(e) => setForm({ ...form, title_sq: e.target.value })} maxLength={200} className={input} />
          </div>
          <div>
            <label className={label}>{s.titleEn}</label>
            <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} maxLength={200} className={input} />
          </div>
          <div>
            <label className={label}>{s.bodySq}</label>
            <textarea value={form.body_sq} onChange={(e) => setForm({ ...form, body_sq: e.target.value })} rows={5} maxLength={4000} className={input} />
          </div>
          <div>
            <label className={label}>{s.bodyEn}</label>
            <textarea value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })} rows={5} maxLength={4000} className={input} />
          </div>
        </div>
        <p className="text-xs text-slate-400 -mt-2">{s.langHint}</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.send_email}
              onChange={(e) => setForm({ ...form, send_email: e.target.checked })}
              className="w-4 h-4 accent-blue-600"
            />
            <Mail size={14} className="text-slate-400" /> {s.email}
          </label>
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} {s.publish}
          </button>
        </div>
        {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        {notice && !notice.id && <p className={`text-xs font-bold ${notice.ok ? 'text-green-700' : 'text-amber-700'}`}>{notice.text}</p>}
      </form>

      <section>
        <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">{s.history}</h2>
        {!items ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-400">{s.none}</p>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {items.map((a) => {
              const title = localized(a.title_en, a.title_sq, lang);
              const body = localized(a.body_en, a.body_sq, lang);
              const audience = a.course_id ? localized(a.course?.title_en, a.course?.title_sq, lang) : s.everyone;
              return (
                <div key={a.id} className="px-4 sm:px-5 py-4">
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-black text-slate-900 tracking-tight">{title}</p>
                      <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                        {fmt(a.created_at)} · {audience}
                      </p>
                      <p className="text-sm text-slate-600 mt-1.5 whitespace-pre-wrap break-words line-clamp-3">{linkify(body)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {a.emailed_at ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 rounded px-1.5 py-0.5">
                          <MailCheck size={11} /> {s.emailed(fmt(a.emailed_at))}
                        </span>
                      ) : (
                        <button
                          onClick={() => sendEmail(a.id)}
                          disabled={busyId === a.id}
                          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 disabled:opacity-60"
                        >
                          {busyId === a.id ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />} {s.sendEmail}
                        </button>
                      )}
                      <button
                        onClick={() => remove(a.id)}
                        disabled={busyId === a.id}
                        aria-label={s.del}
                        title={s.del}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {notice && notice.id === a.id && (
                    <p className={`text-xs font-bold mt-2 ${notice.ok ? 'text-green-700' : 'text-amber-700'}`}>{notice.text}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AnnouncementsAdmin;
