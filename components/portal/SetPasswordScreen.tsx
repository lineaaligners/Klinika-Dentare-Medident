import React, { useState } from 'react';
import { changeMyPassword } from '../../services/portalApi';
import { Lang } from './types';
import { Loader2, KeyRound, CheckCircle2, GraduationCap } from 'lucide-react';

interface Props {
  lang: Lang;
  onDone: () => void;
}

const t = {
  en: {
    title: 'Set a new password',
    sub: 'You opened a password-reset link. Choose a new password for your account.',
    newPw: 'New password',
    confirmPw: 'Confirm new password',
    save: 'Save new password',
    skip: 'Skip for now',
    tooShort: 'Password must be at least 8 characters.',
    mismatch: 'Passwords do not match.',
    success: 'Password updated. Taking you to your courses…',
  },
  sq: {
    title: 'Vendosni fjalëkalim të ri',
    sub: 'Hapët një link për rivendosjen e fjalëkalimit. Zgjidhni një fjalëkalim të ri.',
    newPw: 'Fjalëkalim i ri',
    confirmPw: 'Konfirmo fjalëkalimin',
    save: 'Ruaj fjalëkalimin',
    skip: 'Më vonë',
    tooShort: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere.',
    mismatch: 'Fjalëkalimet nuk përputhen.',
    success: 'Fjalëkalimi u përditësua. Po ju dërgojmë te kurset…',
  },
};

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm';

const SetPasswordScreen: React.FC<Props> = ({ lang, onDone }) => {
  const s = t[lang];
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (pw.length < 8) return setError(s.tooShort);
    if (pw !== confirm) return setError(s.mismatch);
    setBusy(true);
    const { error: err } = await changeMyPassword(pw);
    setBusy(false);
    if (err) return setError(err.message);
    setDone(true);
    setTimeout(onDone, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-5 shadow-xl shadow-blue-600/30">
            <GraduationCap size={26} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">{s.title}</h1>
          <p className="text-sm text-slate-500 mt-3">{s.sub}</p>
        </div>
        <form onSubmit={submit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <input type="password" placeholder={s.newPw} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" className={inputClass} />
          <input type="password" placeholder={s.confirmPw} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" className={inputClass} />
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
          {done && (
            <p className="text-xs font-bold text-green-700 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> {s.success}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || done}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={14} />} {s.save}
          </button>
          <button type="button" onClick={onDone} className="w-full text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
            {s.skip}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordScreen;
