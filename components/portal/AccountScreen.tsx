import React, { useState } from 'react';
import { Lang, Profile, ProfileDetails } from './types';
import { changeMyPassword, updateMyProfile } from '../../services/portalApi';
import ProfileFields, { detailsFromProfile } from './ProfileFields';
import { ArrowLeft, Loader2, KeyRound, CheckCircle2, UserRound } from 'lucide-react';

interface Props {
  lang: Lang;
  profile: Profile | null;
  onBack: () => void;
  onProfileUpdated: (p: Profile) => void;
}

const t = {
  en: {
    title: 'Account',
    email: 'Email',
    details: 'Your details',
    detailsHint: 'Your name appears on your certificates. Clinic and phone help the academy confirm your course requests.',
    saveDetails: 'Save details',
    detailsSaved: 'Details saved.',
    nameRequired: 'Please enter your full name.',
    nameReserved: 'That name belongs to a member of the academy staff. Please enter your own full name.',
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
    details: 'Të dhënat tuaja',
    detailsHint: 'Emri juaj shfaqet në certifikata. Klinika dhe telefoni i ndihmojnë akademisë të konfirmojë kërkesat tuaja.',
    saveDetails: 'Ruaj të dhënat',
    detailsSaved: 'Të dhënat u ruajtën.',
    nameRequired: 'Ju lutemi shkruani emrin e plotë.',
    nameReserved: 'Ky emër i përket stafit të akademisë. Ju lutemi shkruani emrin tuaj të plotë.',
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

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const buttonClass =
  'flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors';

const AccountScreen: React.FC<Props> = ({ lang, profile, onBack, onProfileUpdated }) => {
  const s = t[lang];
  const [details, setDetails] = useState<ProfileDetails>(detailsFromProfile(profile));
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [detailsDone, setDetailsDone] = useState(false);

  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const saveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsError('');
    setDetailsDone(false);
    if (!details.full_name.trim()) return setDetailsError(s.nameRequired);
    setSavingDetails(true);
    try {
      const updated = await updateMyProfile(details);
      onProfileUpdated(updated);
      setDetailsDone(true);
    } catch (err: any) {
      const msg = String(err?.message || '');
      setDetailsError(/name_reserved/.test(msg) ? s.nameReserved : msg || 'Error');
    } finally {
      setSavingDetails(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDone(false);
    if (pw.length < 8) return setError(s.tooShort);
    if (pw !== confirm) return setError(s.mismatch);
    setBusy(true);
    const { error: err } = await changeMyPassword(pw);
    setBusy(false);
    if (err) return setError(err.message);
    setPw('');
    setConfirm('');
    setDone(true);
  };

  return (
    <div className="max-w-xl">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest mb-6">
        <ArrowLeft size={15} /> {s.back}
      </button>
      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-8">{s.title}</h1>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.email}</div>
          <p className="text-sm font-bold text-slate-700">{profile?.email}</p>
        </div>

        <form onSubmit={saveDetails} className="space-y-4 border-t border-slate-100 pt-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <UserRound size={13} /> {s.details}
          </p>
          <p className="text-xs text-slate-500">{s.detailsHint}</p>
          <ProfileFields lang={lang} value={details} onChange={(v) => { setDetails(v); setDetailsDone(false); }} />
          {detailsError && <p className="text-xs font-bold text-red-600">{detailsError}</p>}
          {detailsDone && (
            <p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> {s.detailsSaved}
            </p>
          )}
          <button type="submit" disabled={savingDetails} className={buttonClass}>
            {savingDetails && <Loader2 size={13} className="animate-spin" />} {s.saveDetails}
          </button>
        </form>

        <form onSubmit={submit} className="space-y-4 border-t border-slate-100 pt-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <KeyRound size={13} /> {s.changePw}
          </p>
          <input type="password" placeholder={s.newPw} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" className={inputClass} />
          <input type="password" placeholder={s.confirmPw} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" className={inputClass} />
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
          {done && (
            <p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> {s.success}
            </p>
          )}
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy && <Loader2 size={13} className="animate-spin" />} {s.save}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountScreen;
