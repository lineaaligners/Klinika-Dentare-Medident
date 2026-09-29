import React, { useEffect, useRef, useState } from 'react';
import { Lang, VerifiedCertificate } from './types';
import { verifyCertificate, localized } from '../../services/portalApi';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { Globe2, Loader2, Search, ShieldCheck, ShieldAlert, Award } from 'lucide-react';

// Public page: /academy/verify and /academy/verify/<code>.
// Anyone (a clinic, an employer, a patient) can confirm a Medident Academy
// certificate is genuine. Only what is printed on the certificate is shown.

const t = {
  en: {
    kicker: 'Certificate verification',
    title: 'Verify a Medident Academy certificate',
    intro: 'Enter the certificate ID printed at the bottom of the certificate, or scan its QR code.',
    placeholder: 'MA-XXXX-XXXX',
    check: 'Verify',
    checking: 'Checking…',
    valid: 'Valid certificate',
    validNote: 'This certificate was issued by Medident Academy.',
    awardedTo: 'Awarded to',
    course: 'Course',
    instructor: 'Instructor',
    issued: 'Issued on',
    code: 'Certificate ID',
    notFound: 'No certificate found',
    notFoundNote: 'Check the ID and try again (format MA-XXXX-XXXX). A certificate that was withdrawn no longer appears here.',
    error: 'The check could not be completed right now. Please try again in a moment.',
    contact: 'Questions? Write to',
    back: 'Medident Academy',
  },
  sq: {
    kicker: 'Verifikimi i certifikatës',
    title: 'Verifikoni një certifikatë të Akademisë Medident',
    intro: 'Shkruani ID-në e certifikatës që gjendet në fund të saj, ose skanoni kodin QR.',
    placeholder: 'MA-XXXX-XXXX',
    check: 'Verifiko',
    checking: 'Duke kontrolluar…',
    valid: 'Certifikatë e vlefshme',
    validNote: 'Kjo certifikatë është lëshuar nga Akademia Medident.',
    awardedTo: 'Mbajtësi i certifikatës',
    course: 'Kursi',
    instructor: 'Instruktori',
    issued: 'Lëshuar më',
    code: 'ID e certifikatës',
    notFound: 'Asnjë certifikatë nuk u gjet',
    notFoundNote: 'Kontrolloni ID-në dhe provoni sërish (formati MA-XXXX-XXXX). Një certifikatë e tërhequr nuk shfaqet më këtu.',
    error: 'Kontrolli nuk u krye dot tani. Provoni përsëri pas pak.',
    contact: 'Pyetje? Shkruani në',
    back: 'Akademia Medident',
  },
};

const CONTACT = 'medident-ks@gmail.com';

/** Accepts "ma 1a2b 3c4d", "MA1A2B3C4D", " ma-1a2b-3c4d " … -> "MA-1A2B-3C4D". */
export const normalizeCode = (raw: string): string => {
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (/^MA[0-9A-F]{8}$/.test(compact)) return `MA-${compact.slice(2, 6)}-${compact.slice(6)}`;
  return raw.trim().toUpperCase();
};

type State =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'valid'; cert: VerifiedCertificate }
  | { kind: 'not_found'; code: string }
  | { kind: 'error' };

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  initialCode?: string;
  onExit: () => void;
}

const VerifyCertificatePage: React.FC<Props> = ({ lang, onToggleLang, initialCode, onExit }) => {
  const s = t[lang];
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';
  const [code, setCode] = useState(initialCode ? normalizeCode(initialCode) : '');
  const [state, setState] = useState<State>({ kind: 'idle' });
  const inputRef = useRef<HTMLInputElement>(null);

  // Certificate pages carry doctors' names: keep them out of search engines.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const check = async (raw: string) => {
    const normalized = normalizeCode(raw);
    if (!normalized) return;
    setCode(normalized);
    // Keep the address shareable: /academy/verify/<code>
    const path = `/academy/verify/${encodeURIComponent(normalized)}`;
    if (window.location.pathname !== path) window.history.replaceState({ view: 'verify', id: normalized }, '', path);
    if (!isSupabaseConfigured) return setState({ kind: 'error' });
    setState({ kind: 'checking' });
    try {
      const cert = await verifyCertificate(normalized);
      setState(cert ? { kind: 'valid', cert } : { kind: 'not_found', code: normalized });
    } catch {
      setState({ kind: 'error' });
    }
  };

  useEffect(() => {
    if (initialCode) check(initialCode);
    else inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    check(code);
  };

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a
            href="/academy"
            onClick={(e) => {
              e.preventDefault();
              onExit();
            }}
            className="flex flex-col leading-none"
            title={s.back}
          >
            <span className="text-base font-display font-black tracking-tighter text-slate-900">
              MEDIDENT<span className="text-blue-600">.</span>ACADEMY
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400">{s.kicker}</span>
          </a>
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 px-2 py-2"
          >
            <Globe2 size={14} /> {lang === 'en' ? 'SQ' : 'EN'}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-3 flex items-center gap-2">
          <Award size={14} /> {s.kicker}
        </p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-3">{s.title}</h1>
        <p className="text-sm text-slate-500 mb-8">{s.intro}</p>

        <form onSubmit={submit} className="flex gap-2 mb-8">
          <label htmlFor="cert-code" className="sr-only">
            {s.code}
          </label>
          <input
            id="cert-code"
            ref={inputRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={s.placeholder}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={40}
            className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 bg-white text-base font-bold tracking-widest uppercase outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={state.kind === 'checking' || !code.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest"
          >
            {state.kind === 'checking' ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            <span className="hidden sm:inline">{state.kind === 'checking' ? s.checking : s.check}</span>
          </button>
        </form>

        <div aria-live="polite">
          {state.kind === 'valid' && (
            <section className="bg-white border border-green-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex items-center gap-3">
                <ShieldCheck size={24} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-black text-green-800">{s.valid}</p>
                  <p className="text-xs text-green-700">{s.validNote}</p>
                </div>
              </div>
              <dl className="px-6 py-5 space-y-4">
                <div>
                  <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.awardedTo}</dt>
                  <dd className="text-xl font-black tracking-tight text-slate-900 mt-0.5">{state.cert.doctor_name}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.course}</dt>
                  <dd className="text-sm font-bold text-slate-800 mt-0.5">{localized(state.cert.course_title_en, state.cert.course_title_sq, lang)}</dd>
                </div>
                {state.cert.instructor_name && (
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.instructor}</dt>
                    <dd className="text-sm text-slate-700 mt-0.5">{state.cert.instructor_name}</dd>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.issued}</dt>
                    <dd className="text-sm text-slate-700 mt-0.5">{fmtDate(state.cert.issued_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.code}</dt>
                    <dd className="text-sm font-bold text-slate-900 tracking-wider mt-0.5">{state.cert.code}</dd>
                  </div>
                </div>
              </dl>
            </section>
          )}

          {state.kind === 'not_found' && (
            <section className="bg-white border border-amber-200 rounded-3xl px-6 py-5 flex items-start gap-3">
              <ShieldAlert size={24} className="text-amber-500 flex-shrink-0" />
              <div>
                <p className="font-black text-slate-900">
                  {s.notFound} <span className="text-slate-400 font-bold tracking-wider">· {state.code}</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">{s.notFoundNote}</p>
              </div>
            </section>
          )}

          {state.kind === 'error' && (
            <p className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600">{s.error}</p>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-xs text-slate-400 flex flex-wrap gap-x-2 gap-y-1 justify-between">
          <span>Medident Academy · Klinika Dentare Medident · Pejë, Kosovo</span>
          <span>
            {s.contact}{' '}
            <a href={`mailto:${CONTACT}`} className="font-bold text-slate-500 hover:text-blue-600">
              {CONTACT}
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default VerifyCertificatePage;
