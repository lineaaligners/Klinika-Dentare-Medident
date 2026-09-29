import React, { useEffect, useState } from 'react';
import { fetchQuizQuestions, submitQuiz, localized } from '../../services/portalApi';
import { CourseStatus, Lang, QuizQuestion, QuizResult } from './types';
import { Loader2, ClipboardCheck, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  lang: Lang;
  courseId: string;
  status: CourseStatus | null;
  onSubmitted: () => void;
}

const t = {
  en: {
    title: 'Final quiz',
    intro: (n: number, pass: number) => `${n} questions · pass mark ${pass}% · up to 5 tries a day.`,
    submit: 'Submit answers',
    answerAll: 'Please answer every question.',
    passed: 'Passed!',
    failed: 'Not passed yet',
    score: (sc: number, c: number, tot: number) => `You scored ${sc}% (${c} of ${tot} correct).`,
    wrongHint: 'Review the lessons and try again. Once you pass, you will see which answers were wrong.',
    attemptsLeft: (n: number) => (n === 1 ? '1 try left today.' : `${n} tries left today.`),
    locked: (when: string) => `You have used today's 5 tries. You can try again ${when}.`,
    tomorrow: 'tomorrow',
    after: (time: string) => `after ${time}`,
    retake: 'Retake quiz',
    alreadyPassed: (best: number) => `You have already passed this quiz (best score ${best}%).`,
    error: 'Could not submit. Please try again.',
    none: 'This course has no quiz.',
  },
  sq: {
    title: 'Testi përfundimtar',
    intro: (n: number, pass: number) => `${n} pyetje · kalimi ${pass}% · deri në 5 prova në ditë.`,
    submit: 'Dërgo përgjigjet',
    answerAll: 'Ju lutemi përgjigjuni çdo pyetjeje.',
    passed: 'Kaluat!',
    failed: 'Ende nuk keni kaluar',
    score: (sc: number, c: number, tot: number) => `Rezultati: ${sc}% (${c} nga ${tot} të sakta).`,
    wrongHint: 'Rishikoni mësimet dhe provoni sërish. Pasi të kaloni, do të shihni cilat përgjigje ishin gabim.',
    attemptsLeft: (n: number) => (n === 1 ? 'Ju mbetet 1 provë sot.' : `Ju mbeten ${n} prova sot.`),
    locked: (when: string) => `Keni përdorur 5 provat e sotme. Mund të provoni sërish ${when}.`,
    tomorrow: 'nesër',
    after: (time: string) => `pas orës ${time}`,
    retake: 'Ribëj testin',
    alreadyPassed: (best: number) => `E keni kaluar tashmë këtë test (rezultati më i mirë ${best}%).`,
    error: 'Nuk u dërgua. Provoni përsëri.',
    none: 'Ky kurs nuk ka test.',
  },
};

const QuizPanel: React.FC<Props> = ({ lang, courseId, status, onSubmitted }) => {
  const s = t[lang];
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lockedNow, setLockedNow] = useState(false);
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';

  useEffect(() => {
    fetchQuizQuestions(courseId)
      .then(setQuestions)
      .catch(() => setQuestions([]));
  }, [courseId]);

  const submit = async () => {
    if (!questions) return;
    setError('');
    if (questions.some((q) => answers[q.id] === undefined)) return setError(s.answerAll);
    setBusy(true);
    try {
      const r = await submitQuiz(courseId, answers);
      setResult(r);
      onSubmitted();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      if (/too_many_attempts/.test(e?.message || '')) {
        setLockedNow(true);
        onSubmitted();
      } else setError(s.error);
    } finally {
      setBusy(false);
    }
  };

  const retake = () => {
    setResult(null);
    setAnswers({});
    setError('');
  };

  if (!questions)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  if (questions.length === 0) return <p className="text-slate-500">{s.none}</p>;

  const passMark = status?.pass_percent ?? 70;
  const wrong = new Set(result?.wrong || []);
  // Per-question marks only after passing (the server sends them only then).
  const graded = Boolean(result?.passed);
  const retryAt = status?.quiz_retry_at ? new Date(status.quiz_retry_at) : null;
  const whenText = retryAt
    ? s.after(retryAt.toLocaleString(locale, { weekday: 'short', hour: '2-digit', minute: '2-digit' }))
    : s.tomorrow;
  const outOfTries = lockedNow || (status?.quiz_attempts_left ?? 5) === 0;
  const lockedNotice = (
    <p className="mb-6 text-sm font-bold text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">{s.locked(whenText)}</p>
  );

  return (
    <div>
      <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-2">
        <ClipboardCheck size={20} className="text-blue-600" /> {s.title}
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        {s.intro(questions.length, passMark)}
        {!result && !outOfTries && status && !status.quiz_passed && status.quiz_attempts_left < 5 && (
          <span className="block text-xs font-bold text-slate-600 mt-1">{s.attemptsLeft(status.quiz_attempts_left)}</span>
        )}
      </p>

      {status?.quiz_passed && !result && status.best_score !== null && (
        <p className="mb-6 text-sm font-bold text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <CheckCircle2 size={16} /> {s.alreadyPassed(status.best_score)}
        </p>
      )}

      {result && (
        <div className={`mb-8 rounded-2xl p-5 border ${result.passed ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
          <p className={`text-lg font-black flex items-center gap-2 ${result.passed ? 'text-green-700' : 'text-amber-700'}`}>
            {result.passed ? <CheckCircle2 size={20} /> : <XCircle size={20} />} {result.passed ? s.passed : s.failed}
          </p>
          <p className="text-sm text-slate-700 mt-1">{s.score(result.score, result.correct, result.total)}</p>
          {!result.passed && (
            <p className="text-xs text-slate-500 mt-2">
              {s.wrongHint} {result.attempts_left > 0 && s.attemptsLeft(result.attempts_left)}
            </p>
          )}
          {result.attempts_left > 0 ? (
            <button
              onClick={retake}
              className="mt-4 flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              <RotateCcw size={13} /> {s.retake}
            </button>
          ) : (
            !result.passed && <p className="mt-4 text-xs font-bold text-amber-800">{s.locked(whenText)}</p>
          )}
        </div>
      )}

      {!result && outOfTries && lockedNotice}

      <ol className="space-y-5">
        {questions.map((q, qi) => {
          const isWrong = graded && wrong.has(q.id);
          const isRight = graded && !wrong.has(q.id);
          return (
            <li
              key={q.id}
              className={`rounded-2xl border p-4 sm:p-5 ${isWrong ? 'border-red-200 bg-red-50/40' : isRight ? 'border-green-200 bg-green-50/40' : 'border-slate-200'}`}
            >
              <p className="font-bold text-slate-900 text-sm mb-3">
                {qi + 1}. {localized(q.question_en, q.question_sq, lang)}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                      answers[q.id] === oi ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    } ${result ? 'pointer-events-none' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === oi}
                      onChange={() => setAnswers({ ...answers, [q.id]: oi })}
                      disabled={Boolean(result)}
                      className="mt-0.5 accent-blue-600"
                    />
                    <span className="text-slate-700">{localized(opt.en, opt.sq, lang)}</span>
                  </label>
                ))}
              </div>
            </li>
          );
        })}
      </ol>

      {!result && !outOfTries && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={submit}
            disabled={busy}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest"
          >
            {busy && <Loader2 size={14} className="animate-spin" />} {s.submit}
          </button>
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default QuizPanel;
