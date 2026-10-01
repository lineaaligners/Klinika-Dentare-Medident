import React, { useEffect, useState } from 'react';
import {
  fetchMyCourses,
  fetchLessonIndex,
  fetchMyProgress,
  fetchMyCertificates,
  fetchContinueLearning,
  coverUrl,
  localized,
  isProfileComplete,
} from '../../services/portalApi';
import { PortalCourse, Lang, Profile, Certificate, ContinueLearning } from './types';
import UpcomingWebinars from './UpcomingWebinars';
import ContinueCard from './ContinueCard';
import CourseCatalog from './CourseCatalog';
import CertificateActions from './CertificateActions';
import { Loader2, BookOpen, ChevronRight, GraduationCap, Award, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  lang: Lang;
  profile: Profile;
  isAdmin: boolean;
  onOpenCourse: (courseId: string, lessonId?: string) => void;
  onAccount: () => void;
  onProfileUpdated: (p: Profile) => void;
}

const t = {
  en: {
    title: 'My Courses',
    hello: 'Welcome',
    empty: "You don't have any courses yet. Request one below — you'll get an email as soon as it's approved.",
    emptyNoCatalog: 'Welcome! Your account is ready. The academy will assign your courses — check back soon.',
    open: 'Open course',
    complete: 'complete',
    loadError: 'Could not load your courses. Please try again.',
    certified: 'Certificate earned',
    certificates: 'My certificates',
    issued: 'Issued',
    profileTitle: 'Complete your profile',
    profileBody: 'Add your clinic and phone so the academy can confirm your course requests.',
    profileCta: 'Add details',
    adminPreview: 'As admin you see every published course here, exactly as doctors see them.',
  },
  sq: {
    title: 'Kurset e Mia',
    hello: 'Mirë se vini',
    empty: 'Ende nuk keni kurse. Kërkoni një më poshtë — do të merrni email sapo të miratohet.',
    emptyNoCatalog: 'Mirë se vini! Llogaria juaj është gati. Akademia do t’ju caktojë kurset së shpejti.',
    open: 'Hap kursin',
    complete: 'përfunduar',
    loadError: 'Kurset nuk u ngarkuan. Provoni përsëri.',
    certified: 'Certifikatë e fituar',
    certificates: 'Certifikatat e mia',
    issued: 'Lëshuar',
    profileTitle: 'Plotësoni profilin',
    profileBody: 'Shtoni klinikën dhe telefonin që akademia të konfirmojë kërkesat tuaja.',
    profileCta: 'Shto të dhënat',
    adminPreview: 'Si admin, këtu shihni çdo kurs të publikuar, ashtu siç e shohin mjekët.',
  },
};

const DashboardScreen: React.FC<Props> = ({ lang, profile, isAdmin, onOpenCourse, onAccount, onProfileUpdated }) => {
  const s = t[lang];
  const [courses, setCourses] = useState<PortalCourse[] | null>(null);
  const [progress, setProgress] = useState<Record<string, { done: number; total: number }>>({});
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [cont, setCont] = useState<ContinueLearning | null>(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setError('');
    Promise.all([
      fetchMyCourses(isAdmin),
      fetchLessonIndex(),
      fetchMyProgress(),
      fetchMyCertificates(),
      isAdmin ? Promise.resolve(null) : fetchContinueLearning(),
    ])
      .then(([cs, lessons, done, myCerts, next]) => {
        setCourses(cs);
        setCont(next);
        const map: Record<string, { done: number; total: number }> = {};
        for (const l of lessons) {
          if (!map[l.course_id]) map[l.course_id] = { done: 0, total: 0 };
          map[l.course_id].total += 1;
          if (done.has(l.id)) map[l.course_id].done += 1;
        }
        setProgress(map);
        setCerts(myCerts);
      })
      .catch(() => setError(s.loadError));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, reloadKey]);

  const certByCourse = new Map(certs.filter((c) => c.course_id).map((c) => [c.course_id as string, c]));
  const firstName = (profile.full_name || '').trim().split(/\s+/).slice(0, 2).join(' ');

  if (error) return <p className="text-sm font-bold text-red-600">{error}</p>;
  if (!courses)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="mb-8">
        {firstName && <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-2">{s.hello}, {firstName}</p>}
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{s.title}</h1>
        {isAdmin && <p className="text-xs text-slate-400 mt-2">{s.adminPreview}</p>}
      </div>

      {!isAdmin && !isProfileComplete(profile) && (
        <div className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center gap-4">
          <UserRound className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-[200px]">
            <p className="font-black text-slate-900 text-sm">{s.profileTitle}</p>
            <p className="text-xs text-slate-600">{s.profileBody}</p>
          </div>
          <button onClick={onAccount} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
            {s.profileCta}
          </button>
        </div>
      )}

      {cont && <ContinueCard lang={lang} item={cont} onOpen={onOpenCourse} />}

      <UpcomingWebinars lang={lang} onOpenCourse={onOpenCourse} />

      {courses.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 max-w-md mx-auto">{isAdmin ? s.emptyNoCatalog : s.empty}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c, i) => {
            const cover = coverUrl(c.cover_path);
            const p = progress[c.id];
            const pct = p && p.total > 0 ? Math.round((p.done / p.total) * 100) : 0;
            const cert = certByCourse.get(c.id);
            return (
              <motion.button
                key={c.id}
                onClick={() => onOpenCourse(c.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.4 }}
                className="group text-left bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="h-36 bg-slate-100 relative overflow-hidden">
                  {cover ? (
                    <img src={cover} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                  {cert && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 text-amber-700 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow-sm">
                      <Award size={12} /> {s.certified}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-black text-slate-900 tracking-tight mb-1.5">{localized(c.title_en, c.title_sq, lang)}</h3>
                  {c.instructor_name && <p className="text-[11px] font-bold text-slate-400 mb-1.5">{c.instructor_name}</p>}
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{localized(c.description_en, c.description_sq, lang)}</p>
                  {p && p.total > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                        <span>
                          {p.done}/{p.total} {s.complete}
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-blue-100 overflow-hidden">
                        <div className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                    {s.open} <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {certs.length > 0 && (
        <section className="mt-14">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Award size={14} /> {s.certificates}
          </h2>
          <div className="space-y-3">
            {certs.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center gap-4 justify-between">
                <div>
                  <p className="font-black text-slate-900 tracking-tight">{localized(c.course_title_en, c.course_title_sq, lang)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {s.issued} {new Date(c.issued_at).toLocaleDateString(lang === 'sq' ? 'sq-AL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {c.code}
                  </p>
                </div>
                <CertificateActions lang={lang} cert={c} />
              </div>
            ))}
          </div>
        </section>
      )}

      {!isAdmin && (
        <CourseCatalog
          lang={lang}
          profile={profile}
          onProfileUpdated={onProfileUpdated}
          onAccessChanged={() => setReloadKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default DashboardScreen;
