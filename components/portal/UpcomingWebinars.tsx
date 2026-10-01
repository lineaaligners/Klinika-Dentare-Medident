import React, { useEffect, useState } from 'react';
import { fetchUpcomingWebinars, localized, portalUrl } from '../../services/portalApi';
import { Lang, UpcomingWebinar } from './types';
import { downloadIcs, webinarState } from './ics';
import { CalendarPlus, Video, ExternalLink, Radio } from 'lucide-react';

const t = {
  en: {
    title: 'Upcoming live webinars',
    addToCalendar: 'Add to calendar',
    join: 'Join now',
    live: 'Live now',
    opensSoon: 'Join link opens 30 min before',
    noLink: 'Join link coming soon',
  },
  sq: {
    title: 'Webinaret e ardhshme live',
    addToCalendar: 'Shto në kalendar',
    join: 'Bashkohu tani',
    live: 'Live tani',
    opensSoon: 'Linku hapet 30 min para',
    noLink: 'Linku vjen së shpejti',
  },
};

const UpcomingWebinars: React.FC<{ lang: Lang; onOpenCourse: (courseId: string, lessonId?: string) => void }> = ({ lang, onOpenCourse }) => {
  const s = t[lang];
  const [items, setItems] = useState<UpcomingWebinar[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchUpcomingWebinars().then(setItems);
    const id = window.setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const visible = items.filter((w) => w.webinar_at && webinarState(w.webinar_at, now) !== 'past');
  if (visible.length === 0) return null;

  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';

  return (
    <section className="mb-12">
      <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
        <Radio size={14} className="text-red-500" /> {s.title}
      </h2>
      <div className="space-y-3">
        {visible.map((w) => {
          const start = new Date(w.webinar_at as string);
          const state = webinarState(w.webinar_at as string, now);
          const title = localized(w.title_en, w.title_sq, lang);
          const courseTitle = w.course ? localized(w.course.title_en, w.course.title_sq, lang) : '';
          return (
            <div key={w.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {start.toLocaleDateString(locale, { month: 'short' })}
                </span>
                <span className="text-xl font-black leading-none">{start.getDate()}</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <button onClick={() => onOpenCourse(w.course_id, w.id)} className="text-left">
                  <p className="font-black text-slate-900 tracking-tight hover:text-blue-600">{title}</p>
                </button>
                <p className="text-xs text-slate-500 mt-0.5">
                  {start.toLocaleString(locale, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                  {courseTitle ? ` · ${courseTitle}` : ''}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    downloadIcs({
                      id: w.id,
                      title: `${w.title_en}${w.course ? ` — ${w.course.title_en}` : ''}`,
                      start: w.webinar_at as string,
                      durationMin: w.duration_min,
                      url: w.join_url,
                      description: `Medident Academy live webinar.${w.join_url ? `\nJoin: ${w.join_url}` : ''}\nPortal: ${portalUrl()}`,
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest"
                >
                  <CalendarPlus size={13} /> {s.addToCalendar}
                </button>
                {state === 'open' && w.join_url ? (
                  <a
                    href={w.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest"
                  >
                    <Video size={13} /> {now >= start.getTime() ? s.live : s.join} <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">{w.join_url ? s.opensSoon : s.noLink}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UpcomingWebinars;
