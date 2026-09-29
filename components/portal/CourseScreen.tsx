import React, { useEffect, useState } from 'react';
import { fetchCourse, fetchLessons, fetchMyProgress, fetchCourseStatus, localized } from '../../services/portalApi';
import { PortalCourse, PortalLesson, Lang, Profile, CourseStatus } from './types';
import LessonViewer from './LessonViewer';
import QuizPanel from './QuizPanel';
import CertificatePanel from './CertificatePanel';
import { Loader2, ArrowLeft, FileText, CalendarClock, PlayCircle, CheckCircle2, ClipboardCheck, Award } from 'lucide-react';

interface Props {
  lang: Lang;
  courseId: string;
  profile: Profile;
  isAdmin: boolean;
  onBack: () => void;
  onAccount: () => void;
}

type Pane = { type: 'lesson'; lessonId: string } | { type: 'quiz' } | { type: 'certificate' };

const t = {
  en: {
    back: 'All courses',
    lessons: 'Lessons',
    empty: 'No lessons in this course yet.',
    pickLesson: 'Select a lesson to begin.',
    complete: 'complete',
    quiz: 'Final quiz',
    certificate: 'Certificate',
    with: 'with',
  },
  sq: {
    back: 'Të gjitha kurset',
    lessons: 'Mësimet',
    empty: 'Ende nuk ka mësime në këtë kurs.',
    pickLesson: 'Zgjidhni një mësim për të filluar.',
    complete: 'përfunduar',
    quiz: 'Testi përfundimtar',
    certificate: 'Certifikata',
    with: 'me',
  },
};

const kindIcon = (kind: PortalLesson['kind']) => {
  if (kind === 'pdf') return <FileText size={15} />;
  if (kind === 'webinar_live') return <CalendarClock size={15} />;
  return <PlayCircle size={15} />;
};

const CourseScreen: React.FC<Props> = ({ lang, courseId, profile, isAdmin, onBack, onAccount }) => {
  const s = t[lang];
  const [course, setCourse] = useState<PortalCourse | null>(null);
  const [lessons, setLessons] = useState<PortalLesson[] | null>(null);
  const [pane, setPane] = useState<Pane | null>(null);
  const [progress, setProgressState] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<CourseStatus | null>(null);
  const [statusFailed, setStatusFailed] = useState(false);

  const refreshStatus = () =>
    fetchCourseStatus(courseId).then((st) => {
      if (st) setStatus(st);
      setStatusFailed(!st);
    });

  useEffect(() => {
    fetchCourse(courseId).then(setCourse);
    fetchLessons(courseId)
      .then((ls) => {
        setLessons(ls);
        setPane(ls[0] ? { type: 'lesson', lessonId: ls[0].id } : null);
      })
      .catch(() => setLessons([]));
    fetchMyProgress().then(setProgressState);
    refreshStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const markLocal = (lessonId: string, done: boolean) => {
    setProgressState((prev) => {
      const next = new Set(prev);
      if (done) next.add(lessonId);
      else next.delete(lessonId);
      return next;
    });
    refreshStatus();
  };

  const selectPane = (p: Pane) => {
    setPane(p);
    if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedLesson = pane?.type === 'lesson' ? lessons?.find((l) => l.id === pane.lessonId) ?? null : null;
  const courseTitle = course ? localized(course.title_en, course.title_sq, lang) : '';
  const hasQuiz = (status?.quiz_questions ?? 0) > 0;

  const sideItem = (active: boolean, icon: React.ReactNode, label: string, done: boolean, onClick: () => void, key: string) => (
    <li key={key}>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 transition-colors ${active ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
      >
        <span className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
        <span className={`flex-1 text-sm font-bold ${active ? 'text-blue-700' : 'text-slate-700'}`}>{label}</span>
        {done && <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />}
      </button>
    </li>
  );

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest mb-6">
        <ArrowLeft size={15} /> {s.back}
      </button>

      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">{courseTitle}</h1>
      {course?.instructor_name && (
        <p className="text-sm font-bold text-slate-400 mb-4">
          {s.with} {course.instructor_name}
        </p>
      )}

      {lessons && lessons.length > 0 && (
        <div className="mb-8 mt-4 max-w-xs">
          {(() => {
            const done = lessons.filter((l) => progress.has(l.id)).length;
            const pct = Math.round((done / lessons.length) * 100);
            return (
              <>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                  <span>
                    {done}/{lessons.length} {s.complete}
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-blue-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${pct}%` }} />
                </div>
              </>
            );
          })()}
        </div>
      )}

      {!lessons ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-slate-500">{s.empty}</p>
      ) : (
        <div className="grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-8 items-start">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden lg:sticky lg:top-24">
            <p className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">{s.lessons}</p>
            <ul>
              {lessons.map((l) =>
                sideItem(
                  pane?.type === 'lesson' && pane.lessonId === l.id,
                  kindIcon(l.kind),
                  localized(l.title_en, l.title_sq, lang),
                  progress.has(l.id),
                  () => selectPane({ type: 'lesson', lessonId: l.id }),
                  l.id,
                ),
              )}
              {hasQuiz &&
                sideItem(pane?.type === 'quiz', <ClipboardCheck size={15} />, s.quiz, Boolean(status?.quiz_passed), () => selectPane({ type: 'quiz' }), 'quiz')}
              {sideItem(
                pane?.type === 'certificate',
                <Award size={15} />,
                s.certificate,
                Boolean(status?.certificate),
                () => selectPane({ type: 'certificate' }),
                'certificate',
              )}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 min-w-0">
            {pane?.type === 'lesson' && selectedLesson ? (
              <LessonViewer
                lesson={selectedLesson}
                lang={lang}
                completed={progress.has(selectedLesson.id)}
                onToggleComplete={(done) => markLocal(selectedLesson.id, done)}
                userId={profile.id}
                isAdmin={isAdmin}
                courseTitle={course?.title_en}
              />
            ) : pane?.type === 'quiz' ? (
              <QuizPanel lang={lang} courseId={courseId} status={status} onSubmitted={refreshStatus} />
            ) : pane?.type === 'certificate' ? (
              <CertificatePanel
                lang={lang}
                courseId={courseId}
                status={status}
                statusFailed={statusFailed}
                isAdmin={isAdmin}
                onClaimed={refreshStatus}
                onRetry={refreshStatus}
                onAccount={onAccount}
              />
            ) : (
              <p className="text-slate-500">{s.pickLesson}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseScreen;
