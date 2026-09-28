import React, { useEffect, useState } from 'react';
import { Lang, Profile } from '../types';
import {
  adminListDoctors,
  adminCreateDoctor,
  adminDeleteDoctor,
  adminResetDoctorPassword,
} from '../../../services/portalApi';
import { Loader2, UserPlus, Trash2, KeyRound } from 'lucide-react';

const t = {
  en: {
    title: 'Doctors',
    joined: 'Joined',
    add: 'Add doctor',
    fullName: 'Full name',
    email: 'Email',
    password: 'Temporary password',
    create: 'Create account',
    none: 'No doctors yet.',
    delete: 'Delete',
    reset: 'Reset password',
    confirmDelete: 'Delete this doctor account? They will lose access immediately.',
    newPw: 'New password',
    save: 'Save',
    cancel: 'Cancel',
    hintPw: 'Share this password with the doctor — they can change it later.',
  },
  sq: {
    title: 'Mjekët',
    joined: 'U regjistrua',
    add: 'Shto mjek',
    fullName: 'Emri i plotë',
    email: 'Email',
    password: 'Fjalëkalim i përkohshëm',
    create: 'Krijo llogari',
    none: 'Ende pa mjekë.',
    delete: 'Fshi',
    reset: 'Rivendos fjalëkalimin',
    confirmDelete: 'Të fshihet kjo llogari? Mjeku humbet qasjen menjëherë.',
    newPw: 'Fjalëkalim i ri',
    save: 'Ruaj',
    cancel: 'Anulo',
    hintPw: 'Ndajeni këtë fjalëkalim me mjekun — mund ta ndryshojë më vonë.',
  },
};

const DoctorsAdmin: React.FC<{ lang: Lang }> = ({ lang }) => {
  const s = t[lang];
  const [doctors, setDoctors] = useState<Profile[] | null>(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [resetId, setResetId] = useState<string | null>(null);
  const [resetPw, setResetPw] = useState('');

  const load = () => adminListDoctors().then(setDoctors).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminCreateDoctor(form.email, form.password, form.full_name);
      setForm({ full_name: '', email: '', password: '' });
      setShowForm(false);
      await load();
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(s.confirmDelete)) return;
    setError('');
    try {
      await adminDeleteDoctor(id);
      await load();
    } catch (err: any) {
      setError(err.message || 'Error');
    }
  };

  const doReset = async (id: string) => {
    setBusy(true);
    setError('');
    try {
      await adminResetDoctorPassword(id, resetPw);
      setResetId(null);
      setResetPw('');
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  if (!doctors)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-900">{s.title}</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          <UserPlus size={14} /> {s.add}
        </button>
      </div>

      {error && <p className="text-xs font-bold text-red-600 mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={create} className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.fullName}</label>
            <input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.email}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.password}</label>
            <input
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              {busy && <Loader2 size={13} className="animate-spin" />} {s.create}
            </button>
            <span className="text-[11px] text-slate-400">{s.hintPw}</span>
          </div>
        </form>
      )}

      {doctors.length === 0 ? (
        <p className="text-slate-500">{s.none}</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
          {doctors.map((d) => (
            <div key={d.id} className="p-4 flex flex-wrap items-center gap-3 justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">{d.full_name || '—'}</p>
                <p className="text-xs text-slate-400">{d.email}</p>
                {d.created_at && (
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    {s.joined} {new Date(d.created_at).toLocaleDateString(lang === 'sq' ? 'sq-AL' : 'en-GB')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {resetId === d.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={resetPw}
                      onChange={(e) => setResetPw(e.target.value)}
                      placeholder={s.newPw}
                      minLength={8}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => doReset(d.id)}
                      disabled={busy || resetPw.length < 8}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-600 disabled:opacity-40"
                    >
                      {s.save}
                    </button>
                    <button
                      onClick={() => {
                        setResetId(null);
                        setResetPw('');
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                      {s.cancel}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setResetId(d.id);
                        setResetPw('');
                      }}
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
                    >
                      <KeyRound size={13} /> {s.reset}
                    </button>
                    <button
                      onClick={() => remove(d.id)}
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={13} /> {s.delete}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsAdmin;
