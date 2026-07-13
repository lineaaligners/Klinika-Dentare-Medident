import React, { useState, useRef, useMemo } from 'react';
import { ACADEMY_COURSES, DOCTORS } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { 
  ArrowLeft, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  Mail, 
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
  Globe2
} from 'lucide-react';
import SyllabusModal from './SyllabusModal';
import { Course, Doctor } from '../types';

interface AcademyPageProps {
  onBack: () => void;
  lang: 'en' | 'sq';
}

const AcademyPage: React.FC<AcademyPageProps> = ({ onBack, lang }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Surgical' | 'Digital' | 'Prosthetic'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const filteredCourses = useMemo(() => {
    if (activeTab === 'All') return ACADEMY_COURSES;
    return ACADEMY_COURSES.filter(c => c.category === activeTab);
  }, [activeTab]);

  const academicFaculty = useMemo(() => {
    // Show doctors with research profiles in the Academy faculty section
    return DOCTORS.filter(d => d.research);
  }, []);

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const playBriefing = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Chief Oral Surgeon Dr. Lendita Islami Nallbani: Welcome to the Medident Clinical Academy in Peja. Our surgical modules are built on 27 years of clinical practice. We focus on high-fidelity clinical outcomes. Join us to transform your surgical career.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: ["AUDIO" as any],
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
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
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

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500">
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-widest">{lang === 'en' ? 'Return to Clinic' : 'Kthehu në Klinikë'}</span>
          </button>
          <span className="text-lg font-display font-black tracking-tighter text-slate-900">
            MEDIDENT<span className="text-blue-600">.</span>ACADEMY
          </span>
          <div className="hidden md:flex items-center space-x-6">
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center bg-blue-50 px-4 py-2 rounded-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              MEDIDENT HUB
            </span>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 text-white relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[150px] -z-10 animate-pulse"></div>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg mb-8">
                  <GraduationCap size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {lang === 'en' ? 'Clinical Masterclasses' : 'Masterklasat Klinike'}
                  </span>
                </div>
                <h1 className="text-6xl md:text-[80px] font-display font-black leading-[0.85] tracking-tighter mb-8">
                  Institutional <br />
                  <span className="text-blue-600">{lang === 'en' ? 'Mastery.' : 'Mjeshtëri.'}</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-xl">
                  {lang === 'en' 
                    ? 'Advanced clinical training protocols led by Chief Oral Surgeon Dr. Lendita Islami Nallbani and our multidisciplinary board.'
                    : 'Protokolle të avancuara të trajnimit klinik të udhëhequra nga Kryekirurgja Dr. Lendita Islami Nallbani dhe bordi ynë multidisiplinar.'}
                </p>
                <div className="flex flex-wrap gap-8 items-center">
                  <a href="mailto:academy@medident-ks.com" className="bg-blue-600 hover:bg-white hover:text-slate-950 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-600/20">
                    Apply to Academy
                  </a>
                  <button onClick={playBriefing} className="flex items-center space-x-4 text-slate-400 hover:text-white transition-all group">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                      {isPlayingAudio ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={18} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Board Welcome</span>
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 relative group shadow-2xl">
                  <img 
                    src="https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/freepik__recreate-the-locations-more-modern-bright-natural-__5205.jpeg" 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
                    alt="Clinical Training Environment" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Selection */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex flex-wrap gap-4 justify-center">
            {['All', 'Surgical', 'Digital', 'Prosthetic'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Courses Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-40">
          <div className="grid lg:grid-cols-2 gap-12">
            {filteredCourses.map((course) => (
              <div key={course.id} className="group bg-white border border-slate-200 rounded-[3rem] overflow-hidden flex flex-col hover:border-blue-600 hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img src={course.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={course.title[lang]} />
                  <div className="absolute top-8 left-8">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest border border-white/10">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-8 right-8">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg flex items-center">
                      <Clock size={12} className="mr-2" /> {course.duration[lang]}
                    </span>
                  </div>
                </div>
                <div className="p-12 flex-1 flex flex-col">
                  <h4 className="text-3xl font-display font-black text-slate-900 tracking-tight mb-4">{course.title[lang]}</h4>
                  <p className="text-slate-500 text-base font-medium mb-8 leading-relaxed">{course.description[lang]}</p>
                  
                  {/* Key Takeaways Section */}
                  <div className="mb-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center">
                      <Target size={14} className="mr-2" />
                      {lang === 'en' ? 'Key Learning Objectives' : 'Objektivat Kryesore të Mësimit'}
                    </h5>
                    <div className="grid gap-3">
                      {course.keyTakeaways[lang].map((takeaway, tIdx) => (
                        <div key={tIdx} className="flex items-start space-x-3">
                          <div className="mt-1 w-1 h-1 rounded-full bg-blue-500 shrink-0"></div>
                          <p className="text-[11px] font-bold text-slate-700 leading-tight">
                            {takeaway}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {course.curriculum.slice(0, 4).map((item, i) => (
                        <span key={i} className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <CheckCircle2 size={12} className="mr-2 text-blue-500" />
                          {item}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setSelectedCourse(course)}
                      className="w-full mt-8 flex items-center justify-between bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-100 p-6 rounded-2xl transition-all group"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Download Syllabus' : 'Shkarko Silabusin'}</span>
                      <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Academic Faculty Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="mb-16">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Registry of Excellence</h2>
            <h3 className="text-5xl md:text-6xl font-display font-black text-slate-900 tracking-tighter">Academic <span className="text-blue-600">Faculty.</span></h3>
          </div>

          <div className="space-y-32">
            {academicFaculty.map((instructor) => (
              <div key={instructor.id} className="grid lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-4 sticky top-32">
                  <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden grayscale border border-slate-200 mb-8 shadow-xl">
                    <img src={instructor.image} className="w-full h-full object-cover" alt={instructor.name} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {instructor.links?.map((link, lIdx) => (
                      <a 
                        key={lIdx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"
                      >
                        <ExternalLink size={12} />
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-16">
                  <div>
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{instructor.role[lang]}</h4>
                    <h5 className="text-5xl font-display font-black text-slate-900 mb-8 tracking-tighter">{instructor.name}</h5>
                    <p className="text-slate-600 text-lg font-medium leading-relaxed mb-12">
                      {instructor.bio[lang]}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-16">
                    {/* Education */}
                    <div>
                      <h6 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center">
                        <GraduationCap size={18} className="mr-3 text-blue-600" />
                        Academic Background
                      </h6>
                      <ul className="space-y-6">
                        {instructor.education[lang].map((edu, eIdx) => (
                          <li key={eIdx} className="flex items-start space-x-4">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                            <span className="text-slate-900 font-bold text-base leading-tight tracking-tight">{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Certifications / Stats */}
                    <div className="space-y-8">
                      <div>
                        <h6 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center">
                          <AwardIcon size={18} className="mr-3 text-blue-600" />
                          Institutional Honors
                        </h6>
                        <div className="flex flex-wrap gap-2">
                          {instructor.certifications.map((cert, cIdx) => (
                            <span key={cIdx} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-8 bg-blue-600 rounded-[2rem] text-white">
                        <Briefcase size={20} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Professional Legacy</p>
                        <p className="text-2xl font-display font-black">{instructor.experience[lang]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Research Contributions */}
                  {instructor.research && (
                    <div className="pt-16 border-t border-slate-100">
                      <h6 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center">
                        <FlaskConical size={18} className="mr-3 text-blue-600" />
                        Scientific & Research Contributions
                      </h6>
                      <div className="grid gap-6">
                        {instructor.research[lang].map((res, rIdx) => (
                          <div key={rIdx} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group flex items-start gap-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shrink-0">
                              <Microscope size={20} />
                            </div>
                            <div>
                              <p className="text-slate-700 font-bold leading-relaxed">{res}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3">Published Contribution • Clinical Board Verified</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
          © 2024 MEDIDENT CLINICAL ACADEMY • PEJA, KOSOVO
        </p>
      </footer>

      <SyllabusModal 
        course={selectedCourse} 
        onClose={() => setSelectedCourse(null)} 
        lang={lang} 
      />
    </div>
  );
};

export default AcademyPage;