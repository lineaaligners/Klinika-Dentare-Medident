import React, { useState, useRef, useMemo } from 'react';
import { ACADEMY_COURSES, DOCTORS } from '../constants';
import {
  ArrowLeft, Clock, CheckCircle2, Volume2, Loader2,
  ShieldCheck, Microscope, ArrowUpRight, Download,
  ChevronRight, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SyllabusModal from './SyllabusModal';
import CourseMotion, { COURSE_VIDEOS } from './CourseMotion';
import AcademyTestimonials from './AcademyTestimonials';
import { Course } from '../types';

interface AcademyPageProps {
  onBack: () => void;
  onOpenMaterials?: () => void;
  lang: 'en' | 'sq';
  initialCourseId?: string;
  onNavigateCourse?: (id: string) => void;
  onOpenPortal?: () => void;
  /** The Academy page is on screen (it stays mounted while hidden). */
  active?: boolean;
}

const AcademyPage: React.FC<AcademyPageProps> = ({ onBack, onOpenMaterials, lang, initialCourseId, onNavigateCourse, onOpenPortal, active = true }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(initialCourseId ?? null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const academicFaculty = useMemo(() => DOCTORS.filter(d => d.id === '1' || d.id === '2'), []);

  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const ch = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) ch[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  }

  const playBriefing = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      const ttsRes = await fetch('/api/tts', { method: 'POST' });
      if (!ttsRes.ok) throw new Error(`TTS API ${ttsRes.status}`);
      const { audio } = await ttsRes.json();
      if (audio) {
        if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const ctx = audioContextRef.current;
        const buf = await decodeAudioData(decode(audio), ctx, 24000, 1);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.onended = () => setIsPlayingAudio(false);
        src.start();
      } else setIsPlayingAudio(false);
    } catch { setIsPlayingAudio(false); }
  };

  const F = { fontFamily: "'Inter', system-ui, sans-serif" } as const;
  const tight = 'tracking-[-0.035em]';

  return (
    <div className="min-h-screen bg-[#f6f9fd] text-[#0d1b2e] selection:bg-blue-600 selection:text-white" style={F}>
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#f6f9fd]/85 backdrop-blur-xl z-50 border-b border-[#dde5f0]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-[#566375] hover:text-[#0d1b2e] transition-colors text-sm font-medium active:scale-[0.97]">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">{lang === 'en' ? 'Back' : 'Kthehu'}</span>
          </button>
          <span className={`text-lg font-extrabold ${tight}`}>
            Medident<span className="text-blue-600">.</span>Academy
          </span>
          <div className="flex items-center gap-4">
            {onOpenPortal && (
              <button onClick={onOpenPortal} className="hidden sm:inline text-sm font-medium text-[#566375] hover:text-[#0d1b2e] transition-colors">
                {lang === 'en' ? 'Doctor login' : 'Hyrja e mjekëve'}
              </button>
            )}
            <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-xl active:scale-[0.97]">
              {lang === 'en' ? 'Apply' : 'Apliko'}
            </a>
          </div>
        </div>
      </header>

      <main className="pt-16">

        {/* ── HERO ─────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 py-14 md:py-24 border-b border-[#dde5f0]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="inline-flex items-center gap-2 bg-[#e8f0fe] text-blue-700 pl-2.5 pr-3 py-1.5 rounded-full mb-6 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                {lang === 'en' ? 'Clinical masterclasses · Pejë, Kosova' : 'Masterklasa klinike · Pejë, Kosovë'}
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="text-[2.6rem] sm:text-6xl md:text-7xl font-extrabold leading-[0.98] tracking-[-0.045em] mb-6">
                {lang === 'en' ? <>Learn from<br /><span className="text-blue-600">those who do.</span></> : <>Mëso nga<br /><span className="text-blue-600">ata që bëjnë.</span></>}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="text-[#566375] text-lg leading-relaxed mb-8 max-w-lg">
                {lang === 'en'
                  ? 'Four active courses taught directly by our clinic doctors, inside the same rooms, with the same tools, on real cases.'
                  : 'Katër kurse aktive të mësuara drejtpërsëdrejti nga mjekët tanë, brenda të njëjtave dhoma, me të njëjtat mjete, mbi raste reale.'}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-wrap gap-3 items-center">
                <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
                  className="inline-flex items-center min-h-[52px] bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl text-base font-semibold transition-colors shadow-[0_6px_16px_rgba(37,99,235,0.22)] active:scale-[0.97]">
                  {lang === 'en' ? 'Reserve your spot' : 'Rezervo vendin'}
                </a>
                <button onClick={playBriefing} className="inline-flex items-center gap-3 min-h-[52px] pl-2 pr-5 rounded-xl bg-white border border-[#dde5f0] hover:border-[#c9d8f5] transition-colors active:scale-[0.97]">
                  <span className="w-9 h-9 rounded-lg bg-[#e8f0fe] flex items-center justify-center text-blue-600">
                    {isPlayingAudio ? <Loader2 size={15} className="animate-spin" /> : <Volume2 size={16} />}
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block text-xs text-[#566375]">{lang === 'en' ? 'Audio intro' : 'Hyrje audio'}</span>
                    <span className="block text-sm font-semibold">Dr. Lendita Islami</span>
                  </span>
                </button>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="relative">
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-[0_30px_60px_-20px_rgba(11,31,58,0.35)]">
                <img src="/team/lendita-nallbani.jpg" className="w-full h-full object-cover object-top" alt="Dr. Lendita Islami Nallbani" />
              </div>
              <div className="absolute left-4 bottom-4 sm:-left-6 sm:bottom-12 bg-white rounded-2xl px-4 py-3 shadow-[0_16px_40px_rgba(11,31,58,0.16)]">
                <p className="text-xs text-[#566375]">{lang === 'en' ? 'Lead instructor' : 'Instruktore kryesore'}</p>
                <p className={`text-sm font-bold ${tight}`}>Dr. Lendita Islami Nallbani</p>
              </div>
              <div className="absolute right-4 top-4 sm:-right-5 sm:top-10 bg-[#0b1f3a] text-white rounded-2xl px-4 py-3 shadow-[0_16px_40px_rgba(11,31,58,0.25)]">
                <p className={`text-2xl font-extrabold ${tight} leading-none`}>27</p>
                <p className="text-xs text-white/70 mt-1">{lang === 'en' ? 'years of practice' : 'vite praktikë'}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PROCESS ───────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 py-14 md:py-20 border-b border-[#dde5f0] grid md:grid-cols-[260px_1fr] gap-8 md:gap-12">
          <h2 className={`text-3xl md:text-4xl font-bold ${tight} leading-tight`}>{lang === 'en' ? 'How the course runs' : 'Si zhvillohet kursi'}</h2>
          <div className="grid sm:grid-cols-2 gap-x-10">
            {[
              { title: lang === 'en' ? '3D planning' : 'Planifikim 3D', desc: lang === 'en' ? 'Master digital case planning before any procedure.' : 'Zotëro planifikimin digjital para çdo procedure.' },
              { title: lang === 'en' ? 'Hands-on lab' : 'Lab praktik', desc: lang === 'en' ? 'Work on real anatomical models in the clinic.' : 'Punë mbi modele anatomike reale në klinikë.' },
              { title: lang === 'en' ? 'Live cases' : 'Raste live', desc: lang === 'en' ? 'Observe and assist in real patient surgeries.' : 'Vëzhgo dhe ndihmo në kirurgji reale.' },
              { title: lang === 'en' ? 'Certificate' : 'Certifikatë', desc: lang === 'en' ? 'Leave with a signed course certificate.' : 'Largohesh me një certifikatë kursi të nënshkruar.' },
            ].map((step, i) => (
              <div key={i} className="py-5 border-t border-[#dde5f0] flex gap-4">
                <span className="text-sm font-bold text-blue-600 tabular-nums pt-0.5">0{i + 1}</span>
                <div>
                  <h3 className={`text-lg font-bold ${tight} mb-1`}>{step.title}</h3>
                  <p className="text-[#566375] text-[15px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COURSES ───────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 py-14 md:py-20 border-b border-[#dde5f0]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <h2 className={`text-3xl md:text-5xl font-extrabold tracking-[-0.04em] leading-[1.02]`}>
              {lang === 'en' ? <>Four courses.<br /><span className="text-blue-600">All hands-on.</span></> : <>Katër kurse.<br /><span className="text-blue-600">Të gjitha praktike.</span></>}
            </h2>
            <p className="text-[#566375] max-w-sm">
              {lang === 'en' ? 'Message us on WhatsApp about dates, group size and pricing.' : 'Na shkruani në WhatsApp për datat, grupin dhe çmimin.'}
            </p>
          </div>

          <div className="space-y-5">
            {ACADEMY_COURSES.map((course) => {
              const instructor = DOCTORS.find(d => d.id === course.instructorId);
              const isOpen = expandedCourse === course.id;
              return (
                <article key={course.id} className="bg-white border border-[#dde5f0] rounded-[20px] overflow-hidden">
                  <div className="relative h-48 sm:h-64 overflow-hidden">
                    {COURSE_VIDEOS[course.id] ? (
                      <video src={COURSE_VIDEOS[course.id]} poster={course.image} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" aria-label={course.title[lang]} />
                    ) : (
                      <img src={course.image} className="w-full h-full object-cover" alt={course.title[lang]} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/85 via-[#0b1f3a]/30 to-transparent" />
                    <CourseMotion courseId={course.id} lang={lang} />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <p className="text-sm font-medium text-white/75 mb-1">{course.category}</p>
                      <h3 className={`text-2xl md:text-3xl font-bold text-white ${tight} leading-tight`}>{course.title[lang]}</h3>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        {instructor && (
                          <div className="flex items-center gap-2.5 mb-4">
                            <img src={instructor.image} className="w-8 h-8 rounded-full object-cover object-top" alt="" />
                            <p className="text-sm font-semibold">{instructor.name}</p>
                          </div>
                        )}
                        <p className="text-[#566375] leading-relaxed">{course.description[lang]}</p>
                      </div>
                      <button onClick={() => { const next = isOpen ? null : course.id; setExpandedCourse(next); onNavigateCourse?.(next ?? ''); }}
                        aria-expanded={isOpen}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        <span>{isOpen ? (lang === 'en' ? 'Less' : 'Më pak') : (lang === 'en' ? 'Details' : 'Detaje')}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden">
                          <div className="pt-6 mt-6 border-t border-[#dde5f0] grid sm:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-sm font-bold mb-3">{lang === 'en' ? 'What you learn' : 'Çfarë mëson'}</h4>
                              <ul className="space-y-2">
                                {course.keyTakeaways[lang].map((item, i) => (
                                  <li key={i} className="flex items-start gap-2.5 text-[15px] text-[#3c4a5c] leading-relaxed">
                                    <CheckCircle2 size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />{item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold mb-3">{lang === 'en' ? 'Curriculum' : 'Kurrikula'}</h4>
                              <div className="flex flex-wrap gap-2">
                                {course.curriculum.map((item, i) => (
                                  <span key={i} className="text-sm text-[#3c4a5c] bg-[#f6f9fd] border border-[#dde5f0] px-3 py-1 rounded-lg">{item}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {course.syllabus && (
                            <div className="pt-6 mt-6 border-t border-[#dde5f0]">
                              <h4 className="text-sm font-bold mb-4">{lang === 'en' ? 'Syllabus' : 'Programi i kursit'}</h4>
                              <div className="space-y-6">
                                {course.syllabus.map((d, di) => (
                                  <div key={di}>
                                    <p className="font-semibold mb-2">{d.day[lang]}</p>
                                    <div className="space-y-1.5">
                                      {d.items.map((it, ii) => (
                                        <div key={ii} className="flex gap-4 text-[15px]">
                                          <span className="font-semibold text-blue-600 w-12 shrink-0 tabular-nums">{it.time}</span>
                                          <span className="text-[#3c4a5c] leading-relaxed">{it.text[lang]}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {(course.date || course.price || course.support) && (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {course.date && <span className="inline-flex items-center gap-2 bg-[#e8f0fe] text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold"><Clock size={14} />{course.date[lang]}</span>}
                        {course.price && <span className="inline-flex items-center bg-[#0b1f3a] text-white px-3 py-1.5 rounded-lg text-sm font-semibold">{course.price}</span>}
                        {course.support && <span className="inline-flex items-center gap-2 bg-[#f6f9fd] border border-[#dde5f0] text-[#3c4a5c] px-3 py-1.5 rounded-lg text-sm font-medium"><ShieldCheck size={14} className="text-blue-600" />{course.support[lang]}</span>}
                      </div>
                    )}
                    {course.requirements && (
                      <p className="mt-4 text-sm text-[#3c4a5c] bg-[#f6f9fd] border border-[#dde5f0] rounded-xl px-4 py-3"><b>{lang === 'en' ? 'How to apply: ' : 'Si të aplikoni: '}</b>{course.requirements[lang]}</p>
                    )}

                    <div className="flex flex-wrap gap-2.5 mt-6">
                      {course.registerUrl && (
                        <a href={course.registerUrl}
                          className="inline-flex items-center gap-2 min-h-[46px] bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl text-[15px] font-semibold transition-colors active:scale-[0.97]">
                          {lang === 'en' ? 'Register online' : 'Regjistrohu online'}<ArrowUpRight size={16} />
                        </a>
                      )}
                      <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
                        className={`inline-flex items-center gap-2 min-h-[46px] px-5 rounded-xl text-[15px] font-semibold transition-colors active:scale-[0.97] ${course.registerUrl ? 'bg-white border border-[#dde5f0] hover:border-[#c9d8f5]' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                        {lang === 'en' ? 'Apply on WhatsApp' : 'Apliko në WhatsApp'}<ArrowUpRight size={16} />
                      </a>
                      <button onClick={() => { setShouldAutoPrint(true); setSelectedCourse(course); }}
                        className="inline-flex items-center gap-2 min-h-[46px] bg-white border border-[#dde5f0] hover:border-[#c9d8f5] px-5 rounded-xl text-[15px] font-semibold transition-colors active:scale-[0.97]">
                        <Download size={16} className="text-blue-600" />{lang === 'en' ? 'Syllabus PDF' : 'PDF e kursit'}
                      </button>
                    </div>
                    {course.disclaimer && (
                      <p className="mt-5 text-xs leading-snug text-[#7a8696]">{course.disclaimer[lang]}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── FACULTY ───────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 py-14 md:py-20 border-b border-[#dde5f0]">
          <h2 className={`text-3xl md:text-5xl font-extrabold tracking-[-0.04em] leading-[1.02] mb-10`}>
            {lang === 'en' ? <>Doctors who teach<br /><span className="text-blue-600">what they practice.</span></> : <>Mjekë që mësojnë<br /><span className="text-blue-600">çfarë praktikojnë.</span></>}
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            {academicFaculty.map((inst) => (
              <div key={inst.id} className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-5 sm:gap-6">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={inst.image} className="w-full h-full object-cover object-top" alt={inst.name} />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">{inst.role[lang]}</p>
                  <h3 className={`text-xl font-bold ${tight} mb-3`}>{inst.name}</h3>
                  <p className="text-[15px] text-[#566375] leading-relaxed mb-4">{inst.bio[lang]}</p>
                  <p className="text-sm"><span className="text-[#566375]">{lang === 'en' ? 'Experience: ' : 'Përvojë: '}</span><b>{inst.experience[lang]}</b></p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS (shown once the academy picks some) ── */}
        <AcademyTestimonials lang={lang} active={active} />

        {/* ── STATS ─────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 py-14 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8">
            {[
              { num: '90%', label: lang === 'en' ? 'Hands-on time' : 'Kohë praktike' },
              { num: '2004', label: lang === 'en' ? 'First implant in Kosovo by a woman' : 'Implanti i parë në Kosovë nga një grua' },
              { num: '4.000+', label: lang === 'en' ? 'Implants placed' : 'Implante të vendosura' },
              { num: 'ISO', label: lang === 'en' ? 'Certified clinic' : 'Klinikë e certifikuar' },
            ].map((stat, i) => (
              <div key={i} className="py-5 border-t border-[#dde5f0]">
                <p className={`text-4xl md:text-5xl font-extrabold tracking-[-0.045em] text-blue-600 mb-1`}>{stat.num}</p>
                <p className="text-sm text-[#566375]">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-[#dde5f0] flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-8">
            <p className="text-sm font-semibold shrink-0">{lang === 'en' ? 'International guest lecturers' : 'Ligjërues ndërkombëtarë'}</p>
            <p className="text-[15px] text-[#566375]">Prof. Dr. Ales Vesnhaver · Prof. Dr. Giorgio Tabanella · Dr. Atilla Mühl · Prof. Dr. Samir Prohić</p>
          </div>
        </section>

        {/* ── MATERIALS CTA ─────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 pb-20">
          <div className="rounded-[24px] p-8 sm:p-12 md:p-14 text-white bg-[radial-gradient(90%_140%_at_100%_0%,#2563eb_0%,#123a6b_45%,#0b1f3a_100%)] flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2 className={`text-3xl md:text-4xl font-bold ${tight} leading-tight mb-3`}>
                {lang === 'en' ? 'You train with what we use every day.' : 'Trajnohesh me çfarë ne përdorim çdo ditë.'}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {lang === 'en'
                  ? 'Hiossen, MegaGen and Ivoclar: the same implant systems and ceramics we use on our patients.'
                  : 'Hiossen, MegaGen dhe Ivoclar: të njëjtat sisteme implantesh dhe qeramikë që përdorim me pacientët tanë.'}
              </p>
            </div>
            <button onClick={onOpenMaterials}
              className="flex-shrink-0 inline-flex items-center gap-2 min-h-[52px] bg-white text-[#0d1b2e] px-6 rounded-xl text-base font-semibold hover:bg-[#e8f0fe] transition-colors active:scale-[0.97]">
              <Microscope size={18} className="text-blue-600" />
              {lang === 'en' ? 'Material registry' : 'Regjistri i materialeve'}
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

      </main>

      <footer className="py-10 border-t border-[#dde5f0] text-center">
        <p className="text-sm text-[#7a8696]">© 2026 Medident Academy · Pejë, Kosovë</p>
      </footer>

      <SyllabusModal course={selectedCourse} onClose={() => { setSelectedCourse(null); setShouldAutoPrint(false); }} lang={lang} autoPrint={shouldAutoPrint} />
    </div>
  );
};

export default AcademyPage;
