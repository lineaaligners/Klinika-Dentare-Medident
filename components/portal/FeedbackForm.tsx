import React, { useEffect, useState } from 'react';
import { CourseFeedback, Lang } from './types';
import { fetchMyFeedback, submitFeedback } from '../../services/portalApi';
import { Loader2, Star, CheckCircle2, MessageSquareHeart } from 'lucide-react';

const t = {
  en: {
    title: 'Rate this course',
    intro: 'How useful was this course for your practice? Your answer goes to the academy.',
    comment: 'What did you like? What could be better? (optional)',
    allowQuote: 'Medident may quote my feedback on its website, with my name and city',
    send: 'Send feedback',
    update: 'Update feedback',
    thanks: 'Thank you — your feedback helps us improve the academy.',
    edit: 'Edit',
    pickStars: 'Choose 1 to 5 stars.',
    error: 'Could not save. Please try again.',
    star: (n: number) => `${n} of 5 stars`,
  },
  sq: {
    title: 'Vlerësoni kursin',
    intro: 'Sa i dobishëm ishte ky kurs për praktikën tuaj? Përgjigja shkon te akademia.',
    comment: 'Çfarë ju pëlqeu? Çfarë mund të përmirësohet? (opsionale)',
    allowQuote: 'Medident mund ta citojë mendimin tim në faqen e saj, me emrin dhe qytetin tim',
    send: 'Dërgo vlerësimin',
    update: 'Përditëso vlerësimin',
    thanks: 'Faleminderit — mendimi juaj na ndihmon ta përmirësojmë akademinë.',
    edit: 'Ndrysho',
    pickStars: 'Zgjidhni nga 1 deri në 5 yje.',
    error: 'Nuk u ruajt. Provoni përsëri.',
    star: (n: number) => `${n} nga 5 yje`,
  },
};

/** Stars + optional comment + permission to quote. One per doctor and course; can be edited. */
const FeedbackForm: React.FC<{ lang: Lang; courseId: string }> = ({ lang, courseId }) => {
  const s = t[lang];
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState<CourseFeedback | null>(null);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [allowQuote, setAllowQuote] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchMyFeedback(courseId).then((f) => {
      if (!active) return;
      setSaved(f);
      if (f) {
        setRating(f.rating);
        setComment(f.comment || '');
        setAllowQuote(f.allow_quote);
      }
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [courseId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return setError(s.pickStars);
    setBusy(true);
    setError('');
    try {
      const f = await submitFeedback(courseId, rating, comment, allowQuote);
      setSaved(f);
      setEditing(false);
    } catch {
      setError(s.error);
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) return null;

  const stars = (value: number, interactive: boolean) => (
    <div className="flex items-center gap-1" onMouseLeave={() => interactive && setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= (interactive && hover ? hover : value);
        return interactive ? (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={s.star(n)}
            aria-pressed={rating === n}
            className="p-0.5"
          >
            <Star size={26} className={on ? 'text-amber-400' : 'text-slate-300'} fill={on ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </button>
        ) : (
          <Star key={n} size={16} className={on ? 'text-amber-400' : 'text-slate-300'} fill={on ? 'currentColor' : 'none'} strokeWidth={1.5} />
        );
      })}
    </div>
  );

  return (
    <section className="mt-8 border-t border-slate-100 pt-8">
      <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2 mb-1">
        <MessageSquareHeart size={18} className="text-blue-600" /> {s.title}
      </h3>

      {saved && !editing ? (
        <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="sr-only">{s.star(saved.rating)}</span>
            {stars(saved.rating, false)}
            <button onClick={() => setEditing(true)} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">
              {s.edit}
            </button>
          </div>
          {saved.comment && <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">“{saved.comment}”</p>}
          <p className="text-xs text-green-700 font-bold mt-3 flex items-center gap-1.5">
            <CheckCircle2 size={14} /> {s.thanks}
          </p>
        </div>
      ) : (
        <form onSubmit={send} className="mt-2 space-y-4">
          <p className="text-sm text-slate-500">{s.intro}</p>
          {stars(rating, true)}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={s.comment}
            rows={3}
            maxLength={2000}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
          />
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={allowQuote} onChange={(e) => setAllowQuote(e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-600" />
            {s.allowQuote}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              {busy && <Loader2 size={13} className="animate-spin" />} {saved ? s.update : s.send}
            </button>
            {error && <p className="text-xs font-bold text-red-600">{error}</p>}
          </div>
        </form>
      )}
    </section>
  );
};

export default FeedbackForm;
