import React, { useEffect, useState } from 'react';
import { fetchCatalog, requestCourse, updateMyProfile, coverUrl, localized, isProfileComplete } from '../../services/portalApi';
import { CatalogCourse, Lang, Profile, ProfileDetails } from './types';
import ProfileFields, { detailsFromProfile } from './ProfileFields';
import { BookOpen, Loader2, Send, Clock, X, CheckCircle2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const t = {
  en: {
    title: 'Explore courses',
    lessons: 'lessons',
    request: 'Request access',
    pending: 'Requested · awaiting approval',
    declined: 'Your last request was not approved — you can ask again.',
    modalTitle: 'Request access',
    needDetails: 'Please add your practice details — the academy uses them to confirm your request.',
    message: 'Message to the academy (optional)',
    send: 'Send request',
    cancel: 'Cancel',
    sent: "Request sent! You'll get an email as soon as it's approved.",
    alreadyPending: 'You already asked for this course — it is waiting for approval.',
    alreadyAssigned: 'You already have access to this course.',
    notFound: 'This course is no longer available.',
    error: 'Something went wrong. Please try again.',
    nameReserved: 'That name belongs to a member of the academy staff. Please enter your own full name.',
    close: 'Close',
    with: 'with',
  },
  sq: {
    title: 'Eksploroni kurset',
    lessons: 'mësime',
    request: 'Kërko qasje',
    pending: 'Kërkuar · në pritje të miratimit',
    declined: 'Kërkesa e fundit nuk u miratua — mund të kërkoni sërish.',
    modalTitle: 'Kërko qasje',
    needDetails: 'Ju lutemi shtoni të dhënat e praktikës — akademia i përdor për të konfirmuar kërkesën.',
    message: 'Mesazh për akademinë (opsional)',
    send: 'Dërgo kërkesën',
    cancel: 'Anulo',
    sent: 'Kërkesa u dërgua! Do të merrni email sapo të miratohet.',
    alreadyPending: 'E keni kërkuar tashmë këtë kurs — është në pritje.',
    alreadyAssigned: 'Keni tashmë qasje në këtë kurs.',
    notFound: 'Ky kurs nuk është më i disponueshëm.',
    error: 'Diçka shkoi keq. Provoni përsëri.',
    nameReserved: 'Ky emër i përket stafit të akademisë. Ju lutemi shkruani emrin tuaj të plotë.',
    close: 'Mbyll',
    with: 'me',
  },
};

interface Props {
  lang: Lang;
  profile: Profile;
  onProfileUpdated: (p: Profile) => void;
  onAccessChanged: () => void;
}

const CourseCatalog: React.FC<Props> = ({ lang, profile, onProfileUpdated, onAccessChanged }) => {
  const s = t[lang];
  const [courses, setCourses] = useState<CatalogCourse[] | null>(null);
  const [active, setActive] = useState<CatalogCourse | null>(null);

  const load = () => fetchCatalog().then(setCourses).catch(() => setCourses([]));
  useEffect(() => {
    load();
  }, []);

  const available = (courses || []).filter((c) => !c.assigned);
  if (!courses || available.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
        <Compass size={14} /> {s.title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {available.map((c) => {
          const cover = coverUrl(c.cover_path);
          const pending = c.request_status === 'pending';
          return (
            <div key={c.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col">
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                {cover ? (
                  <img src={cover} alt="" className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-black text-slate-900 tracking-tight mb-1">{localized(c.title_en, c.title_sq, lang)}</h3>
                <p className="text-[11px] font-bold text-slate-400 mb-2">
                  {c.lesson_count} {s.lessons}
                  {c.instructor_name ? ` · ${s.with} ${c.instructor_name}` : ''}
                </p>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4 flex-1">{localized(c.description_en, c.description_sq, lang)}</p>
                {c.request_status === 'declined' && <p className="text-[11px] text-amber-700 mb-3">{s.declined}</p>}
                {pending ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600">
                    <Clock size={13} /> {s.pending}
                  </span>
                ) : (
                  <button
                    onClick={() => setActive(c)}
                    className="self-start flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    <Send size={13} /> {s.request}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <RequestModal
            lang={lang}
            course={active}
            profile={profile}
            onProfileUpdated={onProfileUpdated}
            onClose={(changed) => {
              setActive(null);
              if (changed) {
                load();
                onAccessChanged();
              }
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const RequestModal: React.FC<{
  lang: Lang;
  course: CatalogCourse;
  profile: Profile;
  onProfileUpdated: (p: Profile) => void;
  onClose: (changed: boolean) => void;
}> = ({ lang, course, profile, onProfileUpdated, onClose }) => {
  const s = t[lang];
  const needsDetails = !isProfileComplete(profile);
  const [details, setDetails] = useState<ProfileDetails>(detailsFromProfile(profile));
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (needsDetails) {
        const updated = await updateMyProfile(details);
        onProfileUpdated(updated);
      }
      const result = await requestCourse(course.id, message);
      if (result === 'requested') setDone(s.sent);
      else if (result === 'already_pending') setDone(s.alreadyPending);
      else if (result === 'already_assigned') setDone(s.alreadyAssigned);
      else if (result === 'profile_incomplete') setError(s.needDetails);
      else setError(s.notFound);
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (/name_reserved/.test(msg)) setError(s.nameReserved);
      else setError(msg && !/fetch/i.test(msg) ? msg : s.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={() => onClose(Boolean(done))}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">{s.modalTitle}</p>
            <h3 className="text-xl font-black tracking-tight text-slate-900">{localized(course.title_en, course.title_sq, lang)}</h3>
          </div>
          <button onClick={() => onClose(Boolean(done))} aria-label={s.close} className="text-slate-400 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-6">{done}</p>
            <button
              onClick={() => onClose(true)}
              className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              {s.close}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            {needsDetails && (
              <>
                <p className="text-xs text-slate-500">{s.needDetails}</p>
                <ProfileFields lang={lang} value={details} onChange={setDetails} />
              </>
            )}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{s.message}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>
            {error && <p className="text-xs font-bold text-red-600">{error}</p>}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={busy}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                {busy ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} {s.send}
              </button>
              <button type="button" onClick={() => onClose(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {s.cancel}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CourseCatalog;
