import React, { useState, useRef, useMemo } from 'react';
import { ACADEMY_COURSES, DOCTORS, ACADEMY_BENEFITS } from '../constants';
import {
  ArrowLeft, GraduationCap, Clock, CheckCircle2, Volume2, Loader2,
  ShieldCheck, Microscope, ArrowUpRight, Target, ExternalLink,
  BookOpen, Award as AwardIcon, Globe2, User, Users, Zap, Download,
  ChevronRight, Plus, Binary, Layers, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SyllabusModal from './SyllabusModal';
import { Course } from '../types';

interface AcademyPageProps {
  onBack: () => void;
  onOpenMaterials?: () => void;
  lang: 'en' | 'sq';
}

const AcademyPage: React.FC<AcademyPageProps> = ({ onBack, onOpenMaterials, lang }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
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

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-blue-50/40 via-transparent to-transparent" />

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{lang === 'en' ? 'Back' : 'Kthehu'}</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-lg font-display font-black tracking-tighter text-slate-900">
              MEDIDENT<span className="text-blue-600">.</span>ACADEMY
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-400">Pejë Clinical Training</span>
          </div>
          <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
            className="text-[9px] font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-xl uppercase tracking-widest">
            {lang === 'en' ? 'Apply' : 'Apliko'}
          </a>
        </div>
      </header>

      <main className="relative z-10 pt-28 pb-32">

        {/* ── HERO ─────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 md:mb-40">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-8 border border-blue-100">
                <GraduationCap size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {lang === 'en' ? 'Clinical Masterclasses · Pejë, Kosova' : 'Masterklasa Klinike · Pejë, Kosovë'}
                </span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
                className="text-5xl sm:text-6xl md:text-[80px] font-display font-black leading-[0.88] tracking-tighter text-slate-900 mb-8">
                {lang === 'en' ? <>Learn from<br /><span className="text-blue-600 italic">those who do.</span></> : <>Mëso nga<br /><span className="text-blue-600 italic">ata që bëjnë.</span></>}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.14 }}
                className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-lg">
                {lang === 'en'
                  ? 'Two active courses taught directly by our clinic doctors — inside the same rooms, with the same tools, on real cases.'
                  : 'Dy kurse aktive të mësuara drejtpërsëdrejti nga mjekët tanë — brenda të njëjtave dhoma, me të njëjtat mjete, mbi raste reale.'}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-4 items-center">
                <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
                  className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-blue-600/20 hover:shadow-2xl active:scale-95">
                  {lang === 'en' ? 'Reserve Your Spot' : 'Rezervo Vendin'}
                </a>
                <button onClick={playBriefing} className="flex items-center space-x-3 px-5 py-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all">
                  <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition-all">
                    {isPlayingAudio ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={16} />}
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{lang === 'en' ? 'Audio intro' : 'Hyrje audio'}</p>
                    <p className="text-[10px] font-black text-slate-900">Dr. Lendita Islami</p>
                  </div>
                </button>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="relative">
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-900/10">
                  <img src="/team/lendita-nallbani.jpg" className="w-full h-full object-cover object-top" alt="Dr. Lendita Nallbani" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-white">
                    <img src="/team/lendita-nallbani.jpg" className="w-10 h-10 rounded-xl object-cover object-top border border-white/20" alt="" />
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-60">{lang === 'en' ? 'Lead Instructor' : 'Instruktore Kryesore'}</p>
                      <p className="text-xs font-black">Dr. Lendita Islami Nallbani</p>
                    </div>
                  </div>
                </div>
                {/* Stats pill */}
                <div className="absolute -top-6 -right-4 bg-white shadow-xl rounded-2xl px-5 py-4 border border-slate-100 hidden md:block">
                  <p className="text-2xl font-display font-black text-blue-600">27</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{lang === 'en' ? 'Years of practice' : 'Vite praktikë'}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── PROCESS STEPS ─────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 md:mb-40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { num: '01', icon: <Binary size={20} className="text-blue-600" />, title: lang === 'en' ? '3D Planning' : 'Planifikim 3D', desc: lang === 'en' ? 'Master digital case planning before any procedure.' : 'Zotëro planifikimin digjital para çdo procedure.' },
              { num: '02', icon: <Layers size={20} className="text-blue-600" />, title: lang === 'en' ? 'Hands-on Lab' : 'Lab Praktik', desc: lang === 'en' ? 'Work on real anatomical models in the clinic.' : 'Punë mbi modele anatomike reale në klinikë.' },
              { num: '03', icon: <Users size={20} className="text-blue-600" />, title: lang === 'en' ? 'Live Cases' : 'Raste Live', desc: lang === 'en' ? 'Observe and assist in real patient surgeries.' : 'Vëzhgo dhe ndihmo në kirurgji reale.' },
              { num: '04', icon: <AwardIcon size={20} className="text-blue-600" />, title: lang === 'en' ? 'Certificate' : 'Certifikatë', desc: lang === 'en' ? 'Leave with a signed course certificate.' : 'Largohesh me një certifikatë kursi të nënshkruar.' },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group p-6 md:p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-50 transition-colors">
                  {step.icon}
                </div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">{step.num}</p>
                <h4 className="text-base font-display font-black text-slate-900 mb-2 tracking-tight">{step.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── COURSES ───────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 md:mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">
                {lang === 'en' ? 'Active Courses · 2025' : 'Kurse Aktive · 2025'}
              </p>
              <h3 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter leading-none">
                {lang === 'en' ? <>Two courses.<br /><span className="text-blue-600">Both hands-on.</span></> : <>Dy kurse.<br /><span className="text-blue-600">Të dyja praktike.</span></>}
              </h3>
            </div>
            <p className="text-slate-400 text-sm font-medium max-w-sm">
              {lang === 'en' ? 'Contact us on WhatsApp to ask about dates, group size, and pricing.' : 'Na kontaktoni në WhatsApp për datat, grupin dhe çmimin.'}
            </p>
          </div>

          <div className="space-y-6">
            {ACADEMY_COURSES.map((course, idx) => {
              const instructor = DOCTORS.find(d => d.id === course.instructorId);
              const isOpen = expandedCourse === course.id;
              return (
                <motion.div key={course.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-blue-300 transition-all">
                  {/* Course image strip */}
                  <div className="relative h-48 sm:h-64 overflow-hidden">
                    <img src={course.image} className="w-full h-full object-cover" alt={course.title[lang]} />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <span className="inline-flex items-center space-x-2 bg-blue-600 text-white text-[9px] px-4 py-2 rounded-full font-black uppercase tracking-widest w-fit">
                        <Zap size={12} />
                        <span>{course.category}</span>
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white tracking-tight leading-tight">{course.title[lang]}</h4>
                      </div>
                    </div>
                    {instructor && (
                      <div className="absolute bottom-6 right-6 flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl">
                        <img src={instructor.image} className="w-7 h-7 rounded-lg object-cover object-top" alt={instructor.name} />
                        <p className="text-[9px] font-black text-white">{instructor.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Course body */}
                  <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex items-start justify-between gap-6">
                      <p className="text-slate-500 font-medium text-sm leading-relaxed flex-1">{course.description[lang]}</p>
                      <button onClick={() => setExpandedCourse(isOpen ? null : course.id)}
                        className="flex-shrink-0 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                        <span>{isOpen ? (lang === 'en' ? 'Less' : 'Më pak') : (lang === 'en' ? 'Details' : 'Detaje')}</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                          className="overflow-hidden">
                          <div className="pt-8 mt-8 border-t border-slate-100 grid sm:grid-cols-2 gap-8">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                <Target size={12} className="text-blue-600" />
                                {lang === 'en' ? 'What you learn' : 'Çfarë mëson'}
                              </p>
                              <div className="space-y-3">
                                {course.keyTakeaways[lang].map((item, i) => (
                                  <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{item}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                <BookOpen size={12} className="text-blue-600" />
                                {lang === 'en' ? 'Curriculum' : 'Kurrikula'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {course.curriculum.map((item, i) => (
                                  <span key={i} className="text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">{item}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-3 mt-6">
                      <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
                        className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <span>{lang === 'en' ? 'Apply on WhatsApp' : 'Apliko në WhatsApp'}</span>
                        <ArrowUpRight size={14} />
                      </a>
                      <button onClick={() => { setShouldAutoPrint(true); setSelectedCourse(course); }}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <Download size={14} />
                        <span>{lang === 'en' ? 'Syllabus PDF' : 'PDF Kursi'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── FACULTY ───────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 md:mb-40">
          <div className="text-center mb-14">
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">
              {lang === 'en' ? 'Your Instructors' : 'Instruktorët Tuaj'}
            </p>
            <h3 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
              {lang === 'en' ? <>Doctors who teach<br /><span className="text-blue-600">what they practice.</span></> : <>Mjekë që mësojnë<br /><span className="text-blue-600">çfarë praktikojnë.</span></>}
            </h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {academicFaculty.map((inst, i) => (
              <motion.div key={inst.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                  <div className="sm:w-40 flex-shrink-0">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                      <img src={inst.image} className="w-full h-full object-cover object-top" alt={inst.name} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">{inst.role[lang]}</p>
                    <h4 className="text-xl font-display font-black text-slate-900 tracking-tight mb-4">{inst.name}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{inst.bio[lang]}</p>
                    <div className="bg-blue-600 text-white px-5 py-3 rounded-xl inline-block">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-0.5">{lang === 'en' ? 'Experience' : 'Përvojë'}</p>
                      <p className="text-sm font-black">{inst.experience[lang]}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── MATERIALS CALLOUT ─────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 md:mb-40">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] pointer-events-none" />
            <div className="relative max-w-xl">
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">
                {lang === 'en' ? 'Same materials, same patients' : 'Të njëjtat materiale, të njëjtët pacientë'}
              </p>
              <h3 className="text-3xl font-display font-black text-white tracking-tight mb-4">
                {lang === 'en' ? 'You train with what we use every day.' : 'Trajnohesh me çfarë ne përdorim çdo ditë.'}
              </h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed">
                {lang === 'en'
                  ? 'Hiossen, MegaGen, and Ivoclar — the same implant systems and ceramics used on our patients are what you practice with here.'
                  : 'Hiossen, MegaGen dhe Ivoclar — të njëjtat sisteme implantesh dhe qeramikë të përdorura me pacientët tanë janë me çfarë praktikon këtu.'}
              </p>
            </div>
            <button onClick={onOpenMaterials}
              className="relative flex-shrink-0 flex items-center gap-3 bg-white hover:bg-blue-600 text-slate-900 hover:text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              <Microscope size={18} />
              <span>{lang === 'en' ? 'Material Registry' : 'Regjistri i Materialeve'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '90%', label: lang === 'en' ? 'Hands-on time' : 'Kohë praktike' },
              { num: '2004', label: lang === 'en' ? 'First implant in Kosovo by a woman' : 'Implanti i parë në Kosovë nga një grua' },
              { num: '4,000+', label: lang === 'en' ? 'Implants placed' : 'Implante të vendosura' },
              { num: 'ISO', label: lang === 'en' ? 'Certified clinic' : 'Klinikë e çertifikuar' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 text-center">
                <p className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-2">{stat.num}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      <footer className="py-16 border-t border-slate-100 text-center relative z-10 bg-white">
        <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.4em]">
          © 2025 MEDIDENT ACADEMY · PEJË, KOSOVË
        </p>
      </footer>

      <SyllabusModal course={selectedCourse} onClose={() => { setSelectedCourse(null); setShouldAutoPrint(false); }} lang={lang} autoPrint={shouldAutoPrint} />
    </div>
  );
};

export default AcademyPage;
