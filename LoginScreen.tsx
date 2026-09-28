import React, { useState } from 'react';
import { signIn, signUp } from '../../services/portalApi';
import { Lang } from './types';
import { Loader2, GraduationCap, ArrowLeft, Globe2, Lock, UserPlus, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  onExit: () => void;
}

type Mode = 'signin' | 'signup';

const t = {
  en: {
    heading: 'Doctor Portal',
    subSignIn: 'Sign in to access your assigned courses, webinars and materials.',
    subSignUp: 'Create your account. The academy will then assign your courses.',
    fullName: 'Full name',
    email: 'Email',
    password: 'Password',
    passwordHint: 'At least 8 characters',
    signIn: 'Sign in',
    createAccount: 'Create account',
    backToSite: 'Back to site',
    invalid: 'Incorrect email or password.',
    unconfirmed: 'Please confirm your email first — check your inbox.',
    tooShort: 'Password must be at least 8 characters.',
    nameRequired: 'Please enter your full name.',
    alreadyRegistered: 'An account with this email already exists — sign in instead.',
    genericError: 'Something went wrong. Please try again.',
    checkEmail: 'Account created! Check your email to confirm it, then sign in.',
    newHere: 'New doctor?',
    createOne: 'Create an account',
    haveAccount: 'Already have an account?',
    signInLink: 'Sign in',
  },
  sq: {
    heading: 'Portali i Mjekëve',
    subSignIn: 'Kyçuni për të hyrë në kurset, webinaret dhe materialet tuaja.',
    subSignUp: 'Krijoni llogarinë tuaj. Akademia më pas do t’ju caktojë kurset.',
    fullName: 'Emri i plotë',
    email: 'Email',
    password: 'Fjalëkalimi',
    passwordHint: 'Të paktën 8 karaktere',
    signIn: 'Kyçu',
    createAccount: 'Krijo llogari',
    backToSite: 'Kthehu në faqe',
    invalid: 'Email ose fjalëkalim i pasaktë.',
    unconfirmed: 'Ju lutemi konfirmoni email-in së pari — kontrolloni inbox-in.',
    tooShort: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere.',
    nameRequired: 'Ju lutemi shkruani emrin e plotë.',
    alreadyRegistered: 'Ekziston tashmë një llogari me këtë email — kyçuni.',
    genericError: 'Diçka shkoi keq. Provoni përsëri.',
    checkEmail: 'Llogaria u krijua! Kontrolloni email-in për ta konfirmuar, pastaj kyçuni.',
    newHere: 'Mjek i ri?',
    createOne: 'Krijo një llogari',
    haveAccount: 'Keni tashmë llogari?',
    signInLink: 'Kyçu',
  },
};

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm';
const labelClass = 'block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2';

const LoginScreen: React.FC<Props> = ({ lang, onToggleLang, onExit }) => {
  const s = t[lang];
  const [mode, setMode] = useState<Mode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const isSignup = mode === 'signup';

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setNotice('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (isSignup) {
      if (!fullName.trim()) {
        setError(s.nameRequired);
        return;
      }
      if (password.length < 8) {
        setError(s.tooShort);
        return;
      }
      setBusy(true);
      const { data, error: err } = await signUp(email, password, fullName);
      setBusy(false);
      if (err) {
        setError(/already/i.test(err.message) ? s.alreadyRegistered : s.genericError);
        return;
      }
      // With email confirmation on, Supabase reports an existing address as a
      // "success" whose user has no identities (to avoid leaking who's registered).
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setError(s.alreadyRegistered);
        return;
      }
      if (!data.session) {
        // Email confirmation is on — the doctor confirms, then signs in.
        setNotice(s.checkEmail);
        setMode('signin');
        setPassword('');
      }
      // With a session, DoctorPortal's auth listener takes over automatically.
      return;
    }

    setBusy(true);
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) setError(/confirm/i.test(err.message) ? s.unconfirmed : s.invalid);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent" />
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 h-16">
        <button onClick={onExit} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest">
          <ArrowLeft size={16} /> {s.backToSite}
        </button>
        <button onClick={onToggleLang} className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
          <Globe2 size={14} /> {lang === 'en' ? 'SQ' : 'EN'}
        </button>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-5 shadow-xl shadow-blue-600/30">
              <GraduationCap size={26} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              MEDIDENT<span className="text-blue-600">.</span>ACADEMY
            </h1>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">{s.heading}</p>
            <p className="text-sm text-slate-500 mt-4">{isSignup ? s.subSignUp : s.subSignIn}</p>
          </div>

          <form onSubmit={submit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            {isSignup && (
              <div>
                <label className={labelClass}>{s.fullName}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
            )}
            <div>
              <label className={labelClass}>{s.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{s.password}</label>
              <input
                type="password"
                required
                minLength={isSignup ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                className={inputClass}
              />
              {isSignup && <p className="text-[11px] text-slate-400 mt-1.5">{s.passwordHint}</p>}
            </div>

            {error && <p className="text-xs font-bold text-red-600">{error}</p>}
            {notice && (
              <p className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
                <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" /> {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : isSignup ? <UserPlus size={14} /> : <Lock size={14} />}{' '}
              {isSignup ? s.createAccount : s.signIn}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            {isSignup ? s.haveAccount : s.newHere}{' '}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
              className="font-black text-blue-600 hover:text-blue-700"
            >
              {isSignup ? s.signInLink : s.createOne}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;
