import React, { useState } from 'react';
/* Added missing Compass and Star icons to the import list from lucide-react to resolve the reference errors */
import { 
  ArrowLeft, 
  Plane, 
  Upload, 
  Calendar as CalendarIcon, 
  ClipboardCheck, 
  FileText, 
  CheckCircle2, 
  Camera, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Image as ImageIcon,
  MessageSquare,
  Shield,
  MapPin,
  Check,
  Download,
  Microscope,
  Mountain,
  Car,
  Coffee,
  HelpCircle,
  Gem,
  Info,
  Euro,
  Globe2,
  Navigation,
  Building2,
  Hotel,
  Activity,
  Award,
  Monitor,
  Binary,
  Layers,
  Zap,
  RefreshCw,
  Wind,
  Utensils,
  BarChart3,
  Compass,
  Star
} from 'lucide-react';
import { RUGOVA_EXPERIENCES } from '../constants';

interface TourismPageProps {
  onBack: () => void;
  lang: 'en' | 'sq';
  onOpenGuide?: () => void;
  onOpenMaterials?: () => void;
}

const TourismPage: React.FC<TourismPageProps> = ({ onBack, lang, onOpenGuide, onOpenMaterials }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'quote' | 'reserve'>('upload');
  const [timelinePhase, setTimelinePhase] = useState<1 | 2>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [reservationSubmitted, setReservationSubmitted] = useState(false);
  
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const toggleAddon = (addon: string) => {
    setSelectedAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const labels = {
    title: lang === 'en' ? 'Your Journey to Medident' : 'Rrugëtimi Juaj drejt Medident',
    subtitle: lang === 'en' ? 'One doctor who knows your case by name. 3D-planned surgery in a family clinic trusted since 1999.' : 'Një mjeke që e njeh rastin tuaj me emër. Kirurgji e planifikuar në 3D, në një klinikë familjare të besuar që nga 1999.',
    uploadTab: lang === 'en' ? 'Clinical Assessment' : 'Vlerësimi Klinik',
    quoteTab: lang === 'en' ? 'Your Personal Quote' : 'Oferta Juaj Personale',
    reserveTab: lang === 'en' ? 'Book Dates' : 'Rezervoni Datat',
    uploadTitle: lang === 'en' ? 'Diagnostic Submission' : 'Dërgimi i Diagnostikës',
    uploadDesc: lang === 'en' ? 'Upload your OPG or 3D scan. Dr. Lendita reviews every case personally.' : 'Ngarkoni Panoramen ose skanimin 3D. Dr. Lendita e rishikon çdo rast personalisht.',
    quoteTitle: lang === 'en' ? 'Your Personal Protocol' : 'Protokolli juaj Personal',
    reserveTitle: lang === 'en' ? 'Secure Your Slot' : 'Siguroni Datën tuaj',
  };

  const timelineStepsPhase1 = [
    { day: 'Day 1', task: 'Arrival & Meeting Your Doctor', detail: 'We pick you up at the airport. Clinical exam and 3D CBCT diagnostics the same day.' },
    { day: 'Day 2', task: 'Your Surgery', detail: 'Performed personally by Dr. Lendita, guided by your 3D surgical plan.' },
    { day: 'Day 3-5', task: 'Rest & Healing', detail: 'Recover in Peja and Rugova. Daily check-ins with your doctor.' },
    { day: 'Day 6-8', task: 'Temporary Loading', detail: 'Fitting of aesthetic temporary restorations.' },
  ];

  const timelineStepsPhase2 = [
    { day: 'Day 1', task: 'Return Arrival', detail: 'Post-osseointegration return for final phase.' },
    { day: 'Day 2-3', task: 'HD Digital Scanning', detail: 'Precision scanning for permanent zirconia.' },
    { day: 'Day 5-6', task: 'The Reveal', detail: 'Final adjustments and permanent prosthetic loading.' },
    { day: 'Day 7', task: 'Goodbye — For Now', detail: 'Final check with Dr. Lendita, aftercare plan in hand, and transfer to the airport.' },
  ];

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-500">
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-widest">{lang === 'en' ? 'Return to Home' : 'Kthehu te Fillimi'}</span>
          </button>
          <span className="text-lg font-display font-black tracking-tighter text-slate-900">
            MEDIDENT<span className="text-blue-600">.</span>JOURNEY
          </span>
          <div className="hidden md:flex items-center space-x-4">
             <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                <Compass size={14} className="mr-2" />
                CONCIERGE ACTIVE
             </span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Manifesto Header */}
          <div className="mb-32 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black text-slate-900 tracking-tighter mb-8 leading-[0.9] md:leading-[0.85]">
              {lang === 'en' ? (
                <>YOUR SMILE,<br /><span className="text-blue-600">REIMAGINED IN THE ALPS.</span></>
              ) : (
                <>BUZËQESHJA JUAJ,<br /><span className="text-blue-600">E RIMENDUAR NË ALPE.</span></>
              )}
            </h1>
            <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed">
              {lang === 'en' 
                ? "We don't believe in assembly-line dentistry. At Medident, your surgical journey is a curated fusion of technical precision and restorative serenity."
                : "Ne nuk besojmë në stomatologjinë masive. Në Medident, rrugëtimi juaj kirurgjikal është një shkrirje e kuruar e saktësisë teknike dhe qetësisë restauruese."}
            </p>
          </div>

          {/* Core Journey Sections */}
          <section className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-20 md:mb-40 items-start">
            <div className="lg:col-span-8">
              <div className="bg-slate-50 rounded-[4rem] p-8 md:p-16 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full"></div>
                
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-4 mb-16 relative z-10">
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center space-x-3 px-8 py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === 'upload' ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-500 shadow-sm'}`}
                  >
                    <ImageIcon size={16} />
                    <span>{labels.uploadTab}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('quote')}
                    className={`flex items-center space-x-3 px-8 py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === 'quote' ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-500 shadow-sm'}`}
                  >
                    <Star size={16} />
                    <span>{labels.quoteTab}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reserve')}
                    className={`flex items-center space-x-3 px-8 py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === 'reserve' ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-500 shadow-sm'}`}
                  >
                    <CalendarIcon size={16} />
                    <span>{labels.reserveTab}</span>
                  </button>
                </div>

                {activeTab === 'upload' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Camera size={24} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">{labels.uploadTitle}</h2>
                        <p className="text-slate-500 font-medium">The first step to your new experience.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:border-blue-500 transition-all cursor-pointer relative shadow-inner">
                      <input 
                        type="file" 
                        multiple 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                      />
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all mb-6">
                        <Upload size={32} />
                      </div>
                      <p className="text-slate-900 font-black uppercase text-xs tracking-widest mb-2">
                        {files.length > 0 ? `${files.length} Files Selected` : 'UPLOAD CLINICAL DATA'}
                      </p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">DICOM • Panorame • OPG</p>
                    </div>
                  </div>
                )}

                {activeTab === 'quote' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    {!quoteSubmitted ? (
                      <>
                        <div className="flex items-center space-x-4 mb-8">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <Gem size={24} />
                          </div>
                          <div>
                            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">{labels.quoteTitle}</h2>
                            <p className="text-slate-500 font-medium">Curate your surgical stay in Peja.</p>
                          </div>
                        </div>
                        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setQuoteSubmitted(true); }}>
                          <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedural Focus</label>
                              <select 
                                value={selectedProcedure}
                                onChange={(e) => setSelectedProcedure(e.target.value)}
                                className="w-full bg-white border border-slate-200 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-bold text-slate-900 shadow-sm"
                              >
                                <option value="">Select Path</option>
                                <option value="All-on-X Mastery">All-on-X Mastery</option>
                                <option value="Hollywood Smile Experience">Hollywood Smile Experience</option>
                                <option value="Full Oral Rehab">Full Oral Rehab</option>
                              </select>
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifestyle Add-ons</label>
                              <div className="space-y-3">
                                {['VIP Airport Concierge', 'Mountain Resort Stay', 'Private Cultural Guide'].map((item) => (
                                  <label key={item} className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-100 cursor-pointer hover:border-blue-500 transition-colors shadow-sm">
                                    <input 
                                      type="checkbox" 
                                      onChange={() => toggleAddon(item)}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                                    />
                                    <span className="text-xs font-bold text-slate-700">{item}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-[0.98]">
                            Generate Experience Proposal
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="bg-slate-900 text-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border border-white/5 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center space-x-6 mb-12">
                          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <CheckCircle2 size={32} />
                          </div>
                          <div>
                            <h4 className="text-3xl font-display font-black tracking-tight leading-none mb-2">Proposal Initiated</h4>
                            <p className="text-slate-400 text-sm font-medium">Your curated experience roadmap is being drafted.</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-16">
                          <div className="space-y-6">
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Surgical Protocol</p>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                               <p className="text-xs font-black text-white/50 mb-1">Path</p>
                               <p className="text-lg font-bold">{selectedProcedure || 'General Assessment'}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                               <p className="text-xs font-black text-white/50 mb-1">Lifestyle Layers</p>
                               <p className="text-sm font-bold">{selectedAddons.length > 0 ? selectedAddons.join(', ') : 'Clinical Base Protocol'}</p>
                            </div>
                          </div>
                          <div className="space-y-6">
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Next Stages</p>
                            <div className="space-y-4">
                              {[
                                { step: '1', title: 'Doctor Review', desc: 'Dr. Lendita Nallbani personally reviews your uploaded OPG/CT scans.' },
                                { step: '2', title: 'Personal Contact', desc: 'We WhatsApp you directly to schedule a video call — a real person, not a call center.' },
                                { step: '3', title: 'Travel Dossier', desc: 'Final proposal and logistics guide delivered via PDF.' }
                              ].map((item) => (
                                <div key={item.step} className="flex items-start space-x-4">
                                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{item.step}</div>
                                  <div>
                                     <p className="text-xs font-black text-white">{item.title}</p>
                                     <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => setQuoteSubmitted(false)}
                          className="w-full py-5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all"
                        >
                          Modify Parameters
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reserve' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {!reservationSubmitted ? (
                      <div className="text-center py-20">
                        <CalendarIcon size={64} className="mx-auto text-blue-600 mb-8 opacity-20" />
                        <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight mb-4">Surgical Calendar Sync</h2>
                        <p className="text-slate-500 font-medium mb-12 max-w-md mx-auto">Select your desired window to hold a clinical slot in Peja.</p>
                        <button 
                          onClick={() => {
                            window.open('https://calendar.google.com', '_blank');
                            setReservationSubmitted(true);
                          }}
                          className="bg-blue-600 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-600/20"
                        >
                          Open Google Calendar Slots
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-900 text-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border border-white/5 animate-in zoom-in-95 duration-500 text-center">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/20 mx-auto mb-10">
                          <CheckCircle2 size={40} />
                        </div>
                        <h4 className="text-3xl font-display font-black tracking-tight leading-none mb-6">Slot tentatively held.</h4>
                        <p className="text-slate-400 text-sm font-medium max-w-lg mx-auto mb-12">
                          Your clinical reservation is currently in "Awaiting Verification" status. To finalize, please coordinate with your assigned Liaison.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-6 mb-16 text-left">
                           {[
                             { icon: <Plane size={18} />, title: 'Flight Details', desc: 'Submit your flight number for PRN pickup.' },
                             { icon: <MessageSquare size={18} />, title: 'Liaison Check', desc: 'Verify procedure scope via video call.' },
                             { icon: <RefreshCw size={18} />, title: 'Confirmation', desc: 'Final clinical slot formalization.' }
                           ].map((item, idx) => (
                             <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                               <div className="text-blue-500 mb-4">{item.icon}</div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2">{item.title}</p>
                               <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                             </div>
                           ))}
                        </div>

                        <button 
                          onClick={() => setReservationSubmitted(false)}
                          className="px-12 py-5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all"
                        >
                          Return to Calendar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Manifesto Card */}
            <div className="lg:col-span-4 space-y-10">
              <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl"></div>
                <Zap size={24} className="text-blue-500 mb-8" />
                <h4 className="text-2xl font-display font-black tracking-tight mb-6 leading-tight">The Medident Standard.</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                  "This isn't a dental job. It is an investment in your well-being, framed by the majesty of Peja."
                </p>
                <div className="space-y-6 pt-10 border-t border-white/10">
                   <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500">
                         <ShieldCheck size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">ISO 9001:2015 Clinical Hub</span>
                   </div>
                   <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500">
                         <Mountain size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Holistic Recovery Air</span>
                   </div>
                </div>
              </div>

              <button 
                onClick={onOpenMaterials}
                className="w-full bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] text-left hover:border-blue-600 transition-all group"
              >
                 <Microscope size={24} className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" />
                 <h5 className="text-lg font-display font-black text-slate-900 mb-2">Traceable Standards</h5>
                 <p className="text-xs text-slate-500 font-medium">See the elite materials behind your experience.</p>
              </button>
            </div>
          </section>

          {/* Material Comparison Transparency */}
          <section className="mb-20 md:mb-40">
             <div className="bg-slate-50 border border-slate-200 rounded-[2rem] md:rounded-[3.5rem] p-6 sm:p-12 md:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px]"></div>
                <div className="max-w-3xl mb-16">
                   <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Clinical Transparency</h3>
                   <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tighter mb-8">You See Exactly <span className="text-blue-600">What We Use.</span></h2>
                   <p className="text-slate-500 text-lg font-medium leading-relaxed">
                      We explicitly list our supply chain. Unlike generic clinics that use economy non-branded parts, Medident uses exclusively verified implants and ceramics from Sweden, Germany, and the USA.
                   </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                   {[
                     { brand: 'Astra Tech (Sweden)', type: 'Titanium Implants', why: 'Lifetime stability and minimal bone loss protocol.' },
                     { brand: 'Deprag (Germany)', type: 'High-Translucency Zirconia', why: 'Industrial-grade strength with natural light optics.' },
                     { brand: 'Ivoclar (Liechtenstein)', type: 'e.max® Lithium Disilicate', why: 'The global standard for aesthetic bonding and veneers.' }
                   ].map((item, idx) => (
                     <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <ShieldCheck size={24} />
                        </div>
                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{item.type}</h4>
                        <h5 className="text-2xl font-display font-black text-slate-900 mb-4">{item.brand}</h5>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.why}</p>
                     </div>
                   ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 p-10 rounded-[3rem] text-white">
                   <div className="flex items-center space-x-6">
                      <Microscope size={40} className="text-blue-500 shrink-0" />
                      <div>
                         <p className="text-lg font-bold">Comprehensive Material Comparison</p>
                         <p className="text-sm text-slate-400">See how our institutional materials outperform generic standards.</p>
                      </div>
                   </div>
                   <button 
                    onClick={onOpenMaterials}
                    className="bg-blue-600 hover:bg-white hover:text-slate-900 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
                   >
                      View Comparison Registry
                   </button>
                </div>
             </div>
          </section>

          {/* Rugova Adventure & Healing */}
          <section className="mb-20 md:mb-40">
             <div className="text-center mb-24">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Post-Surgical Healing</h3>
                <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter">The Rugova <span className="text-blue-600">Immersion.</span></h2>
                <p className="text-slate-500 text-lg font-medium mt-6 max-w-2xl mx-auto">
                   Peja is home to the Rugova Mountains, providing a unique micro-climate that is scientifically beneficial for recovery. Adrenaline or Serenity—the choice is yours.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {RUGOVA_EXPERIENCES(lang).map((exp, idx) => (
                  <div key={idx} className="group bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-200 hover:border-blue-500 transition-all flex flex-col h-full">
                     <div className="aspect-[4/5] overflow-hidden">
                        <img 
                          src={exp.image} 
                          alt={exp.title} 
                          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                        />
                     </div>
                     <div className="p-8 flex-1 flex flex-col">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                           {exp.icon}
                        </div>
                        <h4 className="text-xl font-display font-black text-slate-900 mb-3">{exp.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">{exp.desc}</p>
                        <div className="mt-auto flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                           <span>Concierge Service Available</span>
                           <ArrowRight size={12} />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Timeline Section Enhanced */}
          <section className="mb-20 md:mb-40">
             <div className="text-center mb-24">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Surgical Chronology</h3>
                <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter">Your Trip, <span className="text-blue-600">Day by Day.</span></h2>
             </div>

             <div className="flex justify-center space-x-6 mb-16">
                {([1, 2] as const).map(p => (
                  <button 
                    key={p}
                    onClick={() => setTimelinePhase(p)}
                    className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${timelinePhase === p ? 'bg-slate-900 text-white shadow-2xl' : 'bg-slate-50 text-slate-400 hover:text-blue-600'}`}
                  >
                    Phase 0{p}: {p === 1 ? 'Surgical Foundation' : 'Permanent Elegance'}
                  </button>
                ))}
             </div>

             <div className="grid md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-0"></div>
                {(timelinePhase === 1 ? timelineStepsPhase1 : timelineStepsPhase2).map((step, idx) => (
                  <div key={idx} className="relative z-10 p-10 bg-white border border-slate-100 rounded-[3rem] hover:shadow-2xl transition-all group hover:border-blue-200">
                     <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-display font-black mb-6 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                        {step.day.replace('Day ', '')}
                     </div>
                     <h4 className="text-xl font-display font-black text-slate-900 mb-3 tracking-tight">{step.task}</h4>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.detail}</p>
                  </div>
                ))}
             </div>
          </section>

          {/* Hospitality Section Enhanced */}
          <section className="mb-20 md:mb-40">
             <div className="grid lg:grid-cols-2 gap-32 items-center">
                <div className="relative">
                   <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                   <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6">Lifestyle Concierge</h3>
                   <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter mb-10 leading-[0.9]">
                      Luxury that <br />Aids <span className="text-blue-600">Recovery.</span>
                    </h2>
                   <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
                      Your stay in Peja is curated by our hospitality partners to ensure maximum comfort. From post-surgical soft-dining guides to private mountain air excursions, every detail is optimized for your well-being.
                   </p>
                   
                   <div className="space-y-6">
                      {[
                        { title: 'The Dukagjini Wellness', icon: <Hotel size={18} />, text: 'Comfortable partner accommodation in Peja center.' },
                        { title: 'Rugova Healing Air', icon: <Mountain size={18} />, text: 'Fresh mountain air and calm surroundings for recovery.' },
                        { title: 'Bespoke Logistics', icon: <Car size={18} />, text: 'Private PRN transfers and local coordination.' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-500 transition-colors">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                              {item.icon}
                           </div>
                           <div>
                              <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-0.5">{item.title}</p>
                              <p className="text-[10px] font-medium text-slate-500">{item.text}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-6 pt-12">
                      <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl">
                         <img src="https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/rugova-canyon-trail-28km.jpg" className="w-full h-full object-cover" alt="Rugova Nature" />
                      </div>
                      <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                         <p className="text-2xl font-display font-black mb-2">Oxygen Rich</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Recovery Factor</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl">
                         <img src="https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/images%20(4).jpg" className="w-full h-full object-cover" alt="Hotel Luxury" />
                      </div>
                      <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white">
                         <p className="text-2xl font-display font-black mb-2">5-Star</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-white/70">Hospitality Hub</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* Footer Call to Action */}
          <section className="text-center py-20 bg-slate-50 rounded-[4rem] border border-slate-200">
             <h3 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tighter mb-8">Ready to start your <span className="text-blue-600">experience?</span></h3>
             <button 
                onClick={onOpenGuide}
                className="bg-slate-900 text-white px-12 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95"
              >
                Download Patient Protocol
              </button>
          </section>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">
          © 2026 MEDIDENT CONCIERGE • SURGICAL TOURISM HUB
        </p>
      </footer>
    </div>
  );
};

export default TourismPage;