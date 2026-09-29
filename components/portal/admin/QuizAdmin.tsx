import React, { useEffect, useState } from 'react';
import { Lang, QuizQuestionWithKey } from '../types';
import { adminFetchQuiz, adminSaveQuestion, adminDeleteQuestion, localized } from '../../../services/portalApi';
import { Loader2, Plus, Trash2, Pencil, ClipboardCheck, CheckCircle2, AlertTriangle, X } from 'lucide-react';

const t = {
  en: {
    title: 'Final quiz',
    intro: 'To get the certificate, doctors finish every lesson and pass this quiz. With no questions, finishing the lessons is enough.',
    passMark: (p: number) => `Pass mark ${p}% — change it in the course details above.`,
    count: (n: number) => (n === 1 ? '1 question' : `${n} questions`),
    add: 'Add question',
    questionEn: 'Question (English)',
    questionSq: 'Question (Albanian)',
    answers: 'Answers — select the correct one',
    answerEn: (n: number) => `Answer ${n} (English)`,
    answerSq: (n: number) => `Answer ${n} (Albanian)`,
    addAnswer: 'Add answer',
    removeAnswer: 'Remove answer',
    markCorrect: 'Correct answer',
    save: 'Save question',
    saving: 'Saving…',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    correct: 'Correct',
    noKey: 'No correct answer set — edit and save it',
    none: 'No questions yet.',
    needQuestion: 'Write the question in English.',
    needAnswers: 'Every answer needs its English text.',
    confirmDelete: 'Delete this question?',
  },
  sq: {
    title: 'Testi përfundimtar',
    intro: 'Për certifikatën, mjekët përfundojnë çdo mësim dhe kalojnë këtë test. Pa pyetje, mjafton përfundimi i mësimeve.',
    passMark: (p: number) => `Pragu i kalimit ${p}% — ndryshojeni te të dhënat e kursit më lart.`,
    count: (n: number) => (n === 1 ? '1 pyetje' : `${n} pyetje`),
    add: 'Shto pyetje',
    questionEn: 'Pyetja (Anglisht)',
    questionSq: 'Pyetja (Shqip)',
    answers: 'Përgjigjet — zgjidhni të saktën',
    answerEn: (n: number) => `Përgjigja ${n} (Anglisht)`,
    answerSq: (n: number) => `Përgjigja ${n} (Shqip)`,
    addAnswer: 'Shto përgjigje',
    removeAnswer: 'Hiq përgjigjen',
    markCorrect: 'Përgjigja e saktë',
    save: 'Ruaj pyetjen',
    saving: 'Duke ruajtur…',
    cancel: 'Anulo',
    edit: 'Ndrysho',
    delete: 'Fshi',
    correct: 'E saktë',
    noKey: 'Pa përgjigje të saktë — ndryshojeni dhe ruajeni',
    none: 'Ende pa pyetje.',
    needQuestion: 'Shkruani pyetjen në anglisht.',
    needAnswers: 'Çdo përgjigje ka nevojë për tekstin në anglisht.',
    confirmDelete: 'Të fshihet kjo pyetje?',
  },
};

interface Draft {
  id?: string;
  question_en: string;
  question_sq: string;
  options: { en: string; sq: string }[];
  correct: number;
  sort_order: number;
}

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

const blankDraft = (sort: number): Draft => ({
  question_en: '',
  question_sq: '',
  options: [
    { en: '', sq: '' },
    { en: '', sq: '' },
    { en: '', sq: '' },
  ],
  correct: 0,
  sort_order: sort,
});

const QuizAdmin: React.FC<{ lang: Lang; courseId: string; passPercent: number }> = ({ lang, courseId, passPercent }) => {
  const s = t[lang];
  const [questions, setQuestions] = useState<QuizQuestionWithKey[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    adminFetchQuiz(courseId)
      .then(setQuestions)
      .catch((e) => {
        setQuestions([]);
        setError(e.message);
      });

  useEffect(() => {
    setDraft(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const nextSort = () => (questions && questions.length ? Math.max(...questions.map((q) => q.sort_order)) + 1 : 0);

  const startNew = () => {
    setError('');
    setDraft(blankDraft(nextSort()));
  };

  const startEdit = (q: QuizQuestionWithKey) => {
    setError('');
    setDraft({
      id: q.id,
      question_en: q.question_en,
      question_sq: q.question_sq || '',
      options: q.options.map((o) => ({ en: o.en || '', sq: o.sq || '' })),
      correct: q.correct_index !== null && q.correct_index < q.options.length ? q.correct_index : 0,
      sort_order: q.sort_order,
    });
  };

  const setOption = (i: number, field: 'en' | 'sq', value: string) => {
    if (!draft) return;
    const options = draft.options.map((o, j) => (j === i ? { ...o, [field]: value } : o));
    setDraft({ ...draft, options });
  };

  const addOption = () => {
    if (!draft || draft.options.length >= MAX_OPTIONS) return;
    setDraft({ ...draft, options: [...draft.options, { en: '', sq: '' }] });
  };

  const removeOption = (i: number) => {
    if (!draft || draft.options.length <= MIN_OPTIONS) return;
    const options = draft.options.filter((_, j) => j !== i);
    // Keep the same answer marked correct after the list shifts.
    const correct = i === draft.correct ? 0 : i < draft.correct ? draft.correct - 1 : draft.correct;
    setDraft({ ...draft, options, correct });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setError('');
    const question_en = draft.question_en.trim();
    const options = draft.options.map((o) => ({ en: o.en.trim(), sq: o.sq.trim() }));
    if (!question_en) return setError(s.needQuestion);
    if (options.length < MIN_OPTIONS || options.some((o) => !o.en)) return setError(s.needAnswers);
    setBusy(true);
    try {
      await adminSaveQuestion(
        courseId,
        {
          id: draft.id,
          question_en,
          question_sq: draft.question_sq.trim() || null,
          options: options.map((o) => (o.sq ? { en: o.en, sq: o.sq } : { en: o.en })),
          sort_order: draft.sort_order,
        },
        Math.min(draft.correct, options.length - 1),
      );
      setDraft(null);
      await load();
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (q: QuizQuestionWithKey) => {
    if (!window.confirm(s.confirmDelete)) return;
    setError('');
    try {
      await adminDeleteQuestion(q.id);
      if (draft?.id === q.id) setDraft(null);
      await load();
    } catch (err: any) {
      setError(err.message || 'Error');
    }
  };

  const input = 'w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white';

  // Rendered through a function (not a nested component) so typing never remounts the inputs.
  const renderEditor = () =>
    draft && (
      <form onSubmit={save} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <textarea
            value={draft.question_en}
            onChange={(e) => setDraft({ ...draft, question_en: e.target.value })}
            placeholder={s.questionEn}
            rows={2}
            className={input}
          />
          <textarea
            value={draft.question_sq}
            onChange={(e) => setDraft({ ...draft, question_sq: e.target.value })}
            placeholder={s.questionSq}
            rows={2}
            className={input}
          />
        </div>

        <fieldset>
          <legend className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{s.answers}</legend>
          <div className="space-y-2">
            {draft.options.map((o, i) => (
              <div
                key={i}
                className={`grid grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border p-2 ${
                  draft.correct === i ? 'border-green-300 bg-green-50/60' : 'border-slate-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="quiz-correct"
                  checked={draft.correct === i}
                  onChange={() => setDraft({ ...draft, correct: i })}
                  aria-label={`${s.markCorrect} ${i + 1}`}
                  className="w-4 h-4 ml-1 accent-green-600"
                />
                <input value={o.en} onChange={(e) => setOption(i, 'en', e.target.value)} placeholder={s.answerEn(i + 1)} className={input} />
                <input
                  value={o.sq}
                  onChange={(e) => setOption(i, 'sq', e.target.value)}
                  placeholder={s.answerSq(i + 1)}
                  className={`${input} col-start-2 sm:col-start-auto`}
                />
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  disabled={draft.options.length <= MIN_OPTIONS}
                  aria-label={s.removeAnswer}
                  title={s.removeAnswer}
                  className="p-1.5 text-slate-300 hover:text-red-500 disabled:opacity-0 row-start-1 col-start-3 sm:row-start-auto sm:col-start-auto"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
          {draft.options.length < MAX_OPTIONS && (
            <button type="button" onClick={addOption} className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600">
              <Plus size={13} /> {s.addAnswer}
            </button>
          )}
        </fieldset>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            {busy && <Loader2 size={13} className="animate-spin" />} {busy ? s.saving : s.save}
          </button>
          <button type="button" onClick={() => setDraft(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700">
            {s.cancel}
          </button>
        </div>
      </form>
    );

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <ClipboardCheck size={16} className="text-slate-400" /> {s.title}
          {questions && questions.length > 0 && <span className="text-slate-400 normal-case tracking-normal font-bold">· {s.count(questions.length)}</span>}
        </h3>
        {!draft && (
          <button onClick={startNew} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
            <Plus size={14} /> {s.add}
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-1">{s.intro}</p>
      <p className="text-xs text-slate-500 font-bold mb-5">{s.passMark(passPercent)}</p>

      {error && <p className="text-xs font-bold text-red-600 mb-3">{error}</p>}

      {!questions ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {questions.length === 0 && !draft && <p className="text-sm text-slate-400">{s.none}</p>}

          {questions.map((q, qi) =>
            draft?.id === q.id ? (
              <div key={q.id}>{renderEditor()}</div>
            ) : (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-slate-800">
                    {qi + 1}. {localized(q.question_en, q.question_sq, lang)}
                  </p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => startEdit(q)}
                      disabled={Boolean(draft)}
                      className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-40"
                    >
                      <Pencil size={12} /> {s.edit}
                    </button>
                    <button onClick={() => remove(q)} className="text-slate-300 hover:text-red-500" aria-label={s.delete} title={s.delete}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <ul className="mt-2 space-y-1">
                  {q.options.map((o, oi) => {
                    const isCorrect = q.correct_index === oi;
                    return (
                      <li key={oi} className={`text-xs flex items-center gap-2 ${isCorrect ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" aria-hidden="true" />
                        ) : (
                          <span className="w-[13px] h-[13px] rounded-full border border-slate-300 flex-shrink-0" aria-hidden="true" />
                        )}
                        <span className="min-w-0 break-words">{localized(o.en, o.sq, lang)}</span>
                        {isCorrect && <span className="sr-only">({s.correct})</span>}
                      </li>
                    );
                  })}
                </ul>
                {q.correct_index === null && (
                  <p className="mt-2 text-[11px] font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle size={12} className="text-amber-500" /> {s.noKey}
                  </p>
                )}
              </div>
            ),
          )}

          {draft && !draft.id && renderEditor()}
        </div>
      )}
    </div>
  );
};

export default QuizAdmin;
