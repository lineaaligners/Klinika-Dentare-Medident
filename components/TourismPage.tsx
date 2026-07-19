import React, { useState } from 'react';
import {
  ArrowLeft, Plane, Upload, Calendar as CalendarIcon, ClipboardCheck,
  CheckCircle2, Camera, Clock, ArrowRight, ShieldCheck, ChevronRight,
  Image as ImageIcon, MessageSquare, MapPin, Check, Download, Microscope,
  Mountain, Car, Hotel, RefreshCw, Globe2, Compass, Star, Zap, User,
  Phone, Heart, Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const toggleAddon = (a: string) => setSelectedAddons(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  const timelinePhase1 = [
    { day: lang === 'en' ? 'Day 1' : 'Dita 1', task: lang === 'en' ? 'Arrival & Meeting Your Doctor' : 'Mbërritja & Takimi me Mjekun', detail: lang === 'en' ? 'We pick you up from the airport. Clinical exam and 3D CBCT scan the same day.' : 'Ju marrim nga aeroporti. Ekzaminim klinik dhe skanim 3D CBCT të njëjtën ditë.' },
    { day: lang === 'en' ? 'Day 2' : 'Dita 2', task: lang === 'en' ? 'Your Surgery' : 'Kirurgjia Juaj', detail: lang === 'en' ? 'Performed personally by Dr. Lendita, guided by your 3D surgical plan.' : 'Kryer personalisht nga Dr. Lendita, e udhëhequr nga plani juaj kirurgjikal 3D.' },
    { day: lang === 'en' ? 'Day 3–5' : 'Dita 3–5', task: lang === 'en' ? 'Rest & Healing' : 'Pushim & Shërim', detail: lang === 'en' ? 'Recover in Pejë and Rugova. Daily check-ins with your doctor.' : 'Rikuperim në Pejë dhe Rugova. Kontroll ditor me mjekun tuaj.' },
    { day: lang === 'en' ? 'Day 6–7' : 'Dita 6–7', task: lang === 'en' ? 'Temporary Restorations' : 'Restaurime Temporare', detail: lang === 'en' ? 'Temporary aesthetic restorations fitted before you fly home.' : 'Restaurime estetike temporare para se të fluturoni.' },
  ];

  const timelinePhase2 = [
    { day: lang === 'en' ? 'Return' : 'Kthim', task: lang === 'en' ? 'Post-Healing Check' : 'Kontrolli pas Shërimit', detail: lang === 'en' ? 'Osseointegration confirmed. Ready for the final phase.' : 'Osseointegrim i konfirmuar. Gati për fazën finale.' },
    { day: lang === 'en' ? 'Day 2–3' : 'Dita 2–3', task: lang === 'en' ? 'Digital Scan' : 'Skanim Digjital', detail: lang === 'en' ? 'Precision full-arch scan for permanent zirconia crowns.' : 'Skanim preciz i harkut të plotë për kurora zirkoni të përhershme.' },
    { day: lang === 'en' ? 'Day 5–6' : 'Dita 5–6', task: lang === 'en' ? 'Final Fitting' : 'Vendosja Finale', detail: lang === 'en' ? 'Permanent restorations placed and adjusted to perfection.' : 'Restaurimet e përhershme vendosen dhe rregullohen.' },
    { day: lang === 'en' ? 'Day 7' : 'Dita 7', task: lang === 'en' ? 'Farewell Check' : 'Kontrolli i Lamtumirës', detail: lang === 'en' ? 'Final review with Dr. Lendita. Aftercare plan in hand.' : 'Rishikim final me Dr. Lendita. Plan kujdesi pas trajtimit.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-slate-50/60 to-white" />

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{lang === 'en' ? 'Back' : 'Kthehu'}</span>
          </button>
          <span className="text-lg font-display font-black tracking-tighter text-slate-900">
            MEDIDENT<span className="text-blue-600">.</span>JOURNEY
          </span>
          <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
            className="text-[9px] font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-xl uppercase tracking-widest">
            WhatsApp
          </a>
        </div>
      </header>

      <main className="relative z-10 pt-28 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── HERO ───────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-20 md:mb-32 max-w-5xl">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-8 border border-blue-100">
              <Plane size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {lang === 'en' ? 'Dental Tourism · Pejë, Kosova' : 'Turizëm Dentar · Pejë, Kosovë'}
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-[76px] font-display font-black text-slate-900 tracking-tighter mb-8 leading-[0.88]">
              {lang === 'en' ? <>Your smile,<br /><span className="text-blue-600">planned just for you.</span></> : <>Buzëqeshja juaj,<br /><span className="text-blue-600">planifikuar për ju.</span></>}
            </h1>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl">
              {lang === 'en'
                ? 'One doctor who knows your case by name. 3D-planned surgery. A family clinic trusted since 1999 — and Rugova Canyon outside the window.'
                : 'Një mjeke që e njeh rastin tuaj me emër. Kirurgji e planifikuar në 3D. Klinikë familjare e besuar që nga 1999 — dhe Kanioni i Rugovës jashtë dritares.'}
            </p>
          </motion.div>

          {/* ── HOW IT WORKS ──────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: <Camera size={20} className="text-blue-600" />, num: '1', title: lang === 'en' ? 'Send your scan' : 'Dërgo skanimin', desc: lang === 'en' ? 'Upload your OPG or CBCT on WhatsApp or the form below. Dr. Lendita reviews every case personally.' : 'Ngarko panoramen ose CBCT në WhatsApp ose formularin. Dr. Lendita rishikon çdo rast personalisht.' },
                { icon: <Phone size={20} className="text-blue-600" />, num: '2', title: lang === 'en' ? 'We call you' : 'Ne ju telefonojmë', desc: lang === 'en' ? 'A real person — not a call center — contacts you to go through the plan and answer every question.' : 'Një person i vërtetë — jo qendër thirrjesh — ju kontakton për të diskutuar planin dhe çdo pyetje.' },
                { icon: <Heart size={20} className="text-blue-600" />, num: '3', title: lang === 'en' ? 'Come and get treated' : 'Ejani dhe trajtohuni', desc: lang === 'en' ? 'We pick you up from Prishtina airport. Surgery, recovery, and a few days in one of Kosovo\'s most beautiful places.' : 'Ju marrim nga aeroporti i Prishtinës. Kirurgji, rikuperim dhe disa ditë në një nga vendet më të bukura të Kosovës.' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">{s.icon}</div>
                    <span className="text-2xl font-display font-black text-slate-200">{s.num}</span>
                  </div>
                  <h4 className="text-lg font-display font-black text-slate-900 mb-3 tracking-tight">{s.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── INTERACTIVE FORM ──────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-8">
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
                  {/* Tabs */}
                  <div className="flex flex-wrap gap-3 mb-10">
                    {([
                      { key: 'upload', label: lang === 'en' ? 'Send Scan' : 'Dërgo Skanimin', icon: <ImageIcon size={14} /> },
                      { key: 'quote', label: lang === 'en' ? 'Get a Quote' : 'Merr Ofertë', icon: <Star size={14} /> },
                      { key: 'reserve', label: lang === 'en' ? 'Book Dates' : 'Rezervo Datat', icon: <CalendarIcon size={14} /> },
                    ] as const).map(tab => (
                      <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400'}`}>
                        {tab.icon}<span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'upload' && (
                      <motion.div key="upload" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">{lang === 'en' ? 'Step 1 of 3' : 'Hapi 1 nga 3'}</p>
                        <h2 className="text-2xl font-display font-black text-slate-900 mb-2">{lang === 'en' ? 'Send us your scan' : 'Na dërgoni skanimin'}</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8">{lang === 'en' ? 'Dr. Lendita reviews every case personally before any commitment.' : 'Dr. Lendita rishikon çdo rast personalisht para çdo angazhimi.'}</p>
                        <label className="group relative flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl cursor-pointer transition-all">
                          <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && setFiles(Array.from(e.target.files))} accept="image/*,.pdf,.dcm" />
                          <div className="w-16 h-16 bg-slate-50 group-hover:bg-blue-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-all mb-4">
                            <Upload size={28} />
                          </div>
                          <p className="text-sm font-black text-slate-900 mb-1">{files.length > 0 ? `${files.length} ${lang === 'en' ? 'files selected' : 'skedarë zgjedhur'}` : (lang === 'en' ? 'Drop your files here' : 'Hidhni skedarët këtu')}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">OPG · CBCT · DICOM · PDF</p>
                        </label>
                        <div className="mt-6 flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                          <MessageSquare size={16} className="text-blue-600 flex-shrink-0" />
                          <p className="text-xs text-blue-700 font-medium">{lang === 'en' ? 'Prefer WhatsApp? Send directly to +383 49 272 803' : 'Preferoni WhatsApp? Dërgoni drejtpërdrejt te +383 49 272 803'}</p>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'quote' && (
                      <motion.div key="quote" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        {!quoteSubmitted ? (
                          <>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">{lang === 'en' ? 'Step 2 of 3' : 'Hapi 2 nga 3'}</p>
                            <h2 className="text-2xl font-display font-black text-slate-900 mb-2">{lang === 'en' ? 'Tell us what you need' : 'Na tregoni çfarë keni nevojë'}</h2>
                            <p className="text-slate-500 text-sm font-medium mb-8">{lang === 'en' ? 'We will prepare a personal quote and send it via WhatsApp.' : 'Do të përgatisim një ofertë personale dhe do ta dërgojmë nëpërmjet WhatsApp.'}</p>
                            <div className="space-y-6">
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{lang === 'en' ? 'Treatment type' : 'Lloji i trajtimit'}</label>
                                <select value={selectedProcedure} onChange={e => setSelectedProcedure(e.target.value)}
                                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 text-sm">
                                  <option value="">{lang === 'en' ? 'Select treatment' : 'Zgjidhni trajtimin'}</option>
                                  <option value="Dental Implants">{lang === 'en' ? 'Dental Implants' : 'Implante Dentare'}</option>
                                  <option value="All-on-4 / All-on-6">All-on-4 / All-on-6</option>
                                  <option value="Zirconia Crowns">{lang === 'en' ? 'Zirconia Crowns' : 'Kurora Zirkoni'}</option>
                                  <option value="Full Smile Rehabilitation">{lang === 'en' ? 'Full Smile Rehabilitation' : 'Rehabilitim i Plotë'}</option>
                                  <option value="Bone Graft / Sinus Lift">{lang === 'en' ? 'Bone Graft / Sinus Lift' : 'Graft Kockor / Sinus Lift'}</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">{lang === 'en' ? 'Add-ons (optional)' : 'Shtesa (opsionale)'}</label>
                                <div className="space-y-2">
                                  {[lang === 'en' ? 'Airport pickup from Prishtina' : 'Marrje nga Aeroporti i Prishtinës', lang === 'en' ? 'Hotel Dukagjini accommodation' : 'Akomodim Hotel Dukagjini', lang === 'en' ? 'Rugova day trip' : 'Ekskursion në Rugova'].map(item => (
                                    <label key={item} className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                                      <input type="checkbox" onChange={() => toggleAddon(item)} className="w-4 h-4 text-blue-600 rounded" />
                                      <span className="text-sm font-medium text-slate-700">{item}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              <button onClick={() => setQuoteSubmitted(true)}
                                className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all">
                                {lang === 'en' ? 'Request Personal Quote' : 'Kërko Ofertë Personale'}
                              </button>
                            </div>
                          </>
                        ) : (
                          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl">
                            <div className="flex items-center gap-4 mb-8">
                              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 size={28} />
                              </div>
                              <div>
                                <h4 className="text-xl font-display font-black">{lang === 'en' ? 'Request received' : 'Kërkesa u mor'}</h4>
                                <p className="text-slate-400 text-sm">{lang === 'en' ? 'We will WhatsApp you within 24 hours.' : 'Do t\'ju kontaktojmë në WhatsApp brenda 24 orëve.'}</p>
                              </div>
                            </div>
                            <div className="space-y-4 mb-8">
                              {[
                                { n: '1', t: lang === 'en' ? 'Dr. Lendita reviews your case' : 'Dr. Lendita rishikon rastin tuaj', d: lang === 'en' ? 'Personally, not a template.' : 'Personalisht, jo model i gatshëm.' },
                                { n: '2', t: lang === 'en' ? 'We contact you on WhatsApp' : 'Ju kontaktojmë në WhatsApp', d: lang === 'en' ? 'A real person with your personal plan.' : 'Një person i vërtetë me planin tuaj personal.' },
                                { n: '3', t: lang === 'en' ? 'You decide' : 'Ju vendosni', d: lang === 'en' ? 'No pressure. Only when you are ready.' : 'Pa presion. Vetëm kur jeni gati.' },
                              ].map(s => (
                                <div key={s.n} className="flex items-start gap-4 bg-white/5 border border-white/10 p-4 rounded-xl">
                                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{s.n}</div>
                                  <div>
                                    <p className="text-xs font-black text-white">{s.t}</p>
                                    <p className="text-[10px] text-slate-400">{s.d}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => setQuoteSubmitted(false)} className="w-full py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                              {lang === 'en' ? 'Edit request' : 'Ndrysho kërkesën'}
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'reserve' && (
                      <motion.div key="reserve" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                        className="text-center py-12">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CalendarIcon size={28} className="text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-display font-black text-slate-900 mb-3">{lang === 'en' ? 'Book your dates' : 'Rezervoni datat'}</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8 max-w-sm mx-auto">
                          {lang === 'en' ? 'The easiest way is to message us on WhatsApp with your preferred dates and we will confirm availability the same day.' : 'Mënyra më e lehtë është të na dërgoni mesazh në WhatsApp me datat e preferuara dhe ne do të konfirmojmë disponibilitetin të njëjtën ditë.'}
                        </p>
                        <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
                          className="inline-flex items-center gap-3 bg-blue-600 hover:bg-slate-900 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg">
                          <span>{lang === 'en' ? 'Message us on WhatsApp' : 'Na shkruani në WhatsApp'}</span>
                          <ArrowRight size={14} />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 rounded-3xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <img src="/team/lendita-nallbani.jpg" className="w-12 h-12 rounded-xl object-cover object-top border border-white/20" alt="Dr. Lendita" />
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{lang === 'en' ? 'Your surgeon' : 'Kirurgja juaj'}</p>
                      <p className="text-sm font-black">Dr. Lendita I. Nallbani</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {lang === 'en'
                      ? '"I review every incoming case myself. If I take it on, you will know exactly what the plan is before you book a flight."'
                      : '"Çdo rast hyrës e rishikoj vetë. Nëse e marr, do të dini saktësisht cili është plani para se të rezervoni fluturimin."'}
                  </p>
                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center"><ShieldCheck size={13} className="text-blue-500" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'ISO 9001 Certified' : 'ISO 9001 I Çertifikuar'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center"><Compass size={13} className="text-blue-500" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Since 1999 · Pejë' : 'Që nga 1999 · Pejë'}</span>
                    </div>
                  </div>
                </div>

                <button onClick={onOpenMaterials} className="w-full text-left bg-slate-50 border border-slate-200 hover:border-blue-300 p-6 rounded-3xl transition-all group">
                  <Microscope size={22} className="text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h5 className="text-base font-display font-black text-slate-900 mb-1">{lang === 'en' ? 'What we use' : 'Çfarë përdorim'}</h5>
                  <p className="text-xs text-slate-500 font-medium">{lang === 'en' ? 'Hiossen, MegaGen, Ivoclar — see our full material registry.' : 'Hiossen, MegaGen, Ivoclar — shihni regjistrin tonë të plotë të materialeve.'}</p>
                </button>

                <button onClick={onOpenGuide} className="w-full text-left bg-blue-600 hover:bg-blue-700 p-6 rounded-3xl transition-all text-white">
                  <Download size={22} className="mb-4" />
                  <h5 className="text-base font-display font-black mb-1">{lang === 'en' ? 'Patient guide' : 'Udhëzuesi i Pacientit'}</h5>
                  <p className="text-xs opacity-80 font-medium">{lang === 'en' ? 'Everything you need to know before you fly.' : 'Gjithçka që duhet të dini para se të fluturoni.'}</p>
                </button>
              </div>
            </div>
          </section>

          {/* ── MATERIALS ─────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 md:p-16">
              <div className="max-w-2xl mb-12">
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">{lang === 'en' ? 'Full transparency' : 'Transparencë e plotë'}</p>
                <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter mb-6">
                  {lang === 'en' ? <>You see exactly<br /><span className="text-blue-600">what we use.</span></> : <>Shikoni saktësisht<br /><span className="text-blue-600">çfarë përdorim.</span></>}
                </h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {lang === 'en' ? 'We list our implant systems and ceramics openly. No surprises.' : 'I listojmë sistemet tona të implanteve dhe qeramikë hapur. Pa surpriza.'}
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                {[
                  { brand: 'Hiossen', origin: 'USA', type: lang === 'en' ? 'Titanium Implants' : 'Implante Titani', detail: lang === 'en' ? 'FDA-cleared · SA Surface · High primary stability' : 'FDA-aprovuar · Sipërfaqe SA · Stabilitet i lartë primar' },
                  { brand: 'MegaGen', origin: 'South Korea', type: lang === 'en' ? 'Titanium Implants' : 'Implante Titani', detail: lang === 'en' ? 'CE certified · AnyRidge · XPEED Surface' : 'CE çertifikuar · AnyRidge · Sipërfaqe XPEED' },
                  { brand: 'Ivoclar', origin: 'Liechtenstein', type: lang === 'en' ? 'e.max Ceramics' : 'Qeramikë e.max', detail: lang === 'en' ? 'Lithium disilicate · Global aesthetic standard' : 'Disilicate litiu · Standard estetik global' },
                ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.origin}</p>
                    <h5 className="text-xl font-display font-black text-slate-900 mb-1">{m.brand}</h5>
                    <p className="text-[10px] font-bold text-blue-600 mb-3">{m.type}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{m.detail}</p>
                  </motion.div>
                ))}
              </div>
              <button onClick={onOpenMaterials} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                <span>{lang === 'en' ? 'Full comparison registry' : 'Regjistri i plotë i krahasimit'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </section>

          {/* ── TIMELINE ──────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">{lang === 'en' ? 'Your trip, day by day' : 'Udhëtimi juaj, ditë pas dite'}</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                {lang === 'en' ? 'Two visits. One result.' : 'Dy vizita. Një rezultat.'}
              </h2>
            </div>
            <div className="flex justify-center gap-4 mb-10">
              {([1, 2] as const).map(p => (
                <button key={p} onClick={() => setTimelinePhase(p)}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${timelinePhase === p ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-700'}`}>
                  {p === 1 ? (lang === 'en' ? 'Visit 1 — Surgery' : 'Vizita 1 — Kirurgji') : (lang === 'en' ? 'Visit 2 — Final' : 'Vizita 2 — Finale')}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {(timelinePhase === 1 ? timelinePhase1 : timelinePhase2).map((step, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xs mb-4 shadow-lg shadow-blue-600/20">
                    {idx + 1}
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{step.day}</p>
                  <h4 className="text-base font-display font-black text-slate-900 mb-2 tracking-tight">{step.task}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.detail}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── RUGOVA ────────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">{lang === 'en' ? 'While you recover' : 'Ndërkohë që rikuperoheni'}</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                {lang === 'en' ? <>Rugova is<br /><span className="text-blue-600">outside your window.</span></> : <>Rugova është<br /><span className="text-blue-600">jashtë dritares suaj.</span></>}
              </h2>
              <p className="text-slate-500 text-lg font-medium mt-4 max-w-xl mx-auto">
                {lang === 'en' ? 'One of Kosovo\'s most spectacular natural environments — 30 minutes from the clinic. Mountains, canyon, fresh air.' : 'Njëra nga mjediset natyrore më spektakolare të Kosovës — 30 minuta nga klinika. Male, kanion, ajër i pastër.'}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {RUGOVA_EXPERIENCES(lang).map((exp, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
                  className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-blue-300 transition-all">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-display font-black text-slate-900 mb-2">{exp.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{exp.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── HOSPITALITY ───────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              <div>
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">{lang === 'en' ? 'Your stay' : 'Qëndrimi juaj'}</p>
                <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
                  {lang === 'en' ? <>Comfort that<br /><span className="text-blue-600">helps you heal.</span></> : <>Rehati që<br /><span className="text-blue-600">ju ndihmon të shëroheni.</span></>}
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: <Hotel size={16} />, title: lang === 'en' ? 'Hotel Dukagjini' : 'Hotel Dukagjini', desc: lang === 'en' ? 'Our partner hotel in central Pejë, walking distance from the clinic.' : 'Hoteli ynë partner në qendër të Pejës, afër klinikës.' },
                    { icon: <Wind size={16} />, title: lang === 'en' ? 'Mountain Air' : 'Ajër Malor', desc: lang === 'en' ? 'Fresh mountain air and calm surroundings — ideal for recovery.' : 'Ajër i pastër malor dhe ambient i qetë — ideal për rikuperim.' },
                    { icon: <Car size={16} />, title: lang === 'en' ? 'Airport Transfer' : 'Transferim nga Aeroporti', desc: lang === 'en' ? 'We pick you up from Prishtina airport and drop you back.' : 'Ju marrim nga Prishtina dhe ju kthejmë.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">{item.icon}</div>
                      <div>
                        <p className="text-sm font-black text-slate-900 mb-0.5">{item.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-10">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-slate-100 shadow-md">
                    <img src="https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/rugova-canyon-trail-28km.jpg" className="w-full h-full object-cover" alt="Rugova" />
                  </div>
                  <div className="bg-slate-900 rounded-3xl p-6 text-white text-center">
                    <p className="text-xl font-display font-black">30 min</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mt-1">{lang === 'en' ? 'To Rugova Canyon' : 'Deri në Kanionin e Rugovës'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-slate-100 shadow-md">
                    <img src="https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/images%20(4).jpg" className="w-full h-full object-cover" alt="Hotel" />
                  </div>
                  <div className="bg-blue-600 rounded-3xl p-6 text-white text-center">
                    <p className="text-xl font-display font-black">Pejë</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/70 mt-1">{lang === 'en' ? 'City Centre' : 'Qendra e Qytetit'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FINAL CTA ──────────────────────── */}
          <section className="text-center bg-slate-50 border border-slate-200 rounded-3xl py-20 px-6">
            <h3 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tighter mb-6">
              {lang === 'en' ? <>Ready to start?<br /><span className="text-blue-600">Send us your scan.</span></> : <>Gati të filloni?<br /><span className="text-blue-600">Na dërgoni skanimin.</span></>}
            </h3>
            <p className="text-slate-500 font-medium mb-10 max-w-lg mx-auto">
              {lang === 'en' ? 'No commitment. Dr. Lendita will review it and let you know if we can help — honestly.' : 'Pa angazhim. Dr. Lendita do ta rishikojë dhe do t\'ju thotë nëse mund të ndihmojmë — sinqerisht.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
                className="bg-slate-900 hover:bg-blue-600 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95">
                WhatsApp — +383 49 772 307
              </a>
              <button onClick={onOpenGuide} className="bg-white border border-slate-200 hover:border-blue-400 text-slate-700 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all">
                {lang === 'en' ? 'Patient Guide PDF' : 'Udhëzuesi i Pacientit PDF'}
              </button>
            </div>
          </section>

        </div>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center relative z-10">
        <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.4em]">
          © 2025 KLINIKA DENTARE MEDIDENT · PEJË, KOSOVË
        </p>
      </footer>
    </div>
  );
};

export default TourismPage;
