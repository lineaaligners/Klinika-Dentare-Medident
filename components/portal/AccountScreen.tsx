import React, { useState } from 'react';
import { Lang, Profile } from './types';
import { changeMyPassword } from '../../services/portalApi';
import { ArrowLeft, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';

interface Props {
  lang: Lang;
  profile: Profile | null;
  onBack: () => void;
}

const t = {
  en: {
    title: 'Account',
    email: 'Email',
    changePw: 'Change password',
    newPw: 'New password',
    confirmPw: 'Confirm new password',
    save: 'Update password',
    back: 'Back',
    mismatch: 'Passwords do not match.',
    tooShort: 'Password must be at least 8 characters.',
    success: 'Password updated.',
  },
  sq: {
    title: 'Llogaria',
    email: 'Email',
    changePw: 'Ndrysho fjalëkalimin',
    newPw: 'Fjalëkalim i ri',
    confirmPw: 'Konfirmo fjalëkalimin',
    save: 'Përditëso fjalëkalimin',
    back: 'Kthehu',
    mismatch: 'Fjalëkalimet nuk përputhen.',
    tooShort: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere.',
    success: 'Fjalëkalimi u përditësua.',
  },
};

const AccountScreen: React.FC<Props> = ({ lang, profile, onBack }) => {
  const s = t[lang];
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDone(false);
    if (pw.length < 8) {
      setError(s.tooShort);
      return;
    }
    if (pw !== confirm) {
      setError(s.mismatch);
      return;
    }
    setBusy(true);
    const { error: err } = await changeMyPassword(pw);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setPw('');
    setConfirm('');
    setDone(true);
  };

  return (
    <div className="max-w-md">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest mb-6">
        <ArrowLeft size={15} /> {s.back}
      </button>
      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-8">{s.title}</h1>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
        <div className="mb-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.email}</div>
          <p className="text-sm font-bold text-slate-700">{profile?.email}</p>
        </div>

        <form onSubmit={submit} className="space-y-4 border-t border-slate-100 pt-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <KeyRound size={13} /> {s.changePw}
          </p>
          <input
            type="password"
            placeholder={s.newPw}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <input
            type="password"
            placeholder={s.confirmPw}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
          {done && (
            <p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> {s.success}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            {busy && <Loader2 size={13} className="animate-spin" />} {s.save}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountScreen;
