import React, { useEffect, useState } from 'react';
import { Lang, PortalLesson, LessonKind } from '../types';
import {
  fetchLessons,
  adminCreateLesson,
  adminDeleteLesson,
  adminUploadFile,
  bucketForKind,
  localized,
} from '../../../services/portalApi';
import { Loader2, Plus, Trash2, FileText, PlayCircle, CalendarClock, UploadCloud } from 'lucide-react';

const t = {
  en: {
    lessons: 'Lessons',
    add: 'Add lesson',
    titleEn: 'Title (English)',
    titleSq: 'Title (Albanian)',
    descEn: 'Description (English)',
    descSq: 'Description (Albanian)',
    type: 'Type',
    video: 'Video (upload)',
    webinarRecorded: 'Webinar recording (upload)',
    webinarLive: 'Live webinar',
    pdf: 'PDF material',
    chooseFile: 'Choose file',
    externalUrl: 'or paste a link (YouTube / Vimeo / Zoom)',
    when: 'Date & time',
    joinUrl: 'Join link',
    save: 'Add lesson',
    cancel: 'Cancel',
    none: 'No lessons yet.',
    uploading: 'Uploading…',
    needFileOrUrl: 'Upload a file or paste a link.',
    confirmDelete: 'Delete this lesson?',
  },
  sq: {
    lessons: 'Mësimet',
    add: 'Shto mësim',
    titleEn: 'Titulli (Anglisht)',
    titleSq: 'Titulli (Shqip)',
    descEn: 'Përshkrimi (Anglisht)',
    descSq: 'Përshkrimi (Shqip)',
    type: 'Lloji',
    video: 'Video (ngarko)',
    webinarRecorded: 'Regjistrim webinari (ngarko)',
    webinarLive: 'Webinar live',
    pdf: 'Material PDF',
    chooseFile: 'Zgjidh skedarin',
    externalUrl: 'ose vendos një link (YouTube / Vimeo / Zoom)',
    when: 'Data & ora',
    joinUrl: 'Linku i bashkimit',
    save: 'Shto mësim',
    cancel: 'Anulo',
    none: 'Ende pa mësime.',
    uploading: 'Duke ngarkuar…',
    needFileOrUrl: 'Ngarko një skedar ose vendos një link.',
    confirmDelete: 'Të fshihet ky mësim?',
  },
};

const emptyForm = {
  title_en: '',
  title_sq: '',
  description_en: '',
  description_sq: '',
  kind: 'video' as LessonKind,
  external_url: '',
  webinar_at: '',
  join_url: '',
};

const LessonsAdmin: React.FC<{ lang: Lang; courseId: string }> = ({ lang, courseId }) => {
  const s = t[lang];
  const [lessons, setLessons] = useState<PortalLesson[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const load = () => fetchLessons(courseId).then(setLessons).catch((e) => setError(e.message));
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const reset = () => {
    setForm(emptyForm);
    setFile(null);
    setShowForm(false);
    setStatus('');
    setError('');
  };

  const kindOptions: { id: LessonKind; label: string }[] = [
    { id: 'video', label: s.video },
    { id: 'webinar_recorded', label: s.webinarRecorded },
    { id: 'webinar_live', label: s.webinarLive },
    { id: 'pdf', label: s.pdf },
  ];

  const isUploadKind = form.kind === 'video' || form.kind === 'webinar_recorded' || form.kind === 'pdf';

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isUploadKind && !file && !form.external_url) {
      setError(s.needFileOrUrl);
      return;
    }
    setBusy(true);
    try {
      let storage_path: string | null = null;
      if (isUploadKind && file) {
        setStatus(s.uploading);
        const bucket = bucketForKind(form.kind);
        const safe = file.name.replace(/[^\w.\-]+/g, '_');
        const path = `${courseId}/${Date.now()}-${safe}`;
        storage_path = await adminUploadFile(bucket, path, file);
      }
      await adminCreateLesson({
        course_id: courseId,
        title_en: form.title_en,
        title_sq: form.title_sq || null,
        description_en: form.description_en || null,
        description_sq: form.description_sq || null,
        kind: form.kind,
        storage_path,
        external_url: form.external_url || null,
        webinar_at: form.kind === 'webinar_live' && form.webinar_at ? new Date(form.webinar_at).toISOString() : null,
        join_url: form.kind === 'webinar_live' ? form.join_url || null : null,
        sort_order: lessons?.length ?? 0,
      });
      reset();
      await load();
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
      setStatus('');
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(s.confirmDelete)) return;
    await adminDeleteLesson(id);
    load();
  };

  const icon = (k: LessonKind) =>
    k === 'pdf' ? <FileText size={15} /> : k === 'webinar_live' ? <CalendarClock size={15} /> : <PlayCircle size={15} />;

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{s.lessons}</h3>
        <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
          <Plus size={14} /> {s.add}
        </button>
      </div>

      {error && <p className="text-xs font-bold text-red-600 mb-3">{error}</p>}

      {showForm && (
        <form onSubmit={add} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder={s.titleEn}
              required
              value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
            <input
              placeholder={s.titleSq}
              value={form.title_sq}
              onChange={(e) => setForm({ ...form, title_sq: e.target.value })}
              className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.type}</label>
            <select
              value={form.kind}
              onChange={(e) => {
                setForm({ ...form, kind: e.target.value as LessonKind });
                setFile(null);
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white"
            >
              {kindOptions.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>

          {isUploadKind && (
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                <span className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 hover:border-blue-400">
                  <UploadCloud size={15} /> {s.chooseFile}
                </span>
                <input
                  type="file"
                  accept={form.kind === 'pdf' ? '.pdf,application/pdf' : 'video/*'}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                {file && <span className="text-xs text-slate-500 truncate max-w-[220px]">{file.name}</span>}
              </label>
              <input
                placeholder={s.externalUrl}
                value={form.external_url}
                onChange={(e) => setForm({ ...form, external_url: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
              />
            </div>
          )}

          {form.kind === 'webinar_live' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.when}</label>
                <input
                  type="datetime-local"
                  value={form.webinar_at}
                  onChange={(e) => setForm({ ...form, webinar_at: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.joinUrl}</label>
                <input
                  placeholder="https://…"
                  value={form.join_url}
                  onChange={(e) => setForm({ ...form, join_url: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <textarea
            placeholder={s.descEn}
            value={form.description_en}
            onChange={(e) => setForm({ ...form, description_en: e.target.value })}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
          />
          <textarea
            placeholder={s.descSq}
            value={form.description_sq}
            onChange={(e) => setForm({ ...form, description_sq: e.target.value })}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              {busy && <Loader2 size={13} className="animate-spin" />} {status || s.save}
            </button>
            <button type="button" onClick={reset} className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {s.cancel}
            </button>
          </div>
        </form>
      )}

      {!lessons ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-sm text-slate-400">{s.none}</p>
      ) : (
        <ul className="space-y-2">
          {lessons.map((l) => (
            <li key={l.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
              <span className="text-slate-400">{icon(l.kind)}</span>
              <span className="flex-1 text-sm font-bold text-slate-700">{localized(l.title_en, l.title_sq, lang)}</span>
              <button onClick={() => remove(l.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LessonsAdmin;
