
import React, { useState } from 'react';
import { DOCTORS } from '../constants';
import { Doctor } from '../types';
import { 
  Award, 
  GraduationCap, 
  ChevronRight, 
  ClipboardCheck, 
  X, 
  BookOpen, 
  Briefcase, 
  Globe2, 
  ShieldCheck 
} from 'lucide-react';

import { motion } from 'framer-motion';

interface DoctorsProps {
  lang: 'en' | 'sq';
}

const Doctors: React.FC<DoctorsProps> = ({ lang }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <section id="doctors" className="py-32 bg-white relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 px-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-lg text-slate-900 mb-8"
          >
            <GraduationCap size={16} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {lang === 'en' ? 'Clinical Board' : 'Bordi Klinik'}
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[0.9] tracking-tighter mb-10"
          >
            {lang === 'en' ? 'Dental' : 'Specialistët'}<br />
            <span className="text-blue-600">{lang === 'en' ? 'Specialists.' : 'Dentare.'}</span>
          </motion.h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
            {lang === 'en' 
              ? 'Our team has grown from one doctor and one manager in 1999 to a full clinic — surgeons, dentists, and the people who make it all work.'
              : 'Ekipi ynë multidisiplinar përbëhet nga specialistë të certifikuar ndërkombëtarisht me përvojë të gjerë kërkimore dhe kirurgjikale.'}
          </p>
        </div>

        {/* Desktop Grid / Mobile Swipeable Container */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 pb-12 sm:pb-0 px-4 sm:px-0 -mx-4 sm:mx-0 snap-x snap-mandatory scrollbar-hide">
          {DOCTORS.map((doctor, idx) => (
            <motion.div 
              key={doctor.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex-shrink-0 w-[85vw] sm:w-auto snap-center flex flex-col border-b border-slate-100 pb-12 perspective-1000"
            >
              <motion.div 
                whileHover={{ rotateY: 5, rotateX: -5 }}
                className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 bg-slate-100 shadow-xl transition-shadow group-hover:shadow-blue-600/10"
              >
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button 
                  onClick={() => setSelectedDoctor(doctor)}
                  className="absolute bottom-6 left-6 right-6 bg-white text-slate-900 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all shadow-2xl active:scale-95"
                >
                  {lang === 'en' ? 'View Full Clinical Profile' : 'Shiko Profilin e Plotë Klinik'}
                </button>
              </motion.div>
              
              <div className="flex flex-col flex-1 px-4 sm:px-0">
                <div className="mb-6">
                  <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight leading-none mb-2">{doctor.name}</h3>
                  <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{doctor.role[lang]}</p>
                </div>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium line-clamp-3">
                  {doctor.bio[lang]}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                  {doctor.specialties.map((spec, i) => (
                    <span key={i} className="text-slate-400 text-[8px] font-black uppercase tracking-widest border border-slate-200 px-3 py-1.5 rounded-full bg-slate-50">
                      {spec}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => setSelectedDoctor(doctor)}
                    className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>{lang === 'en' ? 'Full Curriculum' : 'Kurrikula e Plotë'}</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-32 p-12 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="flex items-center space-x-3 text-blue-500 mb-4">
              <ClipboardCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quality Assurance</span>
            </div>
            <h4 className="text-3xl font-display font-black tracking-tight mb-4">
              {lang === 'en' ? 'Institutional Review Board' : 'Bordi i Rishikimit Institucional'}
            </h4>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              {lang === 'en' 
                ? 'Every treatment plan undergoes a rigorous peer-review process by our board to ensure the highest standards of clinical predictability.'
                : 'Çdo plan trajtimi i nënshtrohet një procesi rigoroz të rishikimit nga bordi ynë për të siguruar standardet më të larta.'}
            </p>
          </div>
          <a href="#contact" className="bg-blue-600 hover:bg-white hover:text-slate-950 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 whitespace-nowrap">
            {lang === 'en' ? 'Schedule Board Review' : 'Cakto Rishikim nga Bordi'}
          </a>
        </div>
      </div>

      {/* Full Profile Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative border border-slate-200">
            <button 
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 z-10"
            >
              <X size={28} />
            </button>

            <div className="flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-12 h-full">
                <div className="lg:col-span-5 bg-slate-50 relative overflow-hidden flex flex-col">
                  <img src={selectedDoctor.image} className="w-full h-full object-cover" alt={selectedDoctor.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <div className="absolute bottom-12 left-12 right-12 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Clinical Faculty</p>
                    <h4 className="text-4xl font-display font-black tracking-tighter mb-2">{selectedDoctor.name}</h4>
                    <p className="text-lg font-medium opacity-80">{selectedDoctor.role[lang]}</p>
                  </div>
                </div>

                <div className="lg:col-span-7 p-12 md:p-20 bg-white">
                  <div className="space-y-16">
                    <div>
                      <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8 flex items-center">
                        <BookOpen size={18} className="mr-3" />
                        Education & Qualifications
                      </h5>
                      <ul className="space-y-6">
                        {selectedDoctor.education[lang].map((edu, i) => (
                          <li key={i} className="flex items-start space-x-4">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                            <span className="text-slate-900 font-bold text-lg leading-tight tracking-tight">{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                      <div>
                        <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6 flex items-center">
                          <Briefcase size={18} className="mr-3" />
                          Experience
                        </h5>
                        <p className="text-2xl font-display font-black text-slate-900 tracking-tight">{selectedDoctor.experience[lang]}</p>
                      </div>
                      <div>
                        <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6 flex items-center">
                          <Globe2 size={18} className="mr-3" />
                          Languages
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedDoctor.languages.map((lang, i) => (
                            <span key={i} className="bg-slate-100 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">{lang}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8 flex items-center">
                        <ShieldCheck size={18} className="mr-3" />
                        Clinical Certifications
                      </h5>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {selectedDoctor.certifications.map((cert, i) => (
                          <div key={i} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-4">
                            <Award className="text-blue-500 shrink-0" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 leading-tight">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-left">
                        © 2026 MEDIDENT CLINICAL BOARD • OFFICIAL FACULTY PROFILE
                      </p>
                      <a href="#contact" onClick={() => setSelectedDoctor(null)} className="bg-slate-900 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
                        Schedule Consultation
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Doctors;
