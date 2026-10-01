import React, { useEffect, useState } from 'react';
import { Lang } from '../types';
import { adminStats } from '../../../services/portalApi';
import OverviewAdmin from './OverviewAdmin';
import CoursesAdmin from './CoursesAdmin';
import RequestsAdmin from './RequestsAdmin';
import QAAdmin from './QAAdmin';
import DoctorsAdmin from './DoctorsAdmin';
import AssignmentsAdmin from './AssignmentsAdmin';
import AnnouncementsAdmin from './AnnouncementsAdmin';
import { BookOpen, Users, ListChecks, BarChart3, Inbox, MessageCircle, Megaphone } from 'lucide-react';

type Tab = 'overview' | 'courses' | 'requests' | 'qa' | 'announcements' | 'doctors' | 'assignments';

const t = {
  en: {
    overview: 'Overview',
    courses: 'Courses & Content',
    requests: 'Requests',
    qa: 'Q&A',
    announcements: 'Announcements',
    doctors: 'Doctors',
    assignments: 'Assignments',
  },
  sq: {
    overview: 'Përmbledhje',
    courses: 'Kurset & Përmbajtja',
    requests: 'Kërkesat',
    qa: 'Pyetjet',
    announcements: 'Njoftimet',
    doctors: 'Mjekët',
    assignments: 'Caktimet',
  },
};

const AdminScreen: React.FC<{ lang: Lang }> = ({ lang }) => {
  const s = t[lang];
  const [tab, setTab] = useState<Tab>('overview');
  const [badges, setBadges] = useState<{ requests: number; qa: number }>({ requests: 0, qa: 0 });

  const refreshBadges = () =>
    adminStats()
      .then((st) => setBadges({ requests: st.pending_requests, qa: st.open_questions }))
      .catch(() => {});

  useEffect(() => {
    refreshBadges();
  }, [tab]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: s.overview, icon: <BarChart3 size={14} /> },
    { id: 'courses', label: s.courses, icon: <BookOpen size={14} /> },
    { id: 'requests', label: s.requests, icon: <Inbox size={14} />, badge: badges.requests },
    { id: 'qa', label: s.qa, icon: <MessageCircle size={14} />, badge: badges.qa },
    { id: 'announcements', label: s.announcements, icon: <Megaphone size={14} /> },
    { id: 'doctors', label: s.doctors, icon: <Users size={14} /> },
    { id: 'assignments', label: s.assignments, icon: <ListChecks size={14} /> },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-8 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === tb.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-900'
            }`}
          >
            {tb.icon} {tb.label}
            {tb.badge ? (
              <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center">{tb.badge}</span>
            ) : null}
          </button>
        ))}
      </div>
      {tab === 'overview' && <OverviewAdmin lang={lang} onOpenTab={(x) => setTab(x)} />}
      {tab === 'courses' && <CoursesAdmin lang={lang} />}
      {tab === 'requests' && <RequestsAdmin lang={lang} onChanged={refreshBadges} />}
      {tab === 'qa' && <QAAdmin lang={lang} onChanged={refreshBadges} />}
      {tab === 'announcements' && <AnnouncementsAdmin lang={lang} />}
      {tab === 'doctors' && <DoctorsAdmin lang={lang} />}
      {tab === 'assignments' && <AssignmentsAdmin lang={lang} />}
    </div>
  );
};

export default AdminScreen;
