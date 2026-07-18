
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ACADEMY_COURSES, DOCTORS, ACADEMY_BENEFITS } from '../constants';
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  ArrowLeft, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  Loader2, 
  ShieldCheck, 
  Microscope, 
  ArrowUpRight, 
  Target, 
  ExternalLink, 
  FlaskConical, 
  Award as AwardIcon,
  BookOpen,
  Briefcase,
  Globe2,
  Monitor,
  User,
  Users,
  Zap,
  Printer,
  Download,
  ChevronRight,
  Plus,
  Binary,
  Layers
} from 'lucide-react';
import SyllabusModal from './SyllabusModal';
import { Course, Doctor } from '../types';

interface AcademyPageProps {
  onBack: () => void;
  onOpenMaterials?: () => void;
  lang: 'en' | 'sq';
}

const AcademyPage: React.FC<AcademyPageProps> = ({ onBack, onOpenMaterials, lang }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Hands-on' | 'Online' | '1-on-1'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const filteredCourses = useMemo(() => {
    if (activeTab === 'All') return ACADEMY_COURSES;
    return ACADEMY_COURSES.filter(c => c.category === activeTab);
  }, [activeTab]);

  const academicFaculty = useMemo(() => {
    return DOCTORS.filter(d => d.id === '1' || d.id === '2');
  }, []);

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const playBriefing = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Chief Oral Surgeon Dr. Lendita Islami Nallbani: Welcome to the Medident Clinical Academy in Peja. Our surgical modules are informed by my experience practicing in top international hospitals. We focus on high-fidelity clinical outcomes. Join us to transform your surgical career.`;

      // Corrected model for TTS task and fixed responseModalities typo
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlayingAudio(false);
        source.start();
      } else {
        setIsPlayingAudio(false);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsPlayingAudio(false);
    }
  };

  const handleDownloadSyllabus = (course: Course) => {
    setShouldAutoPrint(true);
    setSelectedCourse(course);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Hands-on': return <Zap size={14} />;
      case 'Online': return <Monitor size={14} />;
      case '1-on-1': return <User size={14} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-500 selection:bg-blue-600 selection:text-white">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-[0.03]"></div>
      </div>

      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center space-x-3 text-slate-400 hover:text-blue-600 transition-all group"
          >
            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Exit Academy' : 'Dilni nga Akademia'}</span>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-black tracking-tighter text-slate-900 leading-none">
              MEDIDENT<span className="text-blue-600">.</span>ACADEMY
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Peja Clinical Hub</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="hidden md:flex text-[9px] font-black text-blue-600 uppercase tracking-widest items-center bg-blue-50/50 px-4 py-2 rounded-full border border-blue-100/50">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Admissions Open 2026
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-40 pb-32">
        {/* Elite Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-40">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center space-x-3 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-10 border border-blue-100">
                <GraduationCap size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Institutional Masterclass Registry</span>
              </div>
              <h1 className="text-6xl md:text-[90px] font-display font-black leading-[0.85] tracking-tighter text-slate-900 mb-10">
                Precision <br />
                <span className="text-blue-600 italic">Redefined.</span>
              </h1>
              <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed mb-16 max-w-xl">
                Elevating surgical standards through intensive clinical immersion and mentorship from world-class dental experts.
              </p>
              
              <div className="flex flex-wrap gap-6 items-center">
                <a href="https://wa.me/38349772307" target="_blank" rel="noopener" className="bg-slate-900 hover:bg-blue-600 text-white px-12 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl hover:scale-105 active:scale-95">
                  Secure Academic Slot
                </a>
                <button onClick={playBriefing} className="flex items-center space-x-4 px-6 py-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {isPlayingAudio ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={18} />}
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Audio Briefing</p>
                    <p className="text-[10px] font-black text-slate-900">Dr. Lendita Islami</p>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group">
                <img 
                  src="/team/lendita-nallbani.jpg" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt="Dr. Lendita Islami Nallbani — Academy Lead Instructor" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    <Microscope size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Lead Instructor</p>
                    <p className="text-xs font-black">Dr. Lendita Islami Nallbani</p>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white shadow-2xl rounded-full flex flex-col items-center justify-center border border-slate-50 hidden md:flex animate-bounce-slow">
                <span className="text-3xl font-display font-black text-blue-600">90%</span>
                <span className="text-[8px] font-black uppercase text-center tracking-widest text-slate-400">Clinical<br/>Practice</span>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Journey Process */}
        <section className="max-w-7xl mx-auto px-6 mb-40">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { id: '01', title: 'Diagnostic Rigor', icon: <Binary className="text-blue-600" />, desc: 'Mastering 3D planning & anatomical mapping.' },
              { id: '02', title: 'Hands-on Labs', icon: <Layers className="text-blue-600" />, desc: 'Practicing on high-fidelity anatomical models.' },
              { id: '03', title: 'Clinical Mentorship', icon: <Users className="text-blue-600" />, desc: 'Live case observation & 1-on-1 guidance.' },
              { id: '04', title: 'Registry Honors', icon: <AwardIcon className="text-blue-600" />, desc: 'Institutional certification & board registry.' }
            ].map((step, i) => (
              <div key={i} className="group p-10 bg-white border border-slate-100 rounded-[3rem] hover:shadow-2xl hover:border-blue-200 transition-all text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {step.icon}
                </div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Step {step.id}</p>
                <h4 className="text-xl font-display font-black text-slate-900 mb-4 tracking-tight">{step.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Refined Courses Section */}
        <section className="max-w-7xl mx-auto px-6 mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Academic Catalog</h2>
              <h3 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tighter leading-none">
                Surgical & <br />Restorative <span className="text-blue-600">Tracks.</span>
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              {['All', 'Hands-on', 'Online', '1-on-1'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {filteredCourses.map((course) => (
              <div key={course.id} className="group bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden flex flex-col hover:shadow-2xl hover:border-blue-200 transition-all duration-700">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt={course.title[lang]} />
                  <div className="absolute top-10 left-10">
                    <span className="bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest border border-white/10 flex items-center space-x-2">
                      {getCategoryIcon(course.category)}
                      <span>{course.category} Course</span>
                    </span>
                  </div>
                  <div className="absolute bottom-10 right-10">
                    <div className="flex items-center space-x-3 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{course.duration[lang]}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-12 md:p-16 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{course.title[lang]}</h4>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <Plus size={20} />
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-lg font-medium mb-12 leading-relaxed">{course.description[lang]}</p>
                  
                  <div className="grid sm:grid-cols-2 gap-12 mb-12">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center">
                        <Target size={14} className="mr-2 text-blue-600" />
                        Key Objectives
                      </h5>
                      <div className="space-y-4">
                        {course.keyTakeaways[lang].slice(0, 3).map((takeaway, tIdx) => (
                          <div key={tIdx} className="flex items-start space-x-3">
                            <div className="mt-1.5 w-1 h-1 rounded-full bg-blue-600 shrink-0"></div>
                            <p className="text-[11px] font-bold text-slate-600 leading-tight">{takeaway}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center">
                        <BookOpen size={14} className="mr-2 text-blue-600" />
                        Curriculum Preview
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {course.curriculum.slice(0, 4).map((item, i) => (
                          <span key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const instructor = DOCTORS.find(d => d.id === course.instructorId);
                    return instructor ? (
                      <div className="flex items-center space-x-4 mb-10 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <img src={instructor.image} alt={instructor.name} className="w-14 h-14 rounded-xl object-cover object-top border border-slate-200" />
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{lang === 'en' ? 'Led by' : 'Udhëhequr nga'}</p>
                          <p className="text-sm font-display font-black text-slate-900 tracking-tight">{instructor.name}</p>
                          <p className="text-[10px] font-bold text-blue-600">{instructor.role[lang]}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div className="mt-auto grid sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSelectedCourse(course)}
                      className="flex items-center justify-center space-x-3 bg-slate-900 hover:bg-blue-600 text-white p-5 rounded-2xl transition-all shadow-xl shadow-slate-900/5 group"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">Mastery Application</span>
                      <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>

                    <button 
                      onClick={() => handleDownloadSyllabus(course)}
                      className="flex items-center justify-center space-x-3 bg-white border border-slate-200 text-slate-900 p-5 rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm group"
                    >
                      <Download size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Syllabus PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Academic Faculty refined */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-24">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Academy Instructors</h2>
            <h3 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tighter">The Institutional <span className="text-blue-600">Chair.</span></h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {academicFaculty.map((instructor) => (
              <div key={instructor.id} className="group bg-slate-50 rounded-[4rem] p-12 md:p-16 border border-slate-200 hover:border-blue-500 transition-all duration-700">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="md:w-1/2">
                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-slate-200 mb-8 shadow-xl">
                      <img src={instructor.image} className="w-full h-full object-cover" alt={instructor.name} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {instructor.links?.map((link, lIdx) => (
                        <a 
                          key={lIdx} 
                          href={link.url} 
                          className="bg-white border border-slate-200 p-3 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                        >
                          <ExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="md:w-1/2 flex flex-col">
                    <div className="mb-10">
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">{instructor.role[lang]}</p>
                      <h4 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none mb-6">{instructor.name}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{instructor.bio[lang]}</p>
                    </div>

                    <div className="mt-auto space-y-6">
                      <div className="p-6 bg-white rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-3 mb-4">
                          <GraduationCap size={16} className="text-blue-600" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Education</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 line-clamp-2">{instructor.education[lang][0]}</p>
                      </div>
                      
                      <div className="p-6 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-600/10">
                        <div className="flex items-center space-x-3 mb-2">
                          <AwardIcon size={16} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Legacy</span>
                        </div>
                        <p className="text-xl font-display font-black">{instructor.experience[lang]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Material Registry Callout */}
        <section className="max-w-7xl mx-auto px-6 mb-40">
           <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Standardized Practice</h4>
                 <h3 className="text-3xl font-display font-black text-slate-900 tracking-tight mb-6">World-Class Materials Registry</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">
                    Our clinical training is exclusively performed using the same elite materials we use for our patients: Astra Tech, Osstem, and Ivoclar. Explore our transparent comparison registry.
                 </p>
              </div>
              <button 
                onClick={onOpenMaterials}
                className="bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-900 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center space-x-3 group"
              >
                <Microscope size={18} />
                <span>Open Comparison Registry</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </section>

        {/* Benefits section refined */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -z-0"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
              <div>
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6">Why Medident</h3>
                <h2 className="text-5xl font-display font-black tracking-tighter leading-none mb-10">Clinical ROI <br />& Professional <span className="text-blue-600">Ascension.</span></h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
                  Our curriculum is designed not just for learning, but for immediate clinical implementation. Join an elite registry of surgical experts.
                </p>
                <div className="grid gap-6">
                  {ACADEMY_BENEFITS(lang).slice(0, 2).map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">{benefit.title}</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between group hover:bg-blue-600 transition-all duration-500">
                  <Microscope size={32} className="text-blue-500 group-hover:text-white" />
                  <div>
                    <p className="text-3xl font-display font-black text-white">90%</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white/70">Practical focus</p>
                  </div>
                </div>
                <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between group hover:bg-blue-600 transition-all duration-500">
                  <Globe2 size={32} className="text-blue-500 group-hover:text-white" />
                  <div>
                    <p className="text-3xl font-display font-black text-white">45+</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white/70">Countries reached</p>
                  </div>
                </div>
                <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between group hover:bg-blue-600 transition-all duration-500">
                  <ShieldCheck size={32} className="text-blue-500 group-hover:text-white" />
                  <div>
                    <p className="text-3xl font-display font-black text-white">ISO</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white/70">Clinical standards</p>
                  </div>
                </div>
                <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between group hover:bg-blue-600 transition-all duration-500">
                  <Clock size={32} className="text-blue-500 group-hover:text-white" />
                  <div>
                    <p className="text-3xl font-display font-black text-white">24/7</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white/70">LMS Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-slate-100 text-center relative z-10 bg-white">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">
          © 2026 MEDIDENT CLINICAL ACADEMY • INSTITUTIONAL REGISTRY
        </p>
        <div className="flex justify-center space-x-6 mt-8">
           <a href="#" className="text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Privacy Protocol</a>
           <a href="#" className="text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Academic Terms</a>
           <a href="#" className="text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Cookie Policy</a>
        </div>
      </footer>

      <SyllabusModal 
        course={selectedCourse} 
        onClose={() => {
          setSelectedCourse(null);
          setShouldAutoPrint(false);
        }} 
        lang={lang} 
        autoPrint={shouldAutoPrint}
      />
    </div>
  );
};

export default AcademyPage;
