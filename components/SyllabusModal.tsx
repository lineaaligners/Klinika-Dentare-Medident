
import React from 'react';
import { X, Printer, GraduationCap, Clock, CheckCircle2, Award, BookOpen, ShieldCheck, Microscope } from 'lucide-react';
import { Course, Doctor } from '../types';
import { DOCTORS } from '../constants';

interface SyllabusModalProps {
  course: Course | null;
  onClose: () => void;
  lang: 'en' | 'sq';
}

const SyllabusModal: React.FC<SyllabusModalProps> = ({ course, onClose, lang }) => {
  if (!course) return null;

  const leadSurgeon = DOCTORS.find(d => d.id === '1'); // Dr. Lendita

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 md:p-10 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-full max-h-[95vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative border border-slate-200">
        
        {/* Header - Hidden on Print */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 print:hidden bg-white z-20">
          <div className="flex items-center space-x-3">
            <GraduationCap size={20} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Academic Registry • Syllabus Access
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
            >
              <Printer size={16} />
              <span>{lang === 'en' ? 'Download PDF' : 'Shkarko si PDF'}</span>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content (Printable) */}
        <div className="flex-1 overflow-y-auto print:overflow-visible">
          <div id="syllabus-printable" className="p-12 md:p-20 max-w-4xl mx-auto space-y-16">
            
            {/* Header Document Section */}
            <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-slate-100 pb-16">
              <div className="flex-1">
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Medident Clinical Academy</p>
                <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tighter mb-6 leading-none">
                  {course.title[lang]}
                </h1>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{course.duration[lang]} Full Immersion</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Award size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">ISO 9001 Certified Track</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <span className="text-lg font-display font-black tracking-tighter text-slate-900">
                  MEDIDENT<span className="text-blue-600">.</span>HUB
                </span>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Peja, Kosovo</p>
              </div>
            </div>

            {/* Course Overview */}
            <section>
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center">
                <BookOpen size={16} className="mr-3 text-blue-600" />
                Curriculum Overview
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                {course.description[lang]}
              </p>
            </section>

            {/* Modules Grid */}
            <section className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Surgical Modules</h4>
                <div className="space-y-4">
                  {course.curriculum.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-black text-slate-900 mb-1">{item}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Detailed clinical protocol and live demonstration of {item.toLowerCase()} techniques.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-6">Prerequisites</h4>
                  <ul className="space-y-4">
                    <li className="flex items-center text-xs font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-3"></div>
                      DDS / DMD or equivalent degree
                    </li>
                    <li className="flex items-center text-xs font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-3"></div>
                      Experience in basic oral surgery
                    </li>
                    <li className="flex items-center text-xs font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-3"></div>
                      Advanced English or Albanian proficiency
                    </li>
                  </ul>
                </div>

                <div className="p-8 bg-blue-600 rounded-[2rem] text-white">
                  <ShieldCheck size={24} className="mb-4" />
                  <h5 className="text-xl font-display font-black mb-2 tracking-tight">Clinical Certification</h5>
                  <p className="text-blue-100 text-xs font-medium leading-relaxed">
                    Upon successful completion, candidates receive an Institutional Certificate of Clinical Mastery, recognized by our surgical board.
                  </p>
                </div>
              </div>
            </section>

            {/* Faculty Section */}
            <section className="pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 grayscale shrink-0">
                <img src={leadSurgeon?.image} alt={leadSurgeon?.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Lead Academic Faculty</p>
                <h5 className="text-2xl font-display font-black text-slate-900 mb-2">{leadSurgeon?.name}</h5>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Turkish-trained Chief Oral Surgeon with over 27 years of clinical practice. Specialist in {course.category} disciplines and complex rehabilitations.
                </p>
              </div>
              <div className="shrink-0">
                <Microscope size={48} className="text-slate-100" />
              </div>
            </section>

            {/* Footer Institutional Info */}
            <div className="text-center pt-24 pb-8 space-y-4">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">
                Medident Clinical Academy Registry • Peja, Kosovo • ISO 9001:2015 Approved
              </p>
              <div className="flex justify-center space-x-8 opacity-20">
                <div className="h-8 w-px bg-slate-900"></div>
                <div className="h-8 w-px bg-slate-900"></div>
                <div className="h-8 w-px bg-slate-900"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusModal;
