import React, { useEffect, useState } from 'react';
import { fetchCourse, fetchLessons, fetchMyProgress, localized } from '../../services/portalApi';
import { PortalCourse, PortalLesson, Lang } from './types';
import LessonViewer from './LessonViewer';
import { Loader2, ArrowLeft, FileText, CalendarClock, PlayCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  lang: Lang;
  courseId: string;
  onBack: () => void;
}

const t = {
  en: { back: 'All courses', lessons: 'Lessons', empty: 'No lessons in this course yet.', pickLesson: 'Select a lesson to begin.', complete: 'complete' },
  sq: { back: 'Të gjitha kurset', lessons: 'Mësimet', empty: 'Ende nuk ka mësime në këtë kurs.', pickLesson: 'Zgjidhni një mësim për të filluar.', complete: 'përfunduar' },
};

const kindIcon = (kind: PortalLesson['kind']) => {
  if (kind === 'pdf') return <FileText size={15} />;
  if (kind === 'webinar_live') return <CalendarClock size={15} />;
  return <PlayCircle size={15} />;
};

const CourseScreen: React.FC<Props> = ({ lang, courseId, onBack }) => {
  const s = t[lang];
  const [course, setCourse] = useState<PortalCourse | null>(null);
  const [lessons, setLessons] = useState<PortalLesson[] | null>(null);
  const [selected, setSelected] = useState<PortalLesson | null>(null);
  const [progress, setProgress] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourse(courseId).then(setCourse);
    fetchLessons(courseId).then((ls) => {
      setLessons(ls);
      setSelected(ls[0] ?? null);
    });
    fetchMyProgress().then(setProgress);
  }, [courseId]);

  const markLocal = (lessonId: string, done: boolean) => {
    setProgress((prev) => {
      const next = new Set(prev);
      if (done) next.add(lessonId);
      else next.delete(lessonId);
      return next;
    });
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest mb-6">
        <ArrowLeft size={15} /> {s.back}
      </button>

      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-4">
        {course ? localized(course.title_en, course.title_sq, lang) : ''}
      </h1>

      {lessons && lessons.length > 0 && (
        <div className="mb-8 max-w-xs">
          {(() => {
            const done = lessons.filter((l) => progress.has(l.id)).length;
            const pct = Math.round((done / lessons.length) * 100);
            return (
              <>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                  <span>{done}/{lessons.length} {s.complete}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </>
            );
          })()}
        </div>
      )}

      {!lessons ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-slate-500">{s.empty}</p>
      ) : (
        <div className="grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-8 items-start">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <p className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">{s.lessons}</p>
            <ul>
              {lessons.map((l) => {
                const isSel = selected?.id === l.id;
                const done = progress.has(l.id);
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => setSelected(l)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 transition-colors ${isSel ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                    >
                      <span className={isSel ? 'text-blue-600' : 'text-slate-400'}>{kindIcon(l.kind)}</span>
                      <span className={`flex-1 text-sm font-bold ${isSel ? 'text-blue-700' : 'text-slate-700'}`}>
                        {localized(l.title_en, l.title_sq, lang)}
                      </span>
                      {done && <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7">
            {selected ? (
              <LessonViewer
                lesson={selected}
                lang={lang}
                completed={progress.has(selected.id)}
                onToggleComplete={(done) => markLocal(selected.id, done)}
              />
            ) : (
              <p className="text-slate-500">{s.pickLesson}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseScreen;
