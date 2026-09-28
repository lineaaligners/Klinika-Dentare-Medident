import React, { useState } from 'react';
import { Lang } from '../types';
import CoursesAdmin from './CoursesAdmin';
import DoctorsAdmin from './DoctorsAdmin';
import AssignmentsAdmin from './AssignmentsAdmin';
import { BookOpen, Users, ListChecks } from 'lucide-react';

type Tab = 'courses' | 'doctors' | 'assignments';

const t = {
  en: { courses: 'Courses & Content', doctors: 'Doctors', assignments: 'Assignments' },
  sq: { courses: 'Kurset & Përmbajtja', doctors: 'Mjekët', assignments: 'Caktimet' },
};

const AdminScreen: React.FC<{ lang: Lang }> = ({ lang }) => {
  const s = t[lang];
  const [tab, setTab] = useState<Tab>('courses');
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'courses', label: s.courses, icon: <BookOpen size={14} /> },
    { id: 'doctors', label: s.doctors, icon: <Users size={14} /> },
    { id: 'assignments', label: s.assignments, icon: <ListChecks size={14} /> },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-8 border-b border-slate-200">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 -mb-px transition-colors ${
              tab === tb.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-900'
            }`}
          >
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>
      {tab === 'courses' && <CoursesAdmin lang={lang} />}
      {tab === 'doctors' && <DoctorsAdmin lang={lang} />}
      {tab === 'assignments' && <AssignmentsAdmin lang={lang} />}
    </div>
  );
};

export default AdminScreen;
