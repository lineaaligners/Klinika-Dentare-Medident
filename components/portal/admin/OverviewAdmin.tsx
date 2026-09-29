import React, { useEffect, useState } from 'react';
import { AdminStats, DoctorProgress, Lang } from '../types';
import { adminStats, adminDoctorProgress, adminSetCertificateRevoked, localized } from '../../../services/portalApi';
import { Loader2, Inbox, MessageCircle, Award, Users, Activity, ListChecks, Ban, RotateCcw, AlertCircle } from 'lucide-react';

type Tab = 'requests' | 'qa';

const t = {
  en: {
    doctors: 'Doctors',
    newThisMonth: 'new in the last 30 days',
    active: 'Active in the last 7 days',
    pending: 'Pending requests',
    open: 'Unanswered questions',
    certificates: 'Certificates issued',
    assignments: 'Course enrolments',
    review: 'Review',
    courses: 'Courses',
    course: 'Course',
    lessons: 'Lessons',
    enrolled: 'Doctors',
    progress: 'Avg. progress',
    finished: 'Finished',
    quiz: 'Quiz passed',
    certs: 'Certificates',
    draft: 'Draft',
    doctorProgress: 'Doctor progress',
    doctor: 'Doctor',
    lastActive: 'Last active',
    never: 'never',
    noCourses: 'no courses yet',
    best: 'best quiz',
    recent: 'Recent certificates',
    revoke: 'Withdraw',
    restore: 'Restore',
    revoked: 'Withdrawn',
    confirmRevoke: 'Withdraw this certificate? Its verification link stops working and the doctor cannot claim a new one (you can restore it later).',
    none: '—',
  },
  sq: {
    doctors: 'Mjekë',
    newThisMonth: 'të rinj në 30 ditët e fundit',
    active: 'Aktivë në 7 ditët e fundit',
    pending: 'Kërkesa në pritje',
    open: 'Pyetje pa përgjigje',
    certificates: 'Certifikata të lëshuara',
    assignments: 'Regjistrime në kurse',
    review: 'Shqyrto',
    courses: 'Kurset',
    course: 'Kursi',
    lessons: 'Mësime',
    enrolled: 'Mjekë',
    progress: 'Progresi mesatar',
    finished: 'Përfunduan',
    quiz: 'Kaluan testin',
    certs: 'Certifikata',
    draft: 'Draft',
    doctorProgress: 'Progresi i mjekëve',
    doctor: 'Mjeku',
    lastActive: 'Aktiv së fundi',
    never: 'asnjëherë',
    noCourses: 'ende pa kurse',
    best: 'testi më i mirë',
    recent: 'Certifikatat e fundit',
    revoke: 'Tërhiq',
    restore: 'Rikthe',
    revoked: 'E tërhequr',
    confirmRevoke: 'Të tërhiqet kjo certifikatë? Linku i verifikimit nuk funksionon më dhe mjeku nuk mund të marrë një të re (mund ta riktheni më vonë).',
    none: '—',
  },
};

/** Progress meter: blue fill on a lighter blue track (same ramp). */
const Meter: React.FC<{ pct: number }> = ({ pct }) => (
  <div className="h-1.5 w-full rounded-full bg-blue-100 overflow-hidden" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
    <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
  </div>
);

const Tile: React.FC<{ icon: React.ReactNode; label: string; value: number; note?: string; action?: { label: string; onClick: () => void }; attention?: boolean }> = ({
  icon,
  label,
  value,
  note,
  action,
  attention,
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
    <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
      <span className="text-slate-400">{icon}</span> {label}
    </p>
    <p className="text-3xl font-semibold text-slate-900 mt-2">{value.toLocaleString()}</p>
    {note && <p className="text-[11px] text-slate-400 mt-1">{note}</p>}
    {action && value > 0 && (
      <button onClick={action.onClick} className="mt-3 self-start flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">
        {attention && <AlertCircle size={12} className="text-amber-500" />} {action.label} →
      </button>
    )}
  </div>
);

const OverviewAdmin: React.FC<{ lang: Lang; onOpenTab: (t: Tab) => void }> = ({ lang, onOpenTab }) => {
  const s = t[lang];
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [doctors, setDoctors] = useState<DoctorProgress[] | null>(null);
  const [error, setError] = useState('');
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';
  const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : s.never);

  const load = () =>
    Promise.all([adminStats(), adminDoctorProgress()])
      .then(([st, dp]) => {
        setStats(st);
        setDoctors(dp);
      })
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const setRevoked = async (code: string, revoked: boolean) => {
    if (revoked && !window.confirm(s.confirmRevoke)) return;
    try {
      await adminSetCertificateRevoked(code, revoked);
    } catch (e: any) {
      setError(e.message || 'Error');
      return;
    }
    load();
  };

  if (error) return <p className="text-sm font-bold text-red-600">{error}</p>;
  if (!stats || !doctors)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Tile icon={<Users size={14} />} label={s.doctors} value={stats.doctors} note={`+${stats.new_30d} ${s.newThisMonth}`} />
        <Tile icon={<Activity size={14} />} label={s.active} value={stats.active_7d} />
        <Tile icon={<ListChecks size={14} />} label={s.assignments} value={stats.assignments} />
        <Tile icon={<Inbox size={14} />} label={s.pending} value={stats.pending_requests} action={{ label: s.review, onClick: () => onOpenTab('requests') }} attention />
        <Tile icon={<MessageCircle size={14} />} label={s.open} value={stats.open_questions} action={{ label: s.review, onClick: () => onOpenTab('qa') }} attention />
        <Tile icon={<Award size={14} />} label={s.certificates} value={stats.certificates} />
      </div>

      <section>
        <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">{s.courses}</h2>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">
                <th className="px-4 py-3">{s.course}</th>
                <th className="px-4 py-3 text-right">{s.lessons}</th>
                <th className="px-4 py-3 text-right">{s.enrolled}</th>
                <th className="px-4 py-3 min-w-[160px]">{s.progress}</th>
                <th className="px-4 py-3 text-right">{s.finished}</th>
                <th className="px-4 py-3 text-right">{s.quiz}</th>
                <th className="px-4 py-3 text-right">{s.certs}</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {stats.course_stats.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {localized(c.title_en, c.title_sq, lang)}
                    {!c.is_published && <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-slate-400">{s.draft}</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">{c.lessons}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{c.assigned}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Meter pct={c.avg_progress} />
                      <span className="text-xs text-slate-600 w-10 text-right">{c.avg_progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">{c.completed}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{c.quiz_questions > 0 ? c.quiz_passed : s.none}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{c.certificates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">{s.doctorProgress}</h2>
        {doctors.length === 0 ? (
          <p className="text-sm text-slate-400">{s.none}</p>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {doctors.map((d) => (
              <div key={d.id} className="p-4 grid md:grid-cols-[260px_1fr] gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{d.full_name || d.email}</p>
                  <p className="text-xs text-slate-400 truncate">{[d.clinic, d.city].filter(Boolean).join(', ') || d.email}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {s.lastActive}: {fmt(d.last_seen_at)}
                  </p>
                </div>
                <div className="space-y-2.5">
                  {d.courses.length === 0 ? (
                    <p className="text-xs text-slate-400">{s.noCourses}</p>
                  ) : (
                    d.courses.map((c) => {
                      const pct = c.lessons_total > 0 ? Math.round((Math.min(c.lessons_done, c.lessons_total) / c.lessons_total) * 100) : 0;
                      return (
                        <div key={c.course_id} className="grid grid-cols-[minmax(0,1fr)_120px] sm:grid-cols-[minmax(0,1fr)_160px_210px] items-center gap-3">
                          <span className="text-xs text-slate-700 truncate">{localized(c.title_en, c.title_sq, lang)}</span>
                          <div className="flex items-center gap-2">
                            <Meter pct={pct} />
                            <span className="text-[11px] text-slate-600 tabular-nums w-12 text-right">
                              {c.lessons_done}/{c.lessons_total}
                            </span>
                          </div>
                          <span className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500">
                            {c.best_score !== null && (
                              <span>
                                {s.best} {c.best_score}%
                              </span>
                            )}
                            {c.certificate_code && (
                              <span className="flex items-center gap-1 text-slate-700 font-bold">
                                <Award size={12} className="text-amber-500" /> {c.certificate_code}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {stats.recent_certificates.length > 0 && (
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">{s.recent}</h2>
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {stats.recent_certificates.map((c) => (
              <div key={c.code} className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className={c.revoked_at ? 'text-slate-400 line-through' : 'text-slate-700'}>
                  <strong>{c.doctor_name}</strong> · {localized(c.course_title_en, c.course_title_sq, lang)}
                </span>
                <span className="flex items-center gap-3 text-xs text-slate-500">
                  {c.revoked_at ? (
                    <span className="flex items-center gap-1 font-bold text-slate-500">
                      <Ban size={12} /> {s.revoked}
                    </span>
                  ) : (
                    <a href={`/academy/verify/${c.code}`} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-blue-600">
                      {c.code}
                    </a>
                  )}
                  <span>{fmt(c.issued_at)}</span>
                  {c.revoked_at ? (
                    <button onClick={() => setRevoked(c.code, false)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold">
                      <RotateCcw size={12} /> {s.restore}
                    </button>
                  ) : (
                    <button onClick={() => setRevoked(c.code, true)} className="flex items-center gap-1 text-slate-400 hover:text-red-600">
                      <Ban size={12} /> {s.revoke}
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default OverviewAdmin;
