import React, { useEffect, useState } from 'react';
import { Lang, PortalCourse, BUCKET_COVERS } from '../types';
import {
  adminFetchCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminUploadFile,
  coverUrl,
  localized,
} from '../../../services/portalApi';
import LessonsAdmin from './LessonsAdmin';
import QuizAdmin from './QuizAdmin';
import { Loader2, Plus, Trash2, ArrowLeft, ImagePlus, BookOpen } from 'lucide-react';

const t = {
  en: {
    title: 'Courses & Content',
    newCourse: 'New course',
    titleEn: 'Title (English)',
    titleSq: 'Title (Albanian)',
    descEn: 'Description (English)',
    descSq: 'Description (Albanian)',
    instructor: 'Instructor (printed on the certificate)',
    passMark: 'Quiz pass mark (%)',
    cpd: 'CPD hours (optional)',
    cpdHint: 'Printed on the certificate, e.g. 8 or 7.5.',
    published: 'Published — shown in the course catalog and to assigned doctors',
    cover: 'Cover image',
    changeCover: 'Choose image',
    save: 'Save course',
    back: 'All courses',
    delete: 'Delete',
    draft: 'Draft',
    none: 'No courses yet. Create your first one.',
    confirmDelete: 'Delete this course and all its lessons? This cannot be undone.',
    saving: 'Saving…',
    saved: 'Saved',
  },
  sq: {
    title: 'Kurset & Përmbajtja',
    newCourse: 'Kurs i ri',
    titleEn: 'Titulli (Anglisht)',
    titleSq: 'Titulli (Shqip)',
    descEn: 'Përshkrimi (Anglisht)',
    descSq: 'Përshkrimi (Shqip)',
    instructor: 'Instruktori (shkruhet në certifikatë)',
    passMark: 'Pragu i kalimit të testit (%)',
    cpd: 'Orë CPD (opsionale)',
    cpdHint: 'Shkruhen në certifikatë, p.sh. 8 ose 7.5.',
    published: 'Publikuar — shfaqet në katalog dhe te mjekët e caktuar',
    cover: 'Foto ballore',
    changeCover: 'Zgjidh foto',
    save: 'Ruaj kursin',
    back: 'Të gjitha kurset',
    delete: 'Fshi',
    draft: 'Draft',
    none: 'Ende pa kurse. Krijoni të parin.',
    confirmDelete: 'Të fshihet ky kurs dhe të gjitha mësimet? Nuk mund të kthehet.',
    saving: 'Duke ruajtur…',
    saved: 'U ruajt',
  },
};

// Suggestions for the instructor field (any name can still be typed).
const KNOWN_INSTRUCTORS = ['Dr. Lendita Islami Nallbani', 'Dr. Faton Loci'];

const emptyForm = {
  title_en: '',
  title_sq: '',
  description_en: '',
  description_sq: '',
  instructor_name: '',
  quiz_pass_percent: '70',
  cpd_hours: '',
  is_published: true,
};

const CoursesAdmin: React.FC<{ lang: Lang }> = ({ lang }) => {
  const s = t[lang];
  const [courses, setCourses] = useState<PortalCourse[] | null>(null);
  const [selected, setSelected] = useState<PortalCourse | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => adminFetchCourses().then(setCourses).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  // Local preview for a newly chosen cover (object URL released when replaced).
  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const startNew = () => {
    setCreating(true);
    setSelected(null);
    setForm(emptyForm);
    setCoverFile(null);
    setSavedAt(null);
    setError('');
  };

  const openCourse = (c: PortalCourse) => {
    setCreating(false);
    setSelected(c);
    setForm({
      title_en: c.title_en,
      title_sq: c.title_sq || '',
      description_en: c.description_en || '',
      description_sq: c.description_sq || '',
      instructor_name: c.instructor_name || '',
      quiz_pass_percent: String(c.quiz_pass_percent ?? 70),
      cpd_hours: c.cpd_hours ? String(c.cpd_hours) : '',
      is_published: c.is_published,
    });
    setCoverFile(null);
    setSavedAt(null);
    setError('');
  };

  const backToList = () => {
    setCreating(false);
    setSelected(null);
    setCoverFile(null);
    setSavedAt(null);
  };

  const saveCourse = async () => {
    setBusy(true);
    setError('');
    setSavedAt(null);
    try {
      const pass = Math.min(100, Math.max(1, parseInt(form.quiz_pass_percent, 10) || 70));
      const cpdRaw = parseFloat(form.cpd_hours.replace(',', '.'));
      const cpd = Number.isFinite(cpdRaw) && cpdRaw > 0 ? Math.min(999, Math.round(cpdRaw * 10) / 10) : null;
      const payload: Partial<PortalCourse> = {
        title_en: form.title_en.trim(),
        title_sq: form.title_sq.trim() || null,
        description_en: form.description_en.trim() || null,
        description_sq: form.description_sq.trim() || null,
        instructor_name: form.instructor_name.trim() || null,
        quiz_pass_percent: pass,
        cpd_hours: cpd,
        is_published: form.is_published,
      };
      let course = selected;
      if (creating) {
        course = await adminCreateCourse({ ...payload, sort_order: courses?.length ?? 0 });
        // From here on this is an existing course: a retry (e.g. after a failed
        // cover upload) updates it instead of creating a duplicate.
        setCreating(false);
        setSelected(course);
      } else if (selected) {
        await adminUpdateCourse(selected.id, payload);
        course = { ...selected, ...payload } as PortalCourse;
      }
      if (course && coverFile) {
        const safe = coverFile.name.replace(/[^\w.\-]+/g, '_');
        const path = `${course.id}/cover-${Date.now()}-${safe}`;
        await adminUploadFile(BUCKET_COVERS, path, coverFile);
        await adminUpdateCourse(course.id, { cover_path: path });
        course = { ...course, cover_path: path };
      }
      await load();
      setCreating(false);
      setSelected(course as PortalCourse);
      setForm((f) => ({ ...f, quiz_pass_percent: String(pass) }));
      setCoverFile(null);
      setSavedAt(Date.now());
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: PortalCourse) => {
    if (!window.confirm(s.confirmDelete)) return;
    setError('');
    try {
      await adminDeleteCourse(c.id);
      backToList();
      load();
    } catch (e: any) {
      setError(e.message || 'Error');
    }
  };

  if (!courses)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );

  const label = 'block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5';
  const input = 'w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500';

  // ── Editor (create or edit) ────────────────────────────────────────────────
  if (creating || selected) {
    const previewUrl = coverPreview || (selected ? coverUrl(selected.cover_path) : null);
    return (
      <div>
        <button onClick={backToList} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest mb-6">
          <ArrowLeft size={15} /> {s.back}
        </button>

        {error && <p className="text-xs font-bold text-red-600 mb-4">{error}</p>}

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>{s.titleEn}</label>
              <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={input} />
            </div>
            <div>
              <label className={label}>{s.titleSq}</label>
              <input value={form.title_sq} onChange={(e) => setForm({ ...form, title_sq: e.target.value })} className={input} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={3} placeholder={s.descEn} className={input} />
            <textarea value={form.description_sq} onChange={(e) => setForm({ ...form, description_sq: e.target.value })} rows={3} placeholder={s.descSq} className={input} />
          </div>

          <div className="grid sm:grid-cols-[minmax(0,1fr)_200px_160px] items-end gap-4">
            <div>
              <label className={label}>{s.instructor}</label>
              <input
                value={form.instructor_name}
                onChange={(e) => setForm({ ...form, instructor_name: e.target.value })}
                list="academy-instructors"
                className={input}
              />
              <datalist id="academy-instructors">
                {KNOWN_INSTRUCTORS.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={label}>{s.passMark}</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.quiz_pass_percent}
                onChange={(e) => setForm({ ...form, quiz_pass_percent: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label className={label}>{s.cpd}</label>
              <input
                inputMode="decimal"
                value={form.cpd_hours}
                onChange={(e) => setForm({ ...form, cpd_hours: e.target.value })}
                placeholder="8"
                title={s.cpdHint}
                className={input}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div>
              <label className={label}>{s.cover}</label>
              <div className="flex items-center gap-3">
                <div className="w-24 h-16 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                  {previewUrl ? <img src={previewUrl} alt="" className="w-full h-full object-cover" /> : <ImagePlus className="w-5 h-5 text-slate-300" />}
                </div>
                <label className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-blue-600">
                  {s.changeCover}
                  <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="hidden" />
                </label>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 mt-5">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 accent-blue-600" />
              {s.published}
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={saveCourse}
              disabled={busy || !form.title_en.trim()}
              className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              {busy && <Loader2 size={13} className="animate-spin" />} {busy ? s.saving : s.save}
            </button>
            {savedAt && !busy && <span className="text-[11px] font-bold text-green-600">✓ {s.saved}</span>}
            {selected && !creating && (
              <button onClick={() => remove(selected)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 ml-auto">
                <Trash2 size={14} /> {s.delete}
              </button>
            )}
          </div>

          {/* Lessons and quiz only once the course exists */}
          {selected && !creating && (
            <>
              <LessonsAdmin lang={lang} courseId={selected.id} />
              <QuizAdmin lang={lang} courseId={selected.id} passPercent={selected.quiz_pass_percent ?? 70} />
            </>
          )}
        </div>
      </div>
    );
  }

  // ── List ────────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-900">{s.title}</h2>
        <button onClick={startNew} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
          <Plus size={14} /> {s.newCourse}
        </button>
      </div>

      {error && <p className="text-xs font-bold text-red-600 mb-4">{error}</p>}

      {courses.length === 0 ? (
        <p className="text-slate-500">{s.none}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => {
            const cover = coverUrl(c.cover_path);
            return (
              <button
                key={c.id}
                onClick={() => openCourse(c)}
                className="group text-left bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="h-28 bg-slate-100 relative overflow-hidden">
                  {cover ? (
                    <img src={cover} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-slate-300" />
                    </div>
                  )}
                  {!c.is_published && (
                    <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded">
                      {s.draft}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-900 tracking-tight text-sm">{localized(c.title_en, c.title_sq, lang)}</h3>
                  {c.instructor_name && <p className="text-[11px] text-slate-400 mt-1">{c.instructor_name}</p>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesAdmin;
