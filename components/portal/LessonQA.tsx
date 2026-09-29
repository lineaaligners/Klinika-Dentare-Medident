import React, { useEffect, useRef, useState } from 'react';
import { fetchComments, postComment, deleteComment } from '../../services/portalApi';
import { Lang, LessonComment } from './types';
import { Loader2, MessageCircle, Send, Trash2, CornerDownRight, BadgeCheck } from 'lucide-react';

interface Props {
  lang: Lang;
  lessonId: string;
  userId: string;
  isAdmin: boolean;
}

const t = {
  en: {
    title: 'Questions & answers',
    hint: 'Ask the instructor about this lesson. Everyone in the course can see questions and answers.',
    placeholder: 'Write your question…',
    ask: 'Ask',
    reply: 'Reply',
    replyPlaceholder: 'Write a reply…',
    send: 'Send',
    cancel: 'Cancel',
    none: 'No questions yet — be the first to ask.',
    academy: 'Medident Academy',
    confirmDelete: 'Delete this message?',
    error: 'Could not post. Please try again.',
  },
  sq: {
    title: 'Pyetje & përgjigje',
    hint: 'Pyesni instruktorin për këtë mësim. Të gjithë në kurs i shohin pyetjet dhe përgjigjet.',
    placeholder: 'Shkruani pyetjen…',
    ask: 'Pyet',
    reply: 'Përgjigju',
    replyPlaceholder: 'Shkruani një përgjigje…',
    send: 'Dërgo',
    cancel: 'Anulo',
    none: 'Ende pa pyetje — bëni të parën.',
    academy: 'Akademia Medident',
    confirmDelete: 'Të fshihet ky mesazh?',
    error: 'Nuk u dërgua. Provoni përsëri.',
  },
};

const LessonQA: React.FC<Props> = ({ lang, lessonId, userId, isAdmin }) => {
  const s = t[lang];
  const [comments, setComments] = useState<LessonComment[] | null>(null);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Only the lesson currently shown may fill the thread (a slow answer for the
  // previous lesson is ignored).
  const currentLesson = useRef(lessonId);
  currentLesson.current = lessonId;
  const load = () => {
    const forLesson = lessonId;
    return fetchComments(forLesson)
      .then((c) => {
        if (currentLesson.current === forLesson) setComments(c);
      })
      .catch(() => {
        if (currentLesson.current === forLesson) setComments([]);
      });
  };
  useEffect(() => {
    setComments(null);
    setDraft('');
    setReplyTo(null);
    setReplyDraft('');
    setError('');
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const send = async (body: string, parentId: string | null) => {
    if (!body.trim()) return;
    setBusy(true);
    setError('');
    try {
      await postComment(lessonId, body.trim(), parentId);
      if (parentId) {
        setReplyTo(null);
        setReplyDraft('');
      } else {
        setDraft('');
      }
      await load();
    } catch {
      setError(s.error);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(s.confirmDelete)) return;
    await deleteComment(id).catch(() => {});
    load();
  };

  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';
  const questions = (comments || []).filter((c) => !c.parent_id);
  const replies = (id: string) => (comments || []).filter((c) => c.parent_id === id);

  const renderMessage = (c: LessonComment) => (
    <div className="group">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-black text-slate-900">{c.author_is_admin ? s.academy : c.author_name || '—'}</span>
        {c.author_is_admin && <BadgeCheck size={14} className="text-blue-600" />}
        <span className="text-[10px] text-slate-400">
          {new Date(c.created_at).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </span>
        {(c.author_id === userId || isAdmin) && (
          <button onClick={() => remove(c.id)} className="ml-auto text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete">
            <Trash2 size={13} />
          </button>
        )}
      </div>
      <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{c.body}</p>
    </div>
  );

  return (
    <section className="mt-10 border-t border-slate-100 pt-8">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-1">
        <MessageCircle size={15} /> {s.title}
      </h3>
      <p className="text-xs text-slate-400 mb-5">{s.hint}</p>

      <div className="flex items-start gap-3 mb-6">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={s.placeholder}
          rows={2}
          maxLength={4000}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
        />
        <button
          onClick={() => send(draft, null)}
          disabled={busy || !draft.trim()}
          className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-40 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          {busy && !replyTo ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} {s.ask}
        </button>
      </div>
      {error && <p className="text-xs font-bold text-red-600 mb-4">{error}</p>}

      {!comments ? (
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      ) : questions.length === 0 ? (
        <p className="text-sm text-slate-400">{s.none}</p>
      ) : (
        <ul className="space-y-4">
          {questions
            .slice()
            .reverse()
            .map((q) => (
              <li key={q.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                {renderMessage(q)}
                {replies(q.id).length > 0 && (
                  <ul className="mt-3 space-y-3 border-l-2 border-blue-100 pl-4">
                    {replies(q.id).map((r) => (
                      <li key={r.id} className={r.author_is_admin ? 'bg-white rounded-xl p-3 border border-blue-100' : ''}>
                        {renderMessage(r)}
                      </li>
                    ))}
                  </ul>
                )}
                {replyTo === q.id ? (
                  <div className="mt-3 flex items-start gap-2">
                    <textarea
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      placeholder={s.replyPlaceholder}
                      rows={2}
                      maxLength={4000}
                      autoFocus
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => send(replyDraft, q.id)}
                        disabled={busy || !replyDraft.trim()}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        {busy ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} {s.send}
                      </button>
                      <button onClick={() => setReplyTo(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {s.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setReplyTo(q.id);
                      setReplyDraft('');
                    }}
                    className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                  >
                    <CornerDownRight size={13} /> {s.reply}
                  </button>
                )}
              </li>
            ))}
        </ul>
      )}
    </section>
  );
};

export default LessonQA;
