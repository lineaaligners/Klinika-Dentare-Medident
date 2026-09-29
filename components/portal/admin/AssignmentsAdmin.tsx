import React, { useEffect, useState } from 'react';
import { Lang, Profile, PortalCourse } from '../types';
import {
  adminListDoctors,
  adminFetchCourses,
  adminFetchAssignments,
  adminAssign,
  adminUnassign,
  localized,
} from '../../../services/portalApi';
import { Loader2 } from 'lucide-react';

const t = {
  en: {
    title: 'Assignments',
    hint: 'Tick a box to give a doctor access to a course.',
    noDoctors: 'Add doctors first.',
    noCourses: 'Create courses first.',
    doctor: 'Doctor',
  },
  sq: {
    title: 'Caktimet',
    hint: 'Shënoni një kuti për t’i dhënë mjekut qasje në një kurs.',
    noDoctors: 'Shtoni mjekë së pari.',
    noCourses: 'Krijoni kurse së pari.',
    doctor: 'Mjeku',
  },
};

const key = (d: string, c: string) => `${d}:${c}`;

const AssignmentsAdmin: React.FC<{ lang: Lang }> = ({ lang }) => {
  const s = t[lang];
  const [doctors, setDoctors] = useState<Profile[] | null>(null);
  const [courses, setCourses] = useState<PortalCourse[] | null>(null);
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    adminListDoctors().then(setDoctors);
    adminFetchCourses().then(setCourses);
    adminFetchAssignments().then((as) => setAssigned(new Set(as.map((a) => key(a.doctor_id, a.course_id)))));
  }, []);

  const toggle = async (doctorId: string, courseId: string) => {
    const k = key(doctorId, courseId);
    setPending(k);
    const has = assigned.has(k);
    try {
      if (has) await adminUnassign(doctorId, courseId);
      else await adminAssign(doctorId, courseId);
      setAssigned((prev) => {
        const n = new Set(prev);
        if (has) n.delete(k);
        else n.add(k);
        return n;
      });
    } finally {
      setPending(null);
    }
  };

  if (!doctors || !courses)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  if (doctors.length === 0) return <p className="text-slate-500">{s.noDoctors}</p>;
  if (courses.length === 0) return <p className="text-slate-500">{s.noCourses}</p>;

  return (
    <div>
      <h2 className="text-xl font-black text-slate-900 mb-1">{s.title}</h2>
      <p className="text-sm text-slate-500 mb-6">{s.hint}</p>
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 sticky left-0 bg-white z-10">
                {s.doctor}
              </th>
              {courses.map((c) => (
                <th key={c.id} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                  {localized(c.title_en, c.title_sq, lang)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id} className="border-b border-slate-50">
                <td className="px-4 py-3 font-bold text-slate-700 sticky left-0 bg-white whitespace-nowrap z-10">
                  {d.full_name || d.email}
                </td>
                {courses.map((c) => {
                  const k = key(d.id, c.id);
                  const checked = assigned.has(k);
                  return (
                    <td key={c.id} className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={pending === k}
                        onChange={() => toggle(d.id, c.id)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsAdmin;
