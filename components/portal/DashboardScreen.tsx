import React, { useEffect, useState } from 'react';
import { fetchMyCourses, fetchLessonIndex, fetchMyProgress, coverUrl, localized } from '../../services/portalApi';
import { PortalCourse, Lang } from './types';
import { Loader2, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  lang: Lang;
  onOpenCourse: (courseId: string) => void;
}

const t = {
  en: {
    title: 'My Courses',
    empty: 'Welcome! Your account is ready. The academy will assign your courses — check back soon.',
    open: 'Open course',
    complete: 'complete',
    loadError: 'Could not load your courses. Please try again.',
  },
  sq: {
    title: 'Kurset e Mia',
    empty: 'Mirë se vini! Llogaria juaj është gati. Akademia do t’ju caktojë kurset së shpejti.',
    open: 'Hap kursin',
    complete: 'përfunduar',
    loadError: 'Kurset nuk u ngarkuan. Provoni përsëri.',
  },
};

const DashboardScreen: React.FC<Props> = ({ lang, onOpenCourse }) => {
  const s = t[lang];
  const [courses, setCourses] = useState<PortalCourse[] | null>(null);
  const [progress, setProgress] = useState<Record<string, { done: number; total: number }>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchMyCourses(), fetchLessonIndex(), fetchMyProgress()])
      .then(([cs, lessons, done]) => {
        setCourses(cs);
        const map: Record<string, { done: number; total: number }> = {};
        for (const l of lessons) {
          if (!map[l.course_id]) map[l.course_id] = { done: 0, total: 0 };
          map[l.course_id].total += 1;
          if (done.has(l.id)) map[l.course_id].done += 1;
        }
        setProgress(map);
      })
      .catch(() => setError(s.loadError));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <p className="text-sm font-bold text-red-600">{error}</p>;
  if (!courses)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-8">{s.title}</h1>
      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{s.empty}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c, i) => {
            const cover = coverUrl(c.cover_path);
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
                </div>
                <div className="p-5">
                  <h3 className="font-black text-slate-900 tracking-tight mb-1.5">{localized(c.title_en, c.title_sq, lang)}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{localized(c.description_en, c.description_sq, lang)}</p>
                  {(() => {
                    const p = progress[c.id];
                    if (!p || p.total === 0) return null;
                    const pct = Math.round((p.done / p.total) * 100);
                    return (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                          <span>{p.done}/{p.total} {s.complete}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                    {s.open} <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
