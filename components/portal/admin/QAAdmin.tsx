import React, { useEffect, useState } from 'react';
import { AdminComment, Lang } from '../types';
import { adminFetchRecentComments, postComment, deleteComment, localized } from '../../../services/portalApi';
import { Loader2, MessageCircle, Send, Trash2, BadgeCheck, CheckCircle2 } from 'lucide-react';

const t = {
  en: {
    unanswered: 'Unanswered',
    all: 'All questions',
    none: 'Nothing here — every question has an answer.',
    noneAll: 'No questions yet.',
    answer: 'Write your answer…',
    send: 'Answer',
    answered: 'Answered',
    academy: 'Medident Academy',
    confirmDelete: 'Delete this message?',
    hint: 'Answers are posted as “Medident Academy” and the doctor gets an email.',
    error: 'Could not post the answer.',
  },
  sq: {
    unanswered: 'Pa përgjigje',
    all: 'Të gjitha pyetjet',
    none: 'Asgjë këtu — çdo pyetje ka përgjigje.',
    noneAll: 'Ende pa pyetje.',
    answer: 'Shkruani përgjigjen…',
    send: 'Përgjigju',
    answered: 'Me përgjigje',
    academy: 'Akademia Medident',
    confirmDelete: 'Të fshihet ky mesazh?',
    hint: 'Përgjigjet publikohen si “Akademia Medident” dhe mjeku merr email.',
    error: 'Përgjigja nuk u publikua.',
  },
};

const QAAdmin: React.FC<{ lang: Lang; onChanged: () => void }> = ({ lang, onChanged }) => {
  const s = t[lang];
  const [comments, setComments] = useState<AdminComment[] | null>(null);
  const [filter, setFilter] = useState<'unanswered' | 'all'>('unanswered');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';

  const load = () =>
    adminFetchRecentComments()
      .then((c) => {
        setComments(c);
        setError('');
      })
      .catch((e) => setError(e.message || 'Error'));
  useEffect(() => {
    load();
  }, []);

  if (!comments && error) return <p className="text-sm font-bold text-red-600">{error}</p>;
  if (!comments)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );

  const repliesOf = (id: string) =>
    comments.filter((c) => c.parent_id === id).sort((a, b) => a.created_at.localeCompare(b.created_at));
  const questions = comments.filter((c) => !c.parent_id && !c.author_is_admin);
  const isAnswered = (q: AdminComment) => repliesOf(q.id).some((r) => r.author_is_admin);
  const shown = filter === 'unanswered' ? questions.filter((q) => !isAnswered(q)) : questions;

  const answer = async (q: AdminComment) => {
    const body = (drafts[q.id] || '').trim();
    if (!body) return;
    setBusyId(q.id);
    setError('');
    try {
      await postComment(q.lesson_id, body, q.id);
      setDrafts((d) => ({ ...d, [q.id]: '' }));
      await load();
      onChanged();
    } catch {
      setError(s.error);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(s.confirmDelete)) return;
    await deleteComment(id).catch(() => {});
    await load();
    onChanged();
  };

  const when = (iso: string) => new Date(iso).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {(['unanswered', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
              filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            {f === 'unanswered' ? s.unanswered : s.all}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 mb-6">{s.hint}</p>
      {error && <p className="text-xs font-bold text-red-600 mb-4">{error}</p>}

      {shown.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          {filter === 'unanswered' ? s.none : s.noneAll}
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((q) => (
            <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                {q.lesson?.course ? `${localized(q.lesson.course.title_en, q.lesson.course.title_sq, lang)} › ` : ''}
                {q.lesson ? localized(q.lesson.title_en, q.lesson.title_sq, lang) : ''}
                {isAnswered(q) && (
                  <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                    <CheckCircle2 size={11} /> {s.answered}
                  </span>
                )}
              </p>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900">
                    {q.author_name} <span className="font-normal text-slate-400 ml-1">{when(q.created_at)}</span>
                  </p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap break-words mt-1">{q.body}</p>
                </div>
                <button onClick={() => remove(q.id)} className="text-slate-300 hover:text-red-500 flex-shrink-0" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>

              {repliesOf(q.id).length > 0 && (
                <ul className="mt-3 space-y-2 border-l-2 border-blue-100 pl-4">
                  {repliesOf(q.id).map((r) => (
                    <li key={r.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 flex items-center gap-1">
                          {r.author_is_admin ? s.academy : r.author_name}
                          {r.author_is_admin && <BadgeCheck size={13} className="text-blue-600" />}
                          <span className="font-normal text-slate-400 ml-1">{when(r.created_at)}</span>
                        </p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{r.body}</p>
                      </div>
                      <button onClick={() => remove(r.id)} className="text-slate-300 hover:text-red-500 flex-shrink-0" aria-label="Delete">
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex items-start gap-2">
                <textarea
                  value={drafts[q.id] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDrafts((d) => ({ ...d, [q.id]: value }));
                  }}
                  placeholder={s.answer}
                  rows={2}
                  maxLength={4000}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                />
                <button
                  onClick={() => answer(q)}
                  disabled={busyId === q.id || !(drafts[q.id] || '').trim()}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
                >
                  {busyId === q.id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} {s.send}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QAAdmin;
