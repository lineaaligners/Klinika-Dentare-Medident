import React, { useEffect, useRef, useState } from 'react';
import { PortalLesson, Lang } from './types';
import { lessonMediaUrl, localized, setProgress, trackLessonView, portalUrl } from '../../services/portalApi';
import { downloadIcs, webinarState } from './ics';
import LessonQA from './LessonQA';
import { Loader2, Download, CheckCircle2, Circle, CalendarClock, ExternalLink, CalendarPlus } from 'lucide-react';

interface Props {
  lesson: PortalLesson;
  lang: Lang;
  completed: boolean;
  onToggleComplete: (done: boolean) => void;
  userId: string;
  isAdmin: boolean;
  courseTitle?: string;
}

const t = {
  en: {
    markComplete: 'Mark complete',
    completed: 'Completed',
    download: 'Download PDF',
    join: 'Join webinar',
    scheduledFor: 'Scheduled for',
    addToCalendar: 'Add to calendar',
    opensSoon: 'The join button opens 30 minutes before the start.',
    ended: 'This live session has ended.',
    unavailable: 'This content is not available yet.',
  },
  sq: {
    markComplete: 'Shëno të përfunduar',
    completed: 'Përfunduar',
    download: 'Shkarko PDF',
    join: 'Bashkohu në webinar',
    scheduledFor: 'Planifikuar për',
    addToCalendar: 'Shto në kalendar',
    opensSoon: 'Butoni hapet 30 minuta para fillimit.',
    ended: 'Ky sesion live ka përfunduar.',
    unavailable: 'Kjo përmbajtje nuk është ende e disponueshme.',
  },
};

function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

const LessonViewer: React.FC<Props> = ({ lesson, lang, completed, onToggleComplete, userId, isAdmin, courseTitle }) => {
  const s = t[lang];
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const autoMarked = useRef(false);

  useEffect(() => {
    let active = true;
    autoMarked.current = false;
    setLoading(true);
    setUrl(null);
    if (!isAdmin) void trackLessonView(lesson.id).catch(() => {});
    if (lesson.kind === 'webinar_live') {
      setLoading(false);
      return () => {
        active = false;
      };
    }
    lessonMediaUrl(lesson).then((u) => {
      if (active) {
        setUrl(u);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const setDone = async (next: boolean) => {
    setBusy(true);
    try {
      await setProgress(lesson.id, next);
      onToggleComplete(next);
    } catch {
      /* keep the previous state */
    } finally {
      setBusy(false);
    }
  };

  // Uploaded videos count as complete once 90% has been watched.
  const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (completed || autoMarked.current || !v.duration || isAdmin) return;
    if (v.currentTime / v.duration >= 0.9) {
      autoMarked.current = true;
      void setDone(true);
    }
  };

  const title = localized(lesson.title_en, lesson.title_sq, lang);
  const desc = localized(lesson.description_en, lesson.description_sq, lang);
  const embed = lesson.external_url ? embedUrl(lesson.external_url) : null;
  const liveState = lesson.kind === 'webinar_live' && lesson.webinar_at ? webinarState(lesson.webinar_at) : null;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-xl font-black tracking-tight text-slate-900">{title}</h2>
        <button
          onClick={() => setDone(!completed)}
          disabled={busy}
          className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
            completed ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : completed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
          {completed ? s.completed : s.markComplete}
        </button>
      </div>
      {desc && <p className="text-sm text-slate-500 mb-5 whitespace-pre-line">{desc}</p>}

      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
        {loading ? (
          <div className="aspect-video flex items-center justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : lesson.kind === 'webinar_live' ? (
          <div className="bg-white p-8 text-center">
            <CalendarClock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            {lesson.webinar_at && (
              <p className="text-sm font-bold text-slate-900 mb-1">
                {s.scheduledFor}:{' '}
                {new Date(lesson.webinar_at).toLocaleString(lang === 'sq' ? 'sq-AL' : 'en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              {lesson.webinar_at && liveState !== 'past' && (
                <button
                  onClick={() =>
                    downloadIcs({
                      id: lesson.id,
                      title: `${lesson.title_en}${courseTitle ? ` — ${courseTitle}` : ''}`,
                      start: lesson.webinar_at as string,
                      durationMin: lesson.duration_min,
                      url: lesson.join_url,
                      description: `Medident Academy live webinar.${lesson.join_url ? `\nJoin: ${lesson.join_url}` : ''}\nPortal: ${portalUrl()}`,
                    })
                  }
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest"
                >
                  <CalendarPlus size={14} /> {s.addToCalendar}
                </button>
              )}
              {lesson.join_url && liveState === 'open' && (
                <a
                  href={lesson.join_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest"
                >
                  {s.join} <ExternalLink size={14} />
                </a>
              )}
            </div>
            {liveState === 'upcoming' && lesson.join_url && <p className="text-xs text-slate-400 mt-4">{s.opensSoon}</p>}
            {liveState === 'past' && <p className="text-xs text-slate-400 mt-4">{s.ended}</p>}
            {!lesson.join_url && <p className="text-slate-400 text-sm mt-4">{s.unavailable}</p>}
          </div>
        ) : embed ? (
          <div className="aspect-video">
            <iframe
              src={embed}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : !url ? (
          <div className="aspect-video flex items-center justify-center text-slate-400 text-sm">{s.unavailable}</div>
        ) : lesson.kind === 'pdf' ? (
          <div className="bg-white">
            <iframe src={url} title={title} className="w-full" style={{ height: '70vh' }} />
          </div>
        ) : (
          <video
            src={url}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            onTimeUpdate={onTimeUpdate}
            className="w-full aspect-video bg-black"
          />
        )}
      </div>

      {lesson.kind === 'pdf' && url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
        >
          <Download size={14} /> {s.download}
        </a>
      )}

      <LessonQA lang={lang} lessonId={lesson.id} userId={userId} isAdmin={isAdmin} />
    </div>
  );
};

export default LessonViewer;
