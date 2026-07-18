
import React from 'react';
import { X, Download, Plane, Hotel, Shield, Phone, MapPin, Printer, Compass, Landmark, ClipboardList, Info, AlertCircle, Coffee, BriefcaseMedical } from 'lucide-react';

interface PatientGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'sq';
}

const PatientGuideModal: React.FC<PatientGuideModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const pejaImage = "https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/0721ea76-7b07-412b-9fcd-0f1570fc4cba.jpg";
  const clinicInterior = "https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/freepik__recreate-the-locations-more-modern-bright-natural-__5205.jpeg";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 md:p-10 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl h-full max-h-[95vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative border border-white/10">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 print:hidden bg-white z-20">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-display font-black tracking-tighter text-slate-900">
              MEDIDENT<span className="text-blue-600">.</span> PEJA
            </span>
            <span className="h-4 w-px bg-slate-200"></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Travel Protocol v2.5</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-900/10"
            >
              <Printer size={16} />
              <span>{lang === 'en' ? 'Save as PDF / Print' : 'Ruaj si PDF / Printo'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto print:overflow-visible custom-scrollbar">
          <div id="printable-guide" style={{ WebkitPrintColorAdjust: 'exact' } as any}>
            
            {/* Hero Section */}
            <div className="relative h-[50vh] flex items-end print:h-[40vh] bg-slate-950 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900/30"></div>
              <div className="absolute inset-0 opacity-40">
                <img src={clinicInterior} alt="Medident Interior" className="w-full h-full object-cover" />
              </div>
              
              <div className="relative z-10 p-8 md:p-16 w-full text-white">
                <div className="max-w-4xl">
                  <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg mb-8">
                    <Compass size={16} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {lang === 'en' ? 'International Patient Guide' : 'Udhëzuesi Ndërkombëtar'}
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-black leading-[0.85] tracking-tighter mb-8">
                    {lang === 'en' ? 'YOUR SURGICAL' : 'RRUGËTIMI JUAJ'}<br />
                    <span className="text-blue-500">{lang === 'en' ? 'JOURNEY TO PEJA.' : 'KIRURGJIK NË PEJË.'}</span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-5xl mx-auto px-8 md:px-16 py-24 space-y-32">
              
              {/* 1. Travel & Logistics */}
              <div className="grid md:grid-cols-2 gap-24 items-start">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-6 flex items-center">
                    <Plane size={14} className="mr-2" /> Protocol 01
                  </h3>
                  <h2 className="text-3xl font-display font-black tracking-tight mb-8">{lang === 'en' ? 'Logistics & Transit' : 'Logjistika dhe Transiti'}</h2>
                  <div className="space-y-8">
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">PRN Airport Greeting</h4>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        A Medident team member will meet you at the arrivals hall and drive you directly to Peja.
                      </p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">Private Shuttle</h4>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        60-minute transit in executive class vehicles. High-speed WiFi and refreshments provided throughout the journey.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <img src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800&auto=format&fit=crop" alt="Airport Transit" className="rounded-3xl shadow-xl w-full aspect-video object-cover" />
                  <div className="flex items-center space-x-4 p-6 border border-slate-100 rounded-2xl">
                    <Info size={20} className="text-blue-500" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Flight tracking required 24h before arrival.</p>
                  </div>
                </div>
              </div>

              {/* 2. Accommodation Partners */}
              <div className="break-before-page">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-6 flex items-center">
                  <Hotel size={14} className="mr-2" /> Protocol 02
                </h3>
                <h2 className="text-3xl font-display font-black tracking-tight mb-12">{lang === 'en' ? 'Institutional Accommodation' : 'Akomodimi Institucional'}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      name: 'Hotel Dukagjini',
                      desc: 'Luxury landmark in Peja city center. Optimal for high-end recovery with premium spa facilities.',
                      img: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/images%20(4).jpg'
                    },
                    {
                      name: 'Boutique Stay Karagaq',
                      desc: 'Quiet, modern boutique environment located near the park. Ideal for serenity and post-op rest.',
                      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop'
                    }
                  ].map((hotel, i) => (
                    <div key={i} className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                      <div className="aspect-video overflow-hidden">
                        <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                      <div className="p-8">
                        <h4 className="text-xl font-display font-black text-slate-900 mb-2">{hotel.name}</h4>
                        <p className="text-slate-500 text-sm font-medium">{hotel.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Pre-Appointment Instructions */}
              <div className="grid md:grid-cols-2 gap-24 items-start break-before-page">
                <div className="order-2 md:order-1 bg-slate-900 text-white rounded-[2.5rem] p-12">
                   <h3 className="text-xl font-display font-black mb-8 flex items-center">
                    <ClipboardList size={20} className="mr-3 text-blue-500" /> Pre-Op Protocol
                   </h3>
                   <ul className="space-y-6">
                     {[
                       { title: 'Clinical Records', desc: 'Bring physical copies of latest OPG or 3D CT Scans if available.' },
                       { title: 'Medication', desc: 'Notify us of any blood-thinning medication 7 days prior.' },
                       { title: 'Fasting', desc: '6 hours of fasting required if IV sedation is planned.' },
                       { title: 'Clothing', desc: 'Wear loose-fitting, comfortable clothing for surgery day.' }
                     ].map((item, i) => (
                       <li key={i} className="flex gap-4">
                         <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                         <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white mb-1">{item.title}</p>
                            <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                         </div>
                       </li>
                     ))}
                   </ul>
                   <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-xl flex items-start space-x-3">
                      <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">Failure to follow fasting protocols may result in procedure postponement.</p>
                   </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-6 flex items-center">
                    <BriefcaseMedical size={14} className="mr-2" /> Protocol 03
                  </h3>
                  <h2 className="text-3xl font-display font-black tracking-tight mb-8">Clinical Preparation</h2>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                    Your safety is our institutional priority. Following these pre-surgical guidelines ensures a predictable and stable outcome for your rehabilitation.
                  </p>
                  <div className="flex flex-wrap gap-4">
                     <div className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-3">
                        <Coffee size={18} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">No Caffeine 12h Pre-Op</span>
                     </div>
                     <div className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-3">
                        <Shield size={18} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Travel Insurance Required</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* 4. Clinic Standards */}
              <div className="break-before-page">
                <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   <div className="grid lg:grid-cols-2 gap-16 items-center">
                      <div>
                        <h2 className="text-4xl font-display font-black tracking-tight mb-8">Institutional Clinic Standards</h2>
                        <div className="space-y-6">
                           <div className="flex items-start space-x-4">
                              <Shield size={24} className="shrink-0" />
                              <p className="text-blue-100 font-medium leading-relaxed">Medident operates under ISO 9001:2015 clinical standards with world-class surgical leadership.</p>
                           </div>
                           <div className="flex items-start space-x-4">
                              <Landmark size={24} className="shrink-0" />
                              <p className="text-blue-100 font-medium leading-relaxed">Our facility includes a dedicated sterilization center and advanced 3D diagnostic suite.</p>
                           </div>
                        </div>
                      </div>
                      <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-3xl border border-white/10">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">Patient Support Desk</h4>
                         <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                               <Phone size={20} />
                               <span className="text-xl font-bold">+383 49 772 307</span>
                            </div>
                            <div className="flex items-center space-x-4">
                               <MapPin size={20} />
                               <span className="text-sm font-bold">Rruga Mbreti Bardhyl, Pejë, Kosovo</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

            </div>

            {/* Footer Tag */}
            <div className="py-12 border-t border-slate-100 text-center">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">MEDIDENT INSTITUTIONAL ARCHIVE • INTERNATIONAL PATIENT DIVISION</p>
               <p className="text-[8px] font-bold text-slate-300 mt-2 uppercase">Revision 2024.05 • Authorized for External Distribution</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientGuideModal;
