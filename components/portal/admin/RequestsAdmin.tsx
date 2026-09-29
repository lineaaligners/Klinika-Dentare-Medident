import React, { useEffect, useState } from 'react';
import { CourseRequest, Lang } from '../types';
import { adminFetchRequests, adminDecideRequest, localized } from '../../../services/portalApi';
import { Loader2, Check, X, Inbox, Phone, Building2, Mail } from 'lucide-react';

const t = {
  en: {
    pending: 'Waiting for your decision',
    none: 'No pending requests.',
    history: 'Recent decisions',
    approve: 'Approve',
    decline: 'Decline',
    wants: 'wants access to',
    joined: 'Joined',
    requested: 'Requested',
    approved: 'Approved',
    declined: 'Declined',
    emailNote: 'The doctor gets an email either way (once email is set up).',
    error: 'Could not save the decision.',
  },
  sq: {
    pending: 'Në pritje të vendimit tuaj',
    none: 'Asnjë kërkesë në pritje.',
    history: 'Vendimet e fundit',
    approve: 'Mirato',
    decline: 'Refuzo',
    wants: 'kërkon qasje në',
    joined: 'U regjistrua',
    requested: 'Kërkuar',
    approved: 'Miratuar',
    declined: 'Refuzuar',
    emailNote: 'Mjeku merr email në të dyja rastet (pasi të konfigurohet email-i).',
    error: 'Vendimi nuk u ruajt.',
  },
};

const RequestsAdmin: React.FC<{ lang: Lang; onChanged: () => void }> = ({ lang, onChanged }) => {
  const s = t[lang];
  const [requests, setRequests] = useState<CourseRequest[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';
  const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

  const load = () =>
    adminFetchRequests()
      .then((r) => {
        setRequests(r);
        setError('');
      })
      .catch((e) => setError(e.message || 'Error'));
  useEffect(() => {
    load();
  }, []);

  const decide = async (r: CourseRequest, approve: boolean) => {
    setBusyId(r.id);
    setError('');
    try {
      await adminDecideRequest(r.id, approve);
      await load();
      onChanged();
    } catch {
      setError(s.error);
    } finally {
      setBusyId(null);
    }
  };

  if (!requests && error) return <p className="text-sm font-bold text-red-600">{error}</p>;
  if (!requests)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );

  const pending = requests.filter((r) => r.status === 'pending');
  const decided = requests.filter((r) => r.status !== 'pending').slice(0, 30);

  return (
    <div>
      <h2 className="text-xl font-black text-slate-900 mb-1">{s.pending}</h2>
      <p className="text-xs text-slate-400 mb-6">{s.emailNote}</p>
      {error && <p className="text-xs font-bold text-red-600 mb-4">{error}</p>}

      {pending.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
          <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          {s.none}
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">{r.doctor?.full_name || r.doctor?.email}</strong> {s.wants}{' '}
                    <strong className="text-blue-700">{localized(r.course?.title_en, r.course?.title_sq, lang)}</strong>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {r.doctor?.email && (
                      <a href={`mailto:${r.doctor.email}`} className="flex items-center gap-1 hover:text-blue-600">
                        <Mail size={12} /> {r.doctor.email}
                      </a>
                    )}
                    {(r.doctor?.clinic || r.doctor?.city) && (
                      <span className="flex items-center gap-1">
                        <Building2 size={12} /> {[r.doctor?.clinic, r.doctor?.city, r.doctor?.country].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {r.doctor?.phone && (
                      <a href={`tel:${r.doctor.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                        <Phone size={12} /> {r.doctor.phone}
                      </a>
                    )}
                  </div>
                  {r.message && <p className="mt-3 text-sm text-slate-600 italic whitespace-pre-wrap">“{r.message}”</p>}
                  <p className="mt-2 text-[10px] text-slate-400">
                    {s.requested} {fmt(r.created_at)} · {s.joined} {fmt(r.doctor?.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decide(r, true)}
                    disabled={busyId === r.id}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    {busyId === r.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} {s.approve}
                  </button>
                  <button
                    onClick={() => decide(r, false)}
                    disabled={busyId === r.id}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-60 text-slate-500 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    <X size={13} /> {s.decline}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {decided.length > 0 && (
        <div className="mt-10">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">{s.history}</h3>
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {decided.map((r) => (
              <div key={r.id} className="px-4 py-3 flex flex-wrap items-center gap-3 justify-between text-sm">
                <span className="text-slate-700">
                  <strong>{r.doctor?.full_name || r.doctor?.email}</strong> → {localized(r.course?.title_en, r.course?.title_sq, lang)}
                </span>
                <span className="flex items-center gap-3">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                      r.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {r.status === 'approved' ? s.approved : s.declined}
                  </span>
                  <span className="text-[10px] text-slate-400">{fmt(r.decided_at)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsAdmin;
