import React from 'react';
import { ContinueLearning, Lang } from './types';
import { coverUrl, localized } from '../../services/portalApi';
import { PlayCircle, FileText, CalendarClock, BookOpen, ChevronRight } from 'lucide-react';

const t = {
  en: {
    title: 'Continue where you left off',
    cta: 'Continue',
    resumeAt: (time: string) => `Resume at ${time}`,
    done: (d: number, n: number) => `${d} of ${n} lessons done`,
  },
  sq: {
    title: 'Vazhdoni ku e latë',
    cta: 'Vazhdo',
    resumeAt: (time: string) => `Vazhdo nga ${time}`,
    done: (d: number, n: number) => `${d} nga ${n} mësime të përfunduara`,
  },
};

/** 754 -> "12:34", 3725 -> "1:02:05" */
export const formatClock = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};

const ContinueCard: React.FC<{ lang: Lang; item: ContinueLearning; onOpen: (courseId: string, lessonId: string) => void }> = ({
  lang,
  item,
  onOpen,
}) => {
  const s = t[lang];
  const cover = coverUrl(item.cover_path);
  const pct = item.lessons_total > 0 ? Math.round((Math.min(item.lessons_done, item.lessons_total) / item.lessons_total) * 100) : 0;
  const icon =
    item.kind === 'pdf' ? <FileText size={14} /> : item.kind === 'webinar_live' ? <CalendarClock size={14} /> : <PlayCircle size={14} />;
  const resume = item.position_seconds >= 10 && item.kind !== 'pdf' && item.kind !== 'webinar_live';

  return (
    <button
      onClick={() => onOpen(item.course_id, item.lesson_id)}
      className="group w-full text-left mb-10 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all rounded-3xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5"
    >
      <div className="w-16 h-16 sm:w-28 sm:h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {cover ? <img src={cover} alt="" className="w-full h-full object-cover" /> : <BookOpen className="w-7 h-7 text-slate-300" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">{s.title}</p>
        <p className="font-black text-slate-900 tracking-tight leading-snug line-clamp-2 sm:line-clamp-1">
          <span className="inline-flex align-[-2px] mr-1.5 text-slate-400">{icon}</span>
          {localized(item.lesson_title_en, item.lesson_title_sq, lang)}
        </p>
        <p className="text-xs text-slate-500 truncate mt-0.5">{localized(item.course_title_en, item.course_title_sq, lang)}</p>
        <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-blue-100 overflow-hidden" aria-hidden="true">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1.5 text-[10px] text-slate-400 tabular-nums">
          {s.done(item.lessons_done, item.lessons_total)}
          {resume && <span className="sm:hidden whitespace-nowrap"> · {s.resumeAt(formatClock(item.position_seconds))}</span>}
        </p>
      </div>
      <span className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
        <span className="flex items-center gap-1.5 bg-blue-600 group-hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
          {s.cta} <ChevronRight size={13} />
        </span>
        {resume && <span className="text-[10px] text-slate-400 tabular-nums">{s.resumeAt(formatClock(item.position_seconds))}</span>}
      </span>
      <ChevronRight size={18} className="sm:hidden text-blue-600 flex-shrink-0" />
    </button>
  );
};

export default ContinueCard;
