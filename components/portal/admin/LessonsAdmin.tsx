import React, { useEffect, useState } from 'react';
import { Lang, PortalLesson, LessonKind, LessonStat } from '../types';
import {
  fetchLessons,
  adminCreateLesson,
  adminUpdateLesson,
  adminDeleteLesson,
  adminReorderLessons,
  adminLessonStats,
  adminUploadFile,
  adminRemoveFile,
  bucketForKind,
  notify,
  localized,
} from '../../../services/portalApi';
import type { NotifyResult } from '../../../services/portalApi';
import {
  Loader2,
  Plus,
  Trash2,
  FileText,
  PlayCircle,
  CalendarClock,
  UploadCloud,
  Pencil,
  ChevronUp,
  ChevronDown,
  Eye,
  CheckCircle2,
  Mail,
  MailCheck,
  Link2,
} from 'lucide-react';

const t = {
  en: {
    lessons: 'Lessons',
    add: 'Add lesson',
    titleEn: 'Title (English)',
    titleSq: 'Title (Albanian)',
    descEn: 'Description (English)',
    descSq: 'Description (Albanian)',
    type: 'Type',
    video: 'Video',
    webinarRecorded: 'Webinar recording',
    webinarLive: 'Live webinar',
    pdf: 'PDF material',
    sourceFile: 'Upload a file',
    sourceLink: 'Use a link',
    chooseFile: 'Choose file',
    replaceFile: 'Replace file',
    currentFile: 'Current file',
    link: 'Link (YouTube, Vimeo, Google Drive…)',
    when: 'Date & time',
    joinUrl: 'Join link (Zoom, Meet, Teams…)',
    duration: 'Length in minutes (optional)',
    saveNew: 'Add lesson',
    saveEdit: 'Save changes',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    moveUp: 'Move up',
    moveDown: 'Move down',
    none: 'No lessons yet.',
    uploading: 'Uploading…',
    saving: 'Saving…',
    needFile: 'Choose a file to upload.',
    needLink: 'Paste the link.',
    needWhen: 'Set the date and time of the webinar.',
    confirmDelete: 'Delete this lesson? Doctors will no longer see it.',
    viewed: (n: number) => `${n} viewed`,
    completed: (n: number) => `${n} completed`,
    invited: 'Invitation emailed',
    invite: 'Email invitation',
    finished: 'Finished',
    inviteSent: (n: number) => `Invitation emailed to ${n} ${n === 1 ? 'doctor' : 'doctors'}.`,
    inviteNoEmail: 'Email is not set up yet, so no invitation went out. You can send it later from this list.',
    inviteNoDoctors: 'No doctors are assigned to this course yet — send the invitation after assigning them.',
    inviteDraft: 'The course is a draft — publish it, then send the invitation.',
    inviteFailed: 'The invitation could not be sent. Try again from this list.',
  },
  sq: {
    lessons: 'Mësimet',
    add: 'Shto mësim',
    titleEn: 'Titulli (Anglisht)',
    titleSq: 'Titulli (Shqip)',
    descEn: 'Përshkrimi (Anglisht)',
    descSq: 'Përshkrimi (Shqip)',
    type: 'Lloji',
    video: 'Video',
    webinarRecorded: 'Regjistrim webinari',
    webinarLive: 'Webinar live',
    pdf: 'Material PDF',
    sourceFile: 'Ngarko skedar',
    sourceLink: 'Përdor link',
    chooseFile: 'Zgjidh skedarin',
    replaceFile: 'Zëvendëso skedarin',
    currentFile: 'Skedari aktual',
    link: 'Linku (YouTube, Vimeo, Google Drive…)',
    when: 'Data & ora',
    joinUrl: 'Linku i bashkimit (Zoom, Meet, Teams…)',
    duration: 'Kohëzgjatja në minuta (opsionale)',
    saveNew: 'Shto mësim',
    saveEdit: 'Ruaj ndryshimet',
    cancel: 'Anulo',
    edit: 'Ndrysho',
    delete: 'Fshi',
    moveUp: 'Lëviz lart',
    moveDown: 'Lëviz poshtë',
    none: 'Ende pa mësime.',
    uploading: 'Duke ngarkuar…',
    saving: 'Duke ruajtur…',
    needFile: 'Zgjidhni një skedar për ta ngarkuar.',
    needLink: 'Vendosni linkun.',
    needWhen: 'Vendosni datën dhe orën e webinarit.',
    confirmDelete: 'Të fshihet ky mësim? Mjekët nuk do ta shohin më.',
    viewed: (n: number) => `${n} e panë`,
    completed: (n: number) => `${n} e përfunduan`,
    invited: 'Ftesa u dërgua',
    invite: 'Dërgo ftesën me email',
    finished: 'Përfundoi',
    inviteSent: (n: number) => `Ftesa iu dërgua ${n} ${n === 1 ? 'mjeku' : 'mjekëve'}.`,
    inviteNoEmail: 'Email-i ende nuk është konfiguruar, ndaj ftesa nuk u dërgua. Mund ta dërgoni më vonë nga kjo listë.',
    inviteNoDoctors: 'Ende asnjë mjek nuk është caktuar në këtë kurs — dërgojeni ftesën pasi t’i caktoni.',
    inviteDraft: 'Kursi është draft — publikojeni, pastaj dërgoni ftesën.',
    inviteFailed: 'Ftesa nuk u dërgua. Provoni sërish nga kjo listë.',
  },
};

type Source = 'file' | 'link';

interface FormState {
  title_en: string;
  title_sq: string;
  description_en: string;
  description_sq: string;
  kind: LessonKind;
  source: Source;
  external_url: string;
  webinar_at: string; // datetime-local value (local time)
  join_url: string;
  duration_min: string;
}

const emptyForm: FormState = {
  title_en: '',
  title_sq: '',
  description_en: '',
  description_sq: '',
  kind: 'video',
  source: 'file',
  external_url: '',
  webinar_at: '',
  join_url: '',
  duration_min: '',
};

const isUploadKind = (k: LessonKind) => k === 'video' || k === 'webinar_recorded' || k === 'pdf';

/** ISO timestamp -> value for <input type="datetime-local"> in the browser's time zone. */
const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** "courseId/1712345678-My_file.mp4" -> "My_file.mp4" */
const fileLabel = (path: string) => (path.split('/').pop() || path).replace(/^\d+-/, '');

const LessonsAdmin: React.FC<{ lang: Lang; courseId: string }> = ({ lang, courseId }) => {
  const s = t[lang];
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';
  const [lessons, setLessons] = useState<PortalLesson[] | null>(null);
  const [stats, setStats] = useState<Record<string, LessonStat>>({});
  const [editing, setEditing] = useState<string | null>(null); // lesson id, or 'new'
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const load = () =>
    Promise.all([fetchLessons(courseId), adminLessonStats(courseId)])
      .then(([ls, st]) => {
        setLessons(ls);
        setStats(st);
      })
      .catch((e) => setError(e.message));

  useEffect(() => {
    setEditing(null);
    setNotice('');
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setStatus('');
    setError('');
  };

  const startNew = () => {
    closeForm();
    setNotice('');
    setEditing('new');
  };

  const startEdit = (l: PortalLesson) => {
    setError('');
    setNotice('');
    setFile(null);
    setForm({
      title_en: l.title_en,
      title_sq: l.title_sq || '',
      description_en: l.description_en || '',
      description_sq: l.description_sq || '',
      kind: l.kind,
      source: l.external_url ? 'link' : 'file',
      external_url: l.external_url || '',
      webinar_at: l.webinar_at ? toLocalInput(l.webinar_at) : '',
      join_url: l.join_url || '',
      duration_min: l.duration_min ? String(l.duration_min) : '',
    });
    setEditing(l.id);
  };

  const kindOptions: { id: LessonKind; label: string }[] = [
    { id: 'video', label: s.video },
    { id: 'webinar_recorded', label: s.webinarRecorded },
    { id: 'webinar_live', label: s.webinarLive },
    { id: 'pdf', label: s.pdf },
  ];

  const inviteMessage = (r: NotifyResult | null): string => {
    if (!r) return s.inviteFailed;
    if (r.skipped === 'unpublished') return s.inviteDraft;
    if (r.skipped === 'no_doctors') return s.inviteNoDoctors;
    if (!r.smtp) return s.inviteNoEmail;
    if (r.sent > 0) return s.inviteSent(r.sent);
    return r.failed > 0 ? s.inviteFailed : '';
  };

  const original = editing && editing !== 'new' ? lessons?.find((l) => l.id === editing) || null : null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setError('');
    setNotice('');
    const upload = isUploadKind(form.kind);
    const live = form.kind === 'webinar_live';
    const useFile = upload && form.source === 'file';
    const useLink = upload && form.source === 'link';
    // An existing upload can stay when it is still a file lesson in the same bucket.
    const keepOld = Boolean(useFile && !file && original?.storage_path && bucketForKind(original.kind) === bucketForKind(form.kind));
    if (useFile && !file && !keepOld) return setError(s.needFile);
    if (useLink && !form.external_url.trim()) return setError(s.needLink);
    if (live && !form.webinar_at) return setError(s.needWhen);

    setBusy(true);
    let uploaded: { bucket: string; path: string } | null = null;
    try {
      let storage_path: string | null = keepOld ? (original?.storage_path as string) : null;
      if (useFile && file) {
        setStatus(s.uploading);
        const bucket = bucketForKind(form.kind);
        const safe = file.name.replace(/[^\w.\-]+/g, '_');
        const path = await adminUploadFile(bucket, `${courseId}/${Date.now()}-${safe}`, file);
        uploaded = { bucket, path };
        storage_path = path;
      }
      setStatus(s.saving);
      const minutes = parseInt(form.duration_min, 10);
      const payload: Partial<PortalLesson> = {
        title_en: form.title_en.trim(),
        title_sq: form.title_sq.trim() || null,
        description_en: form.description_en.trim() || null,
        description_sq: form.description_sq.trim() || null,
        kind: form.kind,
        storage_path,
        external_url: useLink ? form.external_url.trim() : null,
        webinar_at: live ? new Date(form.webinar_at).toISOString() : null,
        join_url: live ? form.join_url.trim() || null : null,
        duration_min: Number.isFinite(minutes) && minutes > 0 ? minutes : null,
      };

      let lessonId: string;
      if (original) {
        await adminUpdateLesson(original.id, payload);
        lessonId = original.id;
        // The previous upload is no longer used -> remove it from storage.
        if (original.storage_path && original.storage_path !== storage_path) {
          adminRemoveFile(bucketForKind(original.kind), original.storage_path).catch(() => {});
        }
      } else {
        const nextSort = lessons && lessons.length ? Math.max(...lessons.map((l) => l.sort_order)) + 1 : 0;
        const created = await adminCreateLesson({ ...payload, course_id: courseId, sort_order: nextSort });
        lessonId = created.id;
      }
      uploaded = null;

      // A new live webinar in the future -> email the doctors of this course.
      if (live && !original && new Date(payload.webinar_at as string).getTime() > Date.now()) {
        const r = await notify('webinar_announced', { lesson_id: lessonId });
        setNotice(inviteMessage(r));
      }
      closeForm();
      await load();
    } catch (err: any) {
      if (uploaded) adminRemoveFile(uploaded.bucket, uploaded.path).catch(() => {});
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
      setStatus('');
    }
  };

  const remove = async (l: PortalLesson) => {
    if (!window.confirm(s.confirmDelete)) return;
    setError('');
    try {
      await adminDeleteLesson(l.id);
      if (l.storage_path) adminRemoveFile(bucketForKind(l.kind), l.storage_path).catch(() => {});
      if (editing === l.id) closeForm();
    } catch (err: any) {
      setError(err.message || 'Error');
    }
    load();
  };

  const move = async (index: number, dir: -1 | 1) => {
    if (!lessons || reordering) return;
    const j = index + dir;
    if (j < 0 || j >= lessons.length) return;
    const next = [...lessons];
    [next[index], next[j]] = [next[j], next[index]];
    setLessons(next);
    setReordering(true);
    try {
      await adminReorderLessons(next);
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setReordering(false);
      load();
    }
  };

  const invite = async (l: PortalLesson) => {
    setInvitingId(l.id);
    setNotice('');
    const r = await notify('webinar_announced', { lesson_id: l.id });
    setInvitingId(null);
    setNotice(inviteMessage(r));
    load();
  };

  const icon = (k: LessonKind) =>
    k === 'pdf' ? <FileText size={15} /> : k === 'webinar_live' ? <CalendarClock size={15} /> : <PlayCircle size={15} />;

  const input = 'w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white';
  const label = 'block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5';

  // Rendered through a function (not a nested component) so typing never remounts the inputs.
  const renderForm = () => {
    const upload = isUploadKind(form.kind);
    const keptFile =
      original?.storage_path && !file && form.source === 'file' && bucketForKind(original.kind) === bucketForKind(form.kind)
        ? fileLabel(original.storage_path)
        : null;
    return (
      <form onSubmit={save} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input placeholder={s.titleEn} required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={input} />
          <input placeholder={s.titleSq} value={form.title_sq} onChange={(e) => setForm({ ...form, title_sq: e.target.value })} className={input} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>{s.type}</label>
            <select
              value={form.kind}
              onChange={(e) => {
                setForm({ ...form, kind: e.target.value as LessonKind });
                setFile(null);
              }}
              className={input}
            >
              {kindOptions.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
          {form.kind !== 'pdf' && (
            <div>
              <label className={label}>{s.duration}</label>
              <input
                type="number"
                min={1}
                max={1440}
                value={form.duration_min}
                onChange={(e) => setForm({ ...form, duration_min: e.target.value })}
                className={input}
              />
            </div>
          )}
        </div>

        {upload && (
          <div className="space-y-3">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5" role="radiogroup">
              {(['file', 'link'] as Source[]).map((src) => (
                <button
                  key={src}
                  type="button"
                  role="radio"
                  aria-checked={form.source === src}
                  onClick={() => setForm({ ...form, source: src })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    form.source === src ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {src === 'file' ? <UploadCloud size={13} /> : <Link2 size={13} />} {src === 'file' ? s.sourceFile : s.sourceLink}
                </button>
              ))}
            </div>

            {form.source === 'file' ? (
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {keptFile && (
                  <span className="text-xs text-slate-500">
                    {s.currentFile}: <strong className="text-slate-700 break-all">{keptFile}</strong>
                  </span>
                )}
                <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 rounded-lg px-3 py-2 hover:border-blue-400">
                  <UploadCloud size={15} /> {keptFile ? s.replaceFile : s.chooseFile}
                  <input
                    type="file"
                    accept={form.kind === 'pdf' ? '.pdf,application/pdf' : 'video/*'}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </label>
                {file && <span className="text-xs text-slate-500 truncate max-w-[240px]">{file.name}</span>}
              </div>
            ) : (
              <input placeholder={s.link} value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} className={input} />
            )}
          </div>
        )}

        {form.kind === 'webinar_live' && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>{s.when}</label>
              <input type="datetime-local" value={form.webinar_at} onChange={(e) => setForm({ ...form, webinar_at: e.target.value })} className={input} />
            </div>
            <div>
              <label className={label}>{s.joinUrl}</label>
              <input placeholder="https://…" value={form.join_url} onChange={(e) => setForm({ ...form, join_url: e.target.value })} className={input} />
            </div>
          </div>
        )}

        <textarea placeholder={s.descEn} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={2} className={input} />
        <textarea placeholder={s.descSq} value={form.description_sq} onChange={(e) => setForm({ ...form, description_sq: e.target.value })} rows={2} className={input} />

        {error && <p className="text-xs font-bold text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            {busy && <Loader2 size={13} className="animate-spin" />} {status || (original ? s.saveEdit : s.saveNew)}
          </button>
          <button type="button" onClick={closeForm} disabled={busy} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700">
            {s.cancel}
          </button>
        </div>
      </form>
    );
  };

  const now = Date.now();

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{s.lessons}</h3>
        {!editing && (
          <button onClick={startNew} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
            <Plus size={14} /> {s.add}
          </button>
        )}
      </div>

      {notice && <p className="text-xs font-bold text-slate-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">{notice}</p>}
      {error && !editing && <p className="text-xs font-bold text-red-600 mb-3">{error}</p>}

      {editing === 'new' && <div className="mb-5">{renderForm()}</div>}

      {!lessons ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        </div>
      ) : lessons.length === 0 ? (
        editing !== 'new' && <p className="text-sm text-slate-400">{s.none}</p>
      ) : (
        <ul className="space-y-2">
          {lessons.map((l, i) => {
            if (editing === l.id) return <li key={l.id}>{renderForm()}</li>;
            const st = stats[l.id];
            const isLive = l.kind === 'webinar_live' && Boolean(l.webinar_at);
            const future = isLive && new Date(l.webinar_at as string).getTime() > now;
            return (
              <li key={l.id} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-3 sm:px-4 py-3">
                <div className="flex flex-col -my-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0 || reordering || Boolean(editing)}
                    aria-label={s.moveUp}
                    title={s.moveUp}
                    className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === lessons.length - 1 || reordering || Boolean(editing)}
                    aria-label={s.moveDown}
                    title={s.moveDown}
                    className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                    <ChevronDown size={15} />
                  </button>
                </div>
                <span className="text-slate-400 mt-0.5">{icon(l.kind)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 break-words">{localized(l.title_en, l.title_sq, lang)}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    {isLive && (
                      <span className="flex items-center gap-1">
                        {new Date(l.webinar_at as string).toLocaleString(locale, {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {!future && <span className="text-slate-400">· {s.finished}</span>}
                      </span>
                    )}
                    {st && (
                      <>
                        <span className="flex items-center gap-1 tabular-nums">
                          <Eye size={12} className="text-slate-400" /> {s.viewed(st.viewers)}
                        </span>
                        <span className="flex items-center gap-1 tabular-nums">
                          <CheckCircle2 size={12} className="text-slate-400" /> {s.completed(st.completions)}
                        </span>
                      </>
                    )}
                    {isLive && future && l.announced_at && (
                      <span className="flex items-center gap-1 text-green-700 font-bold">
                        <MailCheck size={12} /> {s.invited}
                      </span>
                    )}
                    {isLive && future && !l.announced_at && (
                      <button
                        onClick={() => invite(l)}
                        disabled={invitingId === l.id}
                        className="flex items-center gap-1 font-black uppercase tracking-widest text-[10px] text-blue-600 hover:text-blue-700 disabled:opacity-50"
                      >
                        {invitingId === l.id ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />} {s.invite}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => startEdit(l)}
                    disabled={Boolean(editing)}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-40"
                  >
                    <Pencil size={12} /> <span className="hidden sm:inline">{s.edit}</span>
                  </button>
                  <button onClick={() => remove(l)} className="text-red-400 hover:text-red-600" aria-label={s.delete} title={s.delete}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LessonsAdmin;
