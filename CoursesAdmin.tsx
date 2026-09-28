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
import { Loader2, Plus, Trash2, ArrowLeft, ImagePlus, BookOpen } from 'lucide-react';

const t = {
  en: {
    title: 'Courses & Content',
    newCourse: 'New course',
    titleEn: 'Title (English)',
    titleSq: 'Title (Albanian)',
    descEn: 'Description (English)',
    descSq: 'Description (Albanian)',
    published: 'Visible to assigned doctors',
    cover: 'Cover image',
    changeCover: 'Choose image',
    save: 'Save course',
    back: 'All courses',
    delete: 'Delete',
    none: 'No courses yet. Create your first one.',
    confirmDelete: 'Delete this course and all its lessons? This cannot be undone.',
    saving: 'Saving…',
  },
  sq: {
    title: 'Kurset & Përmbajtja',
    newCourse: 'Kurs i ri',
    titleEn: 'Titulli (Anglisht)',
    titleSq: 'Titulli (Shqip)',
    descEn: 'Përshkrimi (Anglisht)',
    descSq: 'Përshkrimi (Shqip)',
    published: 'I dukshëm për mjekët e caktuar',
    cover: 'Foto ballore',
    changeCover: 'Zgjidh foto',
    save: 'Ruaj kursin',
    back: 'Të gjitha kurset',
    delete: 'Fshi',
    none: 'Ende pa kurse. Krijoni të parin.',
    confirmDelete: 'Të fshihet ky kurs dhe të gjitha mësimet? Nuk mund të kthehet.',
    saving: 'Duke ruajtur…',
  },
};

const emptyForm = { title_en: '', title_sq: '', description_en: '', description_sq: '', is_published: true };

const CoursesAdmin: React.FC<{ lang: Lang }> = ({ lang }) => {
  const s = t[lang];
  const [courses, setCourses] = useState<PortalCourse[] | null>(null);
  const [selected, setSelected] = useState<PortalCourse | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = () => adminFetchCourses().then(setCourses).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setCreating(true);
    setSelected(null);
    setForm(emptyForm);
    setCoverFile(null);
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
      is_published: c.is_published,
    });
    setCoverFile(null);
    setError('');
  };

  const backToList = () => {
    setCreating(false);
    setSelected(null);
    setCoverFile(null);
  };

  const saveCourse = async () => {
    setBusy(true);
    setError('');
    try {
      let course = selected;
      if (creating) {
        course = await adminCreateCourse({ ...form, sort_order: courses?.length ?? 0 });
      } else if (selected) {
        await adminUpdateCourse(selected.id, form);
        course = { ...selected, ...form } as PortalCourse;
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
      setCoverFile(null);
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: PortalCourse) => {
    if (!window.confirm(s.confirmDelete)) return;
    await adminDeleteCourse(c.id);
    backToList();
    load();
  };

  if (!courses)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );

  // ── Editor (create or edit) ────────────────────────────────────────────────
  if (creating || selected) {
    const previewUrl = coverFile ? URL.createObjectURL(coverFile) : selected ? coverUrl(selected.cover_path) : null;
    return (
      <div>
        <button onClick={backToList} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest mb-6">
          <ArrowLeft size={15} /> {s.back}
        </button>

        {error && <p className="text-xs font-bold text-red-600 mb-4">{error}</p>}

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.titleEn}</label>
              <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.titleSq}</label>
              <input value={form.title_sq} onChange={(e) => setForm({ ...form, title_sq: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={3} placeholder={s.descEn} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" />
            <textarea value={form.description_sq} onChange={(e) => setForm({ ...form, description_sq: e.target.value })} rows={3} placeholder={s.descSq} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" />
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.cover}</label>
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

          <div className="flex items-center gap-3 pt-2">
            <button onClick={saveCourse} disabled={busy || !form.title_en} className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
              {busy && <Loader2 size={13} className="animate-spin" />} {busy ? s.saving : s.save}
            </button>
            {selected && !creating && (
              <button onClick={() => remove(selected)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600">
                <Trash2 size={14} /> {s.delete}
              </button>
            )}
          </div>

          {/* Lessons only available once the course exists */}
          {selected && !creating && <LessonsAdmin lang={lang} courseId={selected.id} />}
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
                      Draft
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-900 tracking-tight text-sm">{localized(c.title_en, c.title_sq, lang)}</h3>
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
