import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShieldCheck, Star, ChevronDown, ChevronRight,
  Check, Car, MapPin, MessageSquare, Award, Clock,
  TrendingDown, Heart, Zap,
} from 'lucide-react';

const WA_LINK =
  'https://wa.me/38349772307?text=Zdravo%2C%20zanima%20me%20zubna%20njega%20u%20Medident%20Peja.';

const USLUGE = [
  {
    name: 'Implanti',
    subtitle: 'Trajna rješenja',
    items: [
      'Premium implanti (Hiossen / MegaGen)',
      '3D CBCT skeniranje',
      'Zirkonijumska krunica',
      'Praćenje putem WhatsApp-a',
    ],
    color: 'bg-slate-50 border-slate-200',
    badge: '',
  },
  {
    name: 'Krunice i veneeri',
    subtitle: 'Savršen osmijeh',
    items: [
      'Zirkonijumske krunice',
      'e.max veneeri (Ivoclar)',
      '3D simulacija osmijeha',
      'Privremene restauracije',
      'Praćenje putem WhatsApp-a',
    ],
    color: 'bg-slate-900 border-slate-900',
    badge: 'Popularno',
    dark: true,
  },
  {
    name: 'Opća stomatologija',
    subtitle: 'Kompletan pregled',
    items: [
      'Rendgen i dijagnoza',
      'Parodontalni tretman',
      'Ekstrakcije',
      'Izbjeljivanje zuba',
      'Ortodoncija',
    ],
    color: 'bg-slate-50 border-slate-200',
    badge: '',
  },
];

const KORACI = [
  {
    icon: <MessageSquare size={22} className="text-blue-600" />,
    n: '1',
    title: 'Kontaktirajte nas',
    desc: 'Pišite nam na WhatsApp — opišite situaciju ili pošaljite rendgenski snimak. Dr. Lendita lično pregleda svaki slučaj.',
  },
  {
    icon: <Zap size={22} className="text-blue-600" />,
    n: '2',
    title: 'Dobijate plan',
    desc: 'Realna osoba — ne call centar — šalje vam individualni plan tretmana i terminski raspored u roku od 24 sata.',
  },
  {
    icon: <Car size={22} className="text-blue-600" />,
    n: '3',
    title: 'Dolazite u Peju',
    desc: 'Rožaje je svega sat vožnje. Prelaz Kula/Čakor — bez vize, samo pasoš. Dočekujemo vas u klinici.',
  },
];

const PUTOVANJE = [
  { day: 'Dan 1', title: 'Dolazak i pregled', desc: 'Stiže, pregled i 3D CBCT skeniranje istog dana. Potvrđujemo plan tretmana.' },
  { day: 'Dan 2', title: 'Tretman', desc: 'Hirurška ili protetska intervencija — lično pod nadzorom Dr. Lendite, vođeno digitalnim 3D planom.' },
  { day: 'Dan 3–4', title: 'Oporavak u Peji', desc: 'Odmarajte se u Peji. Svakodnevna kontrola kliničkog tima. Svježi planinski zrak doline Rugova.' },
  { day: 'Dan 5', title: 'Završetak', desc: 'Privremene ili finalne restauracije — prema tretmanu. Vraćate se kući sa novim osmijehom.' },
];

const FAQS = [
  {
    q: 'Zašto su cijene niže nego u Podgorici?',
    a: 'Niži troškovi poslovanja u Kosovu omogućuju nam da nudimo isti kvalitet materijala i opreme kao klinike u Crnoj Gori — po znatno nižim cijenama. Koristimo iste CE-certificirane implant sisteme i keramiku kao vodeće klinike u regionu.',
  },
  {
    q: 'Treba li mi viza za Kosovo?',
    a: 'Ne. Državljani Crne Gore ulaze u Kosovo isključivo s pasošem — bez vize i bez posebnih dozvola. Prelaz Kula/Čakor je najbliži iz pravca Rožaja.',
  },
  {
    q: 'Koji implant sistemi se koriste?',
    a: 'Koristimo isključivo Hiossen (SAD) i MegaGen (Južna Koreja) — CE-certificirani i FDA-odobreni sistemi identični onima u vodećim evropskim klinikama. Za keramiku koristimo Ivoclar e.max (Lihtenštajn).',
  },
  {
    q: 'Šta ako se desi komplikacija nakon povratka?',
    a: 'Dr. Lendita ostaje dostupna putem WhatsApp-a i e-maila. Manje korekcije mogu se obaviti kod vašeg lokalnog stomatologa — mi koordiniramo. Za komplikacije koje zahtijevaju povratak, troškovi tretmana se ne naplaćuju.',
  },
  {
    q: 'Koliko dugo treba ostati u Peji?',
    a: 'Za krunice i veneere dovoljno je 4–6 dana. Za implante obično su potrebne dvije posjete: prva (~5 dana, postavljanje implanta), druga 3–4 mjeseca kasnije (~4 dana, finalna krunica). Planiramo obje posjete zajedno s vama.',
  },
  {
    q: 'Kako zakazati termin?',
    a: 'Najlačigniy WhatsApp-a — pošaljite nam rendgenski snimak (OPG) ili kratak opis situacije. Dr. Lendita se javlja lično u roku od 24 sata.',
  },
];

const RozajePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Zubna njega u Kosovu — Medident Peja | Konkurentne cijene';
    document.documentElement.lang = 'bs';

    const tags: HTMLLinkElement[] = [];
    const addHreflang = (hreflang: string, href: string) => {
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.hreflang = hreflang;
      el.href = href;
      document.head.appendChild(el);
      tags.push(el);
    };
    addHreflang('bs', 'https://medident-ks.com/mne');
    addHreflang('sr', 'https://medident-ks.com/mne');
    addHreflang('x-default', 'https://medident-ks.com/');

    return () => {
      document.title = prev;
      document.documentElement.lang = 'en';
      tags.forEach((t) => t.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-slate-50/60 to-white" />

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Nazad</span>
          </button>
          <span className="text-lg lg font-display font-black tracking-tighter text-slate-900">
            MEDIDENT<span className="text-blue-600">.</span>MNE
          </span>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-xl uppercase tracking-widest"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <main className="relative z-10 pt-28 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── HERO ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-20 md:mb-32 max-w-5xl"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-8 border border-blue-100">
              <Car size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Za pacijente iz Crne Gore · Rožaje → Peja ~1 sat
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-[72px] font-display font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
              Vrhunska zubna<br />
              njega u Kosovu —<br />
              <span className="text-blue-600">bliže nego mislite.</span>
            </h1>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl mb-10">
              Implanti, krunice, veneeri i potpuna sanacija usta —
              u ISO-9001-certificiranoj klinici, pod ličnim nadzorom Dr. Lendite,
              od 1999. u Peji, Kosovo.
              Cijene konkurentnije od Podgorice.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
              >
                <MessageSquare size={15} /> Besplatna konsultacija
              </a>
              <a
                href="#zasto"
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
              >
                Zašto Medident <ChevronRight size={14} />
              </a>
            </div>
          </motion.div>

          {/* ── TRUST BAR ──────────────────────────────── */}
          <div className="mb-20 md:mb-32 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <ShieldCheck size={20} className="text-blue-600" />, label: 'ISO 9001', sub: 'Certificirani' },
              { icon: <Award size={20} className="text-blue-600" />, label: 'Od 1999.', sub: 'Porodična klinika' },
              { icon: <TrendingDown size={20} className="text-blue-600" />, label: 'Niže od PG', sub: 'Isti kvalitet' },
              { icon: <Heart size={20} className="text-blue-600" />, label: 'Dr. Lendita', sub: 'Lična njega' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {t.icon}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{t.label}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── ZAŠTO MEDIDENT ─────────────────────────── */}
          <section id="zasto" className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">
                Zašto Medident?
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Isti kvalitet,{' '}
                <span className="text-blue-600">konkurentnije cijene.</span>
              </h2>
              <p className="text-slate-500 font-medium mt-4 max-w-xl mx-auto">
                Koristimo iste materijale i implant sisteme kao vodeće klinike u regionu —
                ali niži troškovi poslovanja u Kosovu znače da vi plaćate manje.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <TrendingDown size={24} className="text-blue-600" />,
                  title: 'Povoljnije od Podgorice',
                  desc: 'Naše cijene su znatno niže od cijena crnogorskih klinika — bez ikakvih kompromisa na kvalitetu materijala ili iskustvu tima.',
                },
                {
                  icon: <ShieldCheck size={24} className="text-blue-600" />,
                  title: 'Isti materijali',
                  desc: 'CE-certificirani implant sistemi Hiossen i MegaGen, Ivoclar e.max keramika — identično onom što se koristi u vodećim evropskim klinikama.',
                },
                {
                  icon: <Star size={24} className="text-blue-600" />,
                  title: 'Lična pažnja',
                  desc: 'Dr. Lendita lično pregleda i prihvata svaki slučaj. Znate tačno šta je plan — prije nego što krenete od kuće.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-display font-black text-slate-900 tracking-tight mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── KAKO FUNKCIONIŠE ───────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">U 3 koraka</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Kako <span className="text-blue-600">funkcioniše.</span>
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              {KORACI.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">{s.icon}</div>
                    <span className="text-2xl font-display font-black text-slate-200">{s.n}</span>
                  </div>
                  <h4 className="text-lg font-display font-black text-slate-900 mb-3 tracking-tight">{s.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── USLUGE ─────────────────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Usluge</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Sve na <span className="text-blue-600">jednom mjestu.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {USLUGE.map((pkg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative border rounded-3xl p-8 flex flex-col ${pkg.color}`}
                >
                  {pkg.badge && (
                    <span className="absolute -top-3 left-8 text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-1 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${pkg.dark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {pkg.subtitle}
                  </p>
                  <h3 className={`text-2xl font-display font-black tracking-tight mb-6 ${pkg.dark ? 'text-white' : 'text-slate-900'}`}>
                    {pkg.name}
                  </h3>
                  <ul className="space-y-2.5 flex-1 mb-8">
                    {pkg.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <Check size={13} className={`mt-0.5 flex-shrink-0 ${pkg.dark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={`text-sm font-medium ${pkg.dark ? 'text-slate-300' : 'text-slate-600'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      pkg.dark
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-slate-900 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Upit za cijenu
                  </a>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── PUTOVANJE ──────────────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Vaš boravak, dan po dan</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Vaše putovanje —{' '}
                <span className="text-blue-600">konkretno planirano.</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {PUTOVANJE.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xs mb-4 shadow-lg shadow-blue-600/20">
                    {idx + 1}
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{step.day}</p>
                  <h4 className="text-base font-display font-black text-slate-900 mb-2 tracking-tight">{step.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Putni info */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Car size={18} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-1">Udaljenost od Peće — bez vize, samo pasoš</h4>
                  <p className="text-sm text-slate-500 font-medium">Granični prelaz Kula/Čakor · Radi 24h</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { city: 'Rožaje', time: '~1 sat', km: '~47 km', highlight: true },
                  { city: 'Plav', time: '~2 sata', km: '~66 km', highlight: false },
                  { city: 'Podgorica', time: '~3 sata', km: '~153 km', highlight: false },
                  { city: 'Budva', time: '~4 sata', km: '~214 km', highlight: false },
                  { city: 'Ulcinj', time: '~4,5 sati', km: '~232 km', highlight: false },
                ].map((r) => (
                  <div
                    key={r.city}
                    className={`rounded-2xl p-4 ${r.highlight ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200'}`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${r.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                      {r.city}
                    </p>
                    <p className={`text-lg font-black ${r.highlight ? 'text-white' : 'text-slate-900'}`}>{r.time}</p>
                    <p className={`text-xs font-medium ${r.highlight ? 'text-blue-200' : 'text-slate-400'}`}>{r.km}</p>
                  </div>
                ))}
                <div className="rounded-2xl p-4 bg-white border border-slate-200 flex items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Parking</p>
                    <p className="text-sm font-black text-slate-900">Ispred klinike</p>
                    <p className="text-xs text-slate-400">Besplatno</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── DOKTOR & LOKACIJA ──────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Doctor card */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="/team/lendita-nallbani.jpg"
                    className="w-16 h-16 rounded-2xl object-cover object-top border border-white/20"
                    alt="Dr. Lendita Islami Nallbani"
                  />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Vaša doktorica</p>
                    <p className="text-lg font-display font-black leading-tight">Dr. Lendita I. Nallbani</p>
                    <p className="text-slate-400 text-xs font-medium">Implantologija i oralna hirurgija</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  „Lično pregledam svaki pristigli slučaj. Kada ga prihvatim, znate tačno šta je plan — prije nego što krenete od kuće."
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'ISO 9001', sub: 'Certificirani' },
                    { label: 'Od 1999.', sub: 'Porodična klinika' },
                    { label: '3D CBCT', sub: 'Digitalno planiranje' },
                    { label: 'Hiossen B· MegaGen', sub: 'CE-certificrani' },
                  ].map((b, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <p className="text-xs font-black text-white">{b.label}</p>
                      <p className="text-[10px] text-slate-400">{b.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location cards */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-blue-200 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">Dolina Rugova · 15 min</h4>
                      <p className="text-sm text-slate-500 font-medium">Jedna od najljepših planinskih dolina Balkana — odmor i oporavak u prirodi, tik uz kliniku.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-blue-200 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">Hotel Dukagjini — partnerski hotel</h4>
                      <p className="text-sm text-slate-500 font-medium">U centru Peće, 5 minuta pješice do klinike. Udoban i povoljan smještaj tokom tretmana.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-600 rounded-3xl p-6 text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Car size={18} />
                    </div>
                    <div>
                      <h4 className="font-black mb-1">Dolazite automobilom</h4>
                      <p className="text-sm opacity-80 font-medium">Rožaje → Peja samo sat vožnje. Granica Kula/Čakor — samo pasoš, bez vize. Parking ispred klinike.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SMJEŠTAJ ───────────────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Gdje odsjesti</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Smještaj u Peji —{' '}
                <span className="text-blue-600">povoljno i blizu.</span>
              </h2>
              <p className="text-slate-500 font-medium mt-4 max-w-xl mx-auto">
                Peja nudi odličan izbor smještaja po pristupačnim cijenama — mnogo povoljnije nego u crnogorskim primorskim gradovima.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Airbnb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-md transition-all flex flex-col"
              >
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
                  <span className="text-2xl">🏠</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preporučujemo</p>
                <h3 className="text-xl font-display font-black text-slate-900 tracking-tight mb-3">Airbnb Peja</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1 mb-6">
                  Privatni apartmani u centru Peće — povoljniji od hotela, sa kuhinjom za duži boravak.
                  Mnoge opcije su u pješačkoj udaljenosti od klinike.
                </p>
                <a
                  href="https://www.airbnb.com/s/Peja--Kosovo/homes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-blue-600 text-white transition-all"
                >
                  Pretraži Airbnb →
                </a>
              </motion.div>

              {/* Hotel Dukagjini */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900 border border-slate-900 rounded-3xl p-8 flex flex-col relative"
              >
                <span className="absolute -top-3 left-8 text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-1 rounded-full">
                  Partner klinika
                </span>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-5">
                  <span className="text-2xl">🏨</span>
                </div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Hotel</p>
                <h3 className="text-xl font-display font-black text-white tracking-tight mb-3">Hotel Dukagjini</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed flex-1 mb-6">
                  Partnerski hotel klinike u samom centru Peće. 5 minuta pješice do Medidenta.
                  Udoban smještaj, uključen doručak.
                </p>
                <a
                  href="https://www.booking.com/hotel/xk/dukagjini.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white transition-all"
                >
                  Pogledaj hotel →
                </a>
              </motion.div>

              {/* Booking.com */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-md transition-all flex flex-col"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                  <span className="text-2xl">🛏️</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sve opcije</p>
                <h3 className="text-xl font-display font-black text-slate-900 tracking-tight mb-3">Booking.com</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1 mb-6">
                  Hoteli, pensioni i apartmani u Peji — filtrirajte po udaljenosti od centra za smještaj
                  blizu klinike.
                </p>
                <a
                  href="https://www.booking.com/searchresults.html?ss=Peja%2C+Kosovo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-blue-600 text-white transition-all"
                >
                  Pretraži smještaj →
                </a>
              </motion.div>
            </div>
          </section>

          {/* ── TRANSPORT VODIČ ────────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Organizacija putovanja</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Kako doći —{' '}
                <span className="text-blue-600">sve opcije.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">

              {/* Taksi / kombi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Car size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">Taksi / kombi</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { from: 'Rožaje → Peja', info: 'Lokalni taksisti voze direktno. Ugovorite cijenu unaprijed (~€15–25). Pitajte u hotelu ili na pijaci u Rožajama.' },
                    { from: 'Podgorica → Peja', info: 'Transfer taksijima ili privatnim kombijem. Dogovorite grupni transfer za bolju cijenu (~€50–80 za auto).' },
                  ].map((r) => (
                    <div key={r.from} className="border border-slate-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{r.from}</p>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{r.info}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Autobus */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🚌</span>
                  </div>
                  <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">Autobus — Kujtimi Bus</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { from: 'Podgorica → Peja', info: '8 polazaka sedmično. Direktna linija ~3h, ili via Gjakova ~4h 45min. Cijena od ~€11. Autobuska stanica Podgorica.' },
                    { from: 'Budva → Peja', info: 'Jednom sedmično direktna linija (via Sutomore), ~5h, od ~€22. Ili via Podgorica, ~9h.' },
                  ].map((r) => (
                    <div key={r.from} className="border border-slate-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{r.from}</p>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{r.info}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Lična kola */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="bg-blue-600 rounded-3xl p-8 text-white md:col-span-2"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-black text-lg mb-3 tracking-tight">💡 Naš savjet</h3>
                    <p className="text-blue-100 text-sm font-medium leading-relaxed mb-4">
                      Lična kola su najudobnija opcija — naročito za pacijente iz Rožaja i Plava gdje je vožnja kratka.
                      Crnogorski vozački dokument važi u Kosovu. Benzin je jeftiniji nego u Crnoj Gori.
                      Parking ispred klinike je besplatan.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Granični prelaz', val: 'Kula / Čakor' },
                        { label: 'Radno vrijeme', val: '24h / 7 dana' },
                        { label: 'Potrebno', val: 'Samo pasoš' },
                      ].map((b) => (
                        <div key={b.label} className="bg-white/10 rounded-xl p-3">
                          <p className="text-[10px] text-blue-200 font-black uppercase tracking-widest mb-1">{b.label}</p>
                          <p className="text-sm font-black text-white">{b.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── FAQ ────────────────────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Česta pitanja</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Vaša pitanja,{' '}
                <span className="text-blue-600">iskreni odgovori.</span>
              </h2>
            </div>
            <div className="max-w-3xl mx-auto divide-y divide-slate-100 border border-slate-200 rounded-3xl overflow-hidden bg-white">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 sm:px-8 py-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-black text-slate-900 text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 flex-shrink-0 mt-0.5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 sm:px-8 pb-6 text-sm text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>

          {/* ── FINAL CTA ──────────────────────────────── */}
          <section className="text-center bg-slate-900 rounded-3xl py-20 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Besplatno i bez obaveza</p>
              <h3 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter mb-6">
                Spremni ste za<br />
                <span className="text-blue-400">novi osmijeh?</span>
              </h3>
              <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto">
                Pošaljite nam rendgenski snimak ili opišite situaciju. Dr. Lendita se javlja
                lično u roku od 24 sata — s iskrenom procjenom da li i kako možemo pomoći.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-600/40 active:scale-95"
                >
                  <MessageSquare size={15} /> WhatsApp — Pišite nam
                </a>
                <a
                  href="mailto:info@medident-ks.com"
                  className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  Pošaljite e-mail
                </a>
              </div>
              <p className="text-slate-500 text-xs font-medium mt-8">
                info@medident-ks.com · +383 49 772 307 · Rruga UÇK, Pejë, Kosovo
              </p>
            </div>
          </section>

        </div>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center relative z-10">
        <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.4em]">
          © 2025 KLINIKA DENTARE MEDIDENT · PEJË, KOSOVË · ISO 9001
        </p>
      </footer>
    </div>
  );
};

export default RozajePage;
