import React, { useEffect, useState } from 'react';
import { claimCertificate, fetchMyCertificates } from '../../services/portalApi';
import { Certificate, CourseStatus, Lang } from './types';
import CertificateActions from './CertificateActions';
import FeedbackForm from './FeedbackForm';
import { Award, CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface Props {
  lang: Lang;
  courseId: string;
  status: CourseStatus | null;
  /** The course status could not be loaded. */
  statusFailed?: boolean;
  isAdmin: boolean;
  onClaimed: () => void;
  onRetry?: () => void;
  onAccount: () => void;
}

const t = {
  en: {
    title: 'Certificate of completion',
    intro: 'Finish every lesson (and pass the final quiz, if there is one) to earn your Medident Academy certificate.',
    lessons: (d: number, n: number) => `Complete all lessons (${d}/${n})`,
    quiz: (p: number) => `Pass the final quiz (${p}% or more)`,
    get: 'Get my certificate',
    ready: 'Your certificate is ready.',
    code: 'Certificate ID',
    nameRequired: 'Add your full name in Account first — it is printed on the certificate.',
    openAccount: 'Open Account',
    error: 'Could not issue the certificate. Please try again.',
    adminNote: 'Doctors get their certificate here once they finish the course.',
    revoked: 'Your certificate for this course was withdrawn by the academy. If you think this is a mistake, write to medident-ks@gmail.com.',
    loadFailed: 'Could not load your progress for this course.',
    retry: 'Try again',
  },
  sq: {
    title: 'Certifikata e përfundimit',
    intro: 'Përfundoni çdo mësim (dhe kaloni testin përfundimtar, nëse ka) për të fituar certifikatën e Akademisë Medident.',
    lessons: (d: number, n: number) => `Përfundoni të gjitha mësimet (${d}/${n})`,
    quiz: (p: number) => `Kaloni testin përfundimtar (${p}% ose më shumë)`,
    get: 'Merr certifikatën',
    ready: 'Certifikata juaj është gati.',
    code: 'ID e certifikatës',
    nameRequired: 'Shtoni emrin e plotë te Llogaria — shtypet në certifikatë.',
    openAccount: 'Hap Llogarinë',
    error: 'Certifikata nuk u lëshua. Provoni përsëri.',
    adminNote: 'Mjekët marrin certifikatën këtu pasi të përfundojnë kursin.',
    revoked: 'Certifikata juaj për këtë kurs është tërhequr nga akademia. Nëse mendoni se është gabim, shkruani në medident-ks@gmail.com.',
    loadFailed: 'Progresi juaj për këtë kurs nuk u ngarkua.',
    retry: 'Provo përsëri',
  },
};

const CertificatePanel: React.FC<Props> = ({ lang, courseId, status, statusFailed, isAdmin, onClaimed, onRetry, onAccount }) => {
  const s = t[lang];
  const [cert, setCert] = useState<Certificate | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [needName, setNeedName] = useState(false);
  const [revoked, setRevoked] = useState(false);

  // Load the full certificate row when the status says one exists.
  useEffect(() => {
    if (!status?.certificate) return;
    fetchMyCertificates().then((all) => setCert(all.find((c) => c.course_id === courseId) || null));
  }, [status?.certificate?.code, courseId]);

  const claim = async () => {
    setBusy(true);
    setError('');
    setNeedName(false);
    try {
      const c = await claimCertificate(courseId);
      setCert(c);
      onClaimed();
    } catch (e: any) {
      const msg = e?.message || '';
      if (/name_required/.test(msg)) setNeedName(true);
      else if (/revoked/.test(msg)) setRevoked(true);
      else setError(s.error);
    } finally {
      setBusy(false);
    }
  };

  if (!status && statusFailed)
    return (
      <div className="py-10 text-center">
        <p className="text-sm font-bold text-slate-600 mb-4">{s.loadFailed}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
          >
            {s.retry}
          </button>
        )}
      </div>
    );
  if (!status)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );

  if (status.certificate_revoked || revoked)
    return (
      <div>
        <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-4">
          <Award size={20} className="text-slate-400" /> {s.title}
        </h2>
        <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">{s.revoked}</p>
      </div>
    );

  const lessonsOk = status.lessons_total > 0 && status.lessons_done >= status.lessons_total;
  const hasQuiz = status.quiz_questions > 0;

  return (
    <div>
      <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-2">
        <Award size={20} className="text-amber-500" /> {s.title}
      </h2>

      {cert ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
          <p className="font-black text-slate-900 mb-1 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" /> {s.ready}
          </p>
          <p className="text-xs text-slate-500 mb-5">
            {s.code}: <span className="font-bold text-slate-700">{cert.code}</span>
          </p>
          <CertificateActions lang={lang} cert={cert} />
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-6">{s.intro}</p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm">
              {lessonsOk ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} className="text-slate-300" />}
              <span className={lessonsOk ? 'text-slate-700' : 'text-slate-500'}>{s.lessons(status.lessons_done, status.lessons_total)}</span>
            </li>
            {hasQuiz && (
              <li className="flex items-center gap-2 text-sm">
                {status.quiz_passed ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} className="text-slate-300" />}
                <span className={status.quiz_passed ? 'text-slate-700' : 'text-slate-500'}>{s.quiz(status.pass_percent)}</span>
              </li>
            )}
          </ul>
          {isAdmin ? (
            <p className="text-xs text-slate-400">{s.adminNote}</p>
          ) : (
            <button
              onClick={claim}
              disabled={!status.eligible || busy}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Award size={14} />} {s.get}
            </button>
          )}
          {needName && (
            <p className="mt-4 text-xs font-bold text-red-600">
              {s.nameRequired}{' '}
              <button onClick={onAccount} className="underline">
                {s.openAccount}
              </button>
            </p>
          )}
          {error && <p className="mt-4 text-xs font-bold text-red-600">{error}</p>}
        </>
      )}

      {/* Once every lesson is done, ask how the course was. */}
      {!isAdmin && lessonsOk && <FeedbackForm lang={lang} courseId={courseId} />}
    </div>
  );
};

export default CertificatePanel;
