import React, { useEffect, useState } from 'react';
import { Lang, Profile } from '../types';
import {
  adminListDoctors,
  adminCreateDoctor,
  adminDeleteDoctor,
  adminResetDoctorPassword,
} from '../../../services/portalApi';
import { Loader2, UserPlus, Trash2, KeyRound, Search, Building2, Phone, Mail } from 'lucide-react';

const t = {
  en: {
    title: 'Doctors',
    joined: 'Joined',
    lastActive: 'Last active',
    never: 'not yet',
    add: 'Add doctor',
    fullName: 'Full name',
    email: 'Email',
    password: 'Temporary password',
    create: 'Create account',
    none: 'No doctors yet. They appear here as soon as they create an account.',
    noMatch: 'No doctor matches your search.',
    search: 'Search name, email, clinic or city',
    delete: 'Delete',
    reset: 'Reset password',
    confirmDelete: 'Delete this doctor account? They will lose access immediately.',
    newPw: 'New password',
    save: 'Save',
    cancel: 'Cancel',
    hintPw: 'Doctors can also sign up by themselves. Share this password with the doctor — they can change it later.',
    pwSaved: 'Password changed. Share it with the doctor.',
    noDetails: 'No practice details yet',
  },
  sq: {
    title: 'Mjekët',
    joined: 'U regjistrua',
    lastActive: 'Aktiv së fundi',
    never: 'ende jo',
    add: 'Shto mjek',
    fullName: 'Emri i plotë',
    email: 'Email',
    password: 'Fjalëkalim i përkohshëm',
    create: 'Krijo llogari',
    none: 'Ende pa mjekë. Shfaqen këtu sapo krijojnë llogari.',
    noMatch: 'Asnjë mjek nuk përputhet me kërkimin.',
    search: 'Kërko emër, email, klinikë ose qytet',
    delete: 'Fshi',
    reset: 'Rivendos fjalëkalimin',
    confirmDelete: 'Të fshihet kjo llogari? Mjeku humbet qasjen menjëherë.',
    newPw: 'Fjalëkalim i ri',
    save: 'Ruaj',
    cancel: 'Anulo',
    hintPw: 'Mjekët mund të regjistrohen edhe vetë. Ndajeni këtë fjalëkalim me mjekun — mund ta ndryshojë më vonë.',
    pwSaved: 'Fjalëkalimi u ndryshua. Ndajeni me mjekun.',
    noDetails: 'Ende pa të dhëna të praktikës',
  },
};

const DoctorsAdmin: React.FC<{ lang: Lang }> = ({ lang }) => {
  const s = t[lang];
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';
  const [doctors, setDoctors] = useState<Profile[] | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [resetId, setResetId] = useState<string | null>(null);
  const [resetPw, setResetPw] = useState('');

  const load = () => adminListDoctors().then(setDoctors).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : s.never);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await adminCreateDoctor(form.email.trim(), form.password, form.full_name.trim());
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
    setNotice('');
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
    setNotice('');
    try {
      await adminResetDoctorPassword(id, resetPw);
      setResetId(null);
      setResetPw('');
      setNotice(s.pwSaved);
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

  const q = query.trim().toLowerCase();
  const shown = q
    ? doctors.filter((d) =>
        [d.full_name, d.email, d.clinic, d.city, d.country, d.phone].some((v) => (v || '').toLowerCase().includes(q)),
      )
    : doctors;

  const label = 'block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5';
  const input = 'w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-black text-slate-900">
          {s.title} <span className="text-slate-400 font-bold text-base tabular-nums">· {doctors.length}</span>
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          <UserPlus size={14} /> {s.add}
        </button>
      </div>

      {error && <p className="text-xs font-bold text-red-600 mb-4">{error}</p>}
      {notice && <p className="text-xs font-bold text-green-700 mb-4">{notice}</p>}

      {showForm && (
        <form onSubmit={create} className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label className={label}>{s.fullName}</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={input} />
          </div>
          <div>
            <label className={label}>{s.email}</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
          </div>
          <div>
            <label className={label}>{s.password}</label>
            <input required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} />
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

      {doctors.length > 0 && (
        <div className="relative mb-4 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={s.search}
            aria-label={s.search}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white"
          />
        </div>
      )}

      {doctors.length === 0 ? (
        <p className="text-slate-500">{s.none}</p>
      ) : shown.length === 0 ? (
        <p className="text-slate-500">{s.noMatch}</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
          {shown.map((d) => {
            const practice = [d.clinic, d.city, d.country].filter(Boolean).join(', ');
            return (
              <div key={d.id} className="p-4 flex flex-wrap items-start gap-3 justify-between">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{d.full_name || '—'}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {d.email && (
                      <a href={`mailto:${d.email}`} className="flex items-center gap-1 hover:text-blue-600 break-all">
                        <Mail size={12} className="flex-shrink-0" /> {d.email}
                      </a>
                    )}
                    {d.phone && (
                      <a href={`tel:${d.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                        <Phone size={12} /> {d.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      <Building2 size={12} /> {practice || <span className="text-slate-400 italic">{s.noDetails}</span>}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    {s.joined} {fmt(d.created_at)} · {s.lastActive} {fmt(d.last_seen_at)}
                  </p>
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
                          setNotice('');
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorsAdmin;
