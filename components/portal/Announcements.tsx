import React, { useState } from 'react';
import { Announcement, Lang } from './types';
import { localized } from '../../services/portalApi';
import { Megaphone, X } from 'lucide-react';

const t = {
  en: { label: 'Announcement', close: 'Close announcement', more: 'Show more', less: 'Show less' },
  sq: { label: 'Njoftim', close: 'Mbyll njoftimin', more: 'Më shumë', less: 'Më pak' },
};

/** Plain text with http(s) links made clickable (React escapes everything else). */
export function linkify(text: string): React.ReactNode[] {
  return text.split(/(https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]'])/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline break-all">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

const LONG = 280;

const Item: React.FC<{ lang: Lang; a: Announcement; onDismiss: (id: string) => void }> = ({ lang, a, onDismiss }) => {
  const s = t[lang];
  const [open, setOpen] = useState(false);
  const title = localized(a.title_en, a.title_sq, lang);
  const body = localized(a.body_en, a.body_sq, lang);
  const course = a.course_id ? localized(a.course_title_en, a.course_title_sq, lang) : '';
  const date = new Date(a.created_at).toLocaleDateString(lang === 'sq' ? 'sq-AL' : 'en-GB', { day: 'numeric', month: 'short' });
  const long = body.length > LONG;

  return (
    <div className="relative bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 pr-12 sm:pr-14 shadow-sm shadow-blue-600/5">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <Megaphone size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-0.5">
            {s.label} · {date}
            {course && <span className="text-slate-400 normal-case tracking-normal font-bold"> · {course}</span>}
          </p>
          <p className="font-black text-slate-900 tracking-tight">{title}</p>
          {body && (
            <p className={`text-sm text-slate-600 mt-1 whitespace-pre-wrap break-words ${long && !open ? 'line-clamp-4' : ''}`}>{linkify(body)}</p>
          )}
          {long && (
            <button onClick={() => setOpen(!open)} className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">
              {open ? s.less : s.more}
            </button>
          )}
        </div>
      </div>
      <button
        onClick={() => onDismiss(a.id)}
        aria-label={s.close}
        title={s.close}
        className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

/** News from the academy on the dashboard; each one can be closed. */
const Announcements: React.FC<{ lang: Lang; items: Announcement[]; onDismiss: (id: string) => void }> = ({ lang, items, onDismiss }) => {
  if (items.length === 0) return null;
  return (
    <div className="mb-8 space-y-3">
      {items.map((a) => (
        <Item key={a.id} lang={lang} a={a} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default Announcements;
