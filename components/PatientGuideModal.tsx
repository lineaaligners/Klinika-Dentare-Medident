
import React from 'react';
import { X, Download, Plane, Hotel, Shield, Phone, MapPin, Printer, Compass, Landmark } from 'lucide-react';

interface PatientGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'sq';
}

const PatientGuideModal: React.FC<PatientGuideModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    // Small timeout ensures any dynamic styles are rendered before print dialog
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const pejaImage = "https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/0721ea76-7b07-412b-9fcd-0f1570fc4cba.jpg";

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
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Travel Protocol v2.4</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-900/10"
            >
              <Printer size={16} />
              <span>{lang === 'en' ? 'Download PDF' : 'Shkarko PDF'}</span>
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
            
            {/* Pure Gradient Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] flex items-end print:h-[40vh] bg-slate-950 overflow-hidden" style={{ minHeight: '600px' }}>
              {/* Subtle Ambient Glows */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/4"></div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900/30"></div>
              
              <div className="relative z-10 p-8 md:p-16 w-full text-white">
                <div className="max-w-4xl">
                  <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg mb-8">
                    <Compass size={16} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {lang === 'en' ? 'Official Patient Guide' : 'Udhëzuesi Zyrtar i Pacientit'}
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-display font-black leading-[0.85] tracking-tighter mb-8">
                    {lang === 'en' ? 'SURGICAL' : 'KIRURGJI'}<br />
                    <span className="text-blue-500">{lang === 'en' ? 'DESTINATION: PEJA.' : 'DESTINACIONI: PEJË.'}</span>
                  </h1>
                  <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed">
                    {lang === 'en' 
                      ? 'Institutional surgical excellence at the foot of the Rugova mountains. Your specialized journey to oral health starts here.' 
                      : 'Ekselenca kirurgjikale institucionale në rrëzë të maleve të Rugovës. Rrugëtimi juaj i specializuar fillon këtu.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-5xl mx-auto px-8 md:px-16 py-24 space-y-32">
              
              {/* Travel Protocol */}
              <div className="grid md:grid-cols-2 gap-24 items-start">
                <div>
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600">
                      <Plane size={24} />
                    </div>
                    <h3 className="text-3xl font-display font-black tracking-tight">{lang === 'en' ? 'Arrival & Logistics' : 'Arritja dhe Logjistika'}</h3>
                  </div>
                  <div className="space-y-8">
                    <div className="group">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">PRN Airport Greeting</h4>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {lang === 'en' 
                          ? 'Our dedicated support team monitors your flight in real-time. Upon arrival at Pristina International Airport (PRN), a VIP driver will meet you at the arrivals hall with personalized identification.'
                          : 'Ekipi ynë i përkushtuar monitoron fluturimin tuaj në kohë reale. Pas arritjes në Aeroportin e Prishtinës, shoferi VIP do t\'ju presë me identifikim të personalizuar.'}
                      </p>
                    </div>
                    <div className="group">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Transfer to Peja</h4>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {lang === 'en'
                          ? 'A private, climate-controlled executive vehicle will transport you directly to Peja. The journey takes approximately 60 minutes through the scenic plains of Dukagjin.'
                          : 'Një automjet privat ekzekutiv do t\'ju transportojë direkt në Pejë. Rrugëtimi zgjat rreth 60 minuta.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 shadow-sm" style={{ backgroundColor: '#f8fafc !important' }}>
                  <h4 className="text-xl font-display font-black text-slate-900 mb-8 tracking-tight">{lang === 'en' ? 'Institutional Benefits' : 'Përfitimet Institucionale'}</h4>
                  <ul className="space-y-6">
                    {[
                      { icon: <Shield size={18} />, text: lang === 'en' ? 'European Surgical Standards' : 'Standardet Evropiane Kirurgjikale' },
                      { icon: <Hotel size={18} />, text: lang === 'en' ? 'Premium Accommodation Access' : 'Qasje në Akomodim Premium' },
                      { icon: <Phone size={18} />, text: lang === 'en' ? '24/7 Surgical Support Line' : 'Mbështetje Kirurgjikale 24/7' },
                      { icon: <Landmark size={18} />, text: lang === 'en' ? 'Multilingual Patient Coordinators' : 'Koordinatorë Shumëgjuhësh' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center space-x-4 text-sm font-bold text-slate-700">
                        <div className="text-blue-600">{item.icon}</div>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recovery & Surroundings */}
              <div className="grid md:grid-cols-2 gap-24 items-center break-before-page">
                <div className="order-2 md:order-1 relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200">
                  <img src={pejaImage} className="w-full aspect-square object-cover" alt="Peja Recovery Environment" />
                  <div className="absolute inset-0 bg-slate-950/20"></div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-3xl font-display font-black tracking-tight mb-8">{lang === 'en' ? 'Recovery in Serenity' : 'Shërimi në Qetësi'}</h3>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                    {lang === 'en'
                      ? 'Peja offers the perfect micro-climate for post-surgical recovery. The fresh mountain air and serene environment aid in biological healing processes.'
                      : 'Peja ofron mikroklimën e përsosur për rikuperim pas operacionit. Ajri i pastër i maleve dhe mjedisi i qetë ndihmojnë në proceset e shërimit biologjik.'}
                  </p>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <MapPin size={24} className="text-blue-600" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Clinic Hub</p>
                        <p className="text-sm font-black text-slate-900">Medident Clinic, Peja, Kosovo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden break-before-page" style={{ backgroundColor: '#0f172a !important' }}>
                <div className="absolute inset-0 bg-blue-600/10 opacity-50"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                  <h4 className="text-4xl font-display font-black tracking-tight mb-8">{lang === 'en' ? 'Medident Support' : 'Mbështetja Medident'}</h4>
                  <p className="text-slate-400 text-lg font-medium mb-12">
                    {lang === 'en' 
                      ? 'Our team is ready to coordinate your clinical journey. Contact our international office for a personalized logistical protocol.'
                      : 'Ekipi ynë është gati të koordinojë rrugëtimin tuaj klinik. Kontaktoni zyrën tonë ndërkombëtare për protokollin tuaj logjistik.'}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">WhatsApp / Phone</p>
                      <p className="text-2xl font-bold">+383 49 772 307</p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Official Email</p>
                      <p className="text-2xl font-bold">medident-ks@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Tag */}
            <div className="py-12 border-t border-slate-100 text-center">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">MEDIDENT INSTITUTIONAL ARCHIVE • REVISION 2024.01</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientGuideModal;
