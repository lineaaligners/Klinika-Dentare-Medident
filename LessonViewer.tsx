import React, { useEffect, useState } from 'react';
import { PortalLesson, Lang } from './types';
import { lessonMediaUrl, localized, setProgress } from '../../services/portalApi';
import { Loader2, Download, CheckCircle2, Circle, CalendarClock, ExternalLink } from 'lucide-react';

interface Props {
  lesson: PortalLesson;
  lang: Lang;
  completed: boolean;
  onToggleComplete: (done: boolean) => void;
}

const t = {
  en: {
    markComplete: 'Mark complete',
    completed: 'Completed',
    download: 'Download PDF',
    join: 'Join webinar',
    scheduledFor: 'Scheduled for',
    unavailable: 'This content is not available yet.',
  },
  sq: {
    markComplete: 'Shëno të përfunduar',
    completed: 'Përfunduar',
    download: 'Shkarko PDF',
    join: 'Bashkohu në webinar',
    scheduledFor: 'Planifikuar për',
    unavailable: 'Kjo përmbajtje nuk është ende e disponueshme.',
  },
};

function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

const LessonViewer: React.FC<Props> = ({ lesson, lang, completed, onToggleComplete }) => {
  const s = t[lang];
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setUrl(null);
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
  }, [lesson.id]);

  const toggle = async () => {
    setBusy(true);
    const next = !completed;
    try {
      await setProgress(lesson.id, next);
      onToggleComplete(next);
    } finally {
      setBusy(false);
    }
  };

  const title = localized(lesson.title_en, lesson.title_sq, lang);
  const desc = localized(lesson.description_en, lesson.description_sq, lang);
  const embed = lesson.external_url ? embedUrl(lesson.external_url) : null;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-xl font-black tracking-tight text-slate-900">{title}</h2>
        <button
          onClick={toggle}
          disabled={busy}
          className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
            completed ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : completed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
          {completed ? s.completed : s.markComplete}
        </button>
      </div>
      {desc && <p className="text-sm text-slate-500 mb-5">{desc}</p>}

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
                {s.scheduledFor}: {new Date(lesson.webinar_at).toLocaleString(lang === 'sq' ? 'sq-AL' : 'en-GB')}
              </p>
            )}
            {lesson.join_url ? (
              <a
                href={lesson.join_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest"
              >
                {s.join} <ExternalLink size={14} />
              </a>
            ) : (
              <p className="text-slate-400 text-sm">{s.unavailable}</p>
            )}
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
          <video src={url} controls controlsList="nodownload" className="w-full aspect-video bg-black" />
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
    </div>
  );
};

export default LessonViewer;
