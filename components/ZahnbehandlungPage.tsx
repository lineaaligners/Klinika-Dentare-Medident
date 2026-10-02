import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plane, ShieldCheck, Star, ChevronDown, ChevronRight,
  Check, Phone, Car, Hotel, MapPin, MessageSquare, Award, Clock,
  Euro, TrendingDown, Heart, Zap,
} from 'lucide-react';

const WA_LINK = 'https://wa.me/38349772307?text=Guten%20Tag%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Zahnbehandlung%20bei%20Medident.';

const PRICES = [
  { treatment: 'Implantat + Krone', de: 'ab €2.000', ch: 'ab CHF 3.500', med: 'ab €700', save: '~65 %' },
  { treatment: 'All-on-4 (pro Kiefer)', de: 'ab €14.000', ch: 'ab CHF 20.000', med: 'ab €4.500', save: '~68 %' },
  { treatment: 'Zirkon-Krone', de: 'ab €900', ch: 'ab CHF 1.400', med: 'ab €250', save: '~72 %' },
  { treatment: 'Veneer', de: 'ab €800', ch: 'ab CHF 1.200', med: 'ab €220', save: '~72 %' },
  { treatment: 'Zahnbleaching', de: 'ab €400', ch: 'ab CHF 600', med: 'ab €150', save: '~62 %' },
];

const PACKAGES = [
  {
    name: 'Lächeln-Paket',
    subtitle: 'Frisch & strahlend',
    price: 'ab €300',
    items: ['Professionelle Reinigung', 'Ultraschall-Scaling', 'Zahnbleaching (Zoom)', 'Kontrolluntersuchung'],
    color: 'bg-slate-50 border-slate-200',
    badge: '',
  },
  {
    name: 'Implantat-Paket',
    subtitle: 'Vollständige Lösung',
    price: 'ab €900',
    items: ['3D CBCT-Scan', 'Implantat (Hiossen/MegaGen)', 'Zirkon-Krone', 'Transferservice vom Flughafen', 'Follow-up per WhatsApp'],
    color: 'bg-slate-900 border-slate-900',
    badge: 'Beliebt',
    dark: true,
  },
  {
    name: 'Veneer-Paket',
    subtitle: 'Hollywood-Lächeln',
    price: 'ab €1.200',
    items: ['6 Veneers (e.max Ivoclar)', 'Provisorische Veneers', '3D-Smile-Simulation vorab', 'Transferservice', 'Follow-up per WhatsApp'],
    color: 'bg-slate-50 border-slate-200',
    badge: '',
  },
];

const STEPS = [
  { icon: <MessageSquare size={22} className="text-blue-600" />, n: '1', title: 'Scan senden', desc: 'Schicken Sie uns ein OPG-Röntgenbild per WhatsApp oder E-Mail. Dr. Lendita bewertet jeden Fall persönlich.' },
  { icon: <Phone size={22} className="text-blue-600" />, n: '2', title: 'Wir rufen Sie an', desc: 'Eine echte Person — kein Callcenter — kontaktiert Sie mit einem individuellen Behandlungsplan und Kostenvoranschlag.' },
  { icon: <Plane size={22} className="text-blue-600" />, n: '3', title: 'Anreise & Behandlung', desc: 'Wir holen Sie vom Flughafen Prishtina ab. Behandlung, Erholung und ein paar Tage in einer der schönsten Regionen des Balkans.' },
];

const JOURNEY = [
  { day: 'Tag 1', title: 'Ankunft & Untersuchung', desc: 'Wir holen Sie am Flughafen ab. Klinische Untersuchung und 3D-CBCT-Scan am selben Tag.' },
  { day: 'Tag 2', title: 'Ihre Behandlung', desc: 'Operation oder prothetische Behandlung — persönlich von Dr. Lendita, geführt durch Ihren digitalen 3D-Plan.' },
  { day: 'Tag 3–5', title: 'Erholung in Peja', desc: 'Erholen Sie sich in der Rugova-Region. Tägliche Kontrolle durch das Klinikteam. Frische Bergluft, ruhige Umgebung.' },
  { day: 'Tag 6–7', title: 'Abschluss & Heimreise', desc: 'Provisorische oder finale Restaurierungen — je nach Behandlung. Transferservice zurück zum Flughafen.' },
];

const FAQS = [
  {
    q: 'Sind die Implantate und Materialien dieselben wie in Deutschland?',
    a: 'Ja. Wir verwenden ausschließlich CE-zertifizierte und FDA-zugelassene Implantatsysteme: Hiossen (USA), MegaGen (Südkorea) und Ivoclar e.max-Keramik (Liechtenstein) — identische Systeme wie in deutschen Spezialkliniken.',
  },
  {
    q: 'Was passiert, wenn nach meiner Rückkehr etwas nicht stimmt?',
    a: 'Dr. Lendita bleibt per WhatsApp und E-Mail in Kontakt. Kleine Anpassungen können oft durch einen lokalen Zahnarzt vorgenommen werden (wir koordinieren das gerne). Für Komplikationen ist eine zweite Reise in der Regel nicht erforderlich — und falls doch, erstatten wir die Behandlungskosten.',
  },
  {
    q: 'Wie lange muss ich in Kosovo bleiben?',
    a: 'Für einfachere Behandlungen (Kronen, Veneers) reichen 5–7 Tage. Implantate brauchen zwei Reisen: Visit 1 (~7 Tage, Implantateinsetzen) und Visit 2 nach 3–4 Monaten (~5 Tage, finale Krone). Wir planen beide Besuche gemeinsam mit Ihnen.',
  },
  {
    q: 'Gibt es Direktflüge von Deutschland und der Schweiz nach Prishtina?',
    a: 'Ja. Eurowings fliegt direkt von Düsseldorf, München und anderen deutschen Städten nach Prishtina. WizzAir verbindet mehrere deutsche Flughäfen. Aus der Schweiz fliegt Albawings direkt ab Zürich. Flugzeit: ca. 2 Stunden. Vom Flughafen nach Peja sind es weitere 45 Minuten — wir holen Sie ab.',
  },
  {
    q: 'Übernimmt meine deutsche oder schweizerische Krankenversicherung die Kosten?',
    a: 'Die gesetzliche Krankenversicherung (GKV) übernimmt in der Regel keine Kosten für Behandlungen im Ausland. Viele Patienten zahlen selbst — und sparen dabei trotzdem 60–70 % gegenüber deutschen Preisen. Wir stellen Ihnen eine vollständige Kostenaufstellung für Ihre Unterlagen aus.',
  },
  {
    q: 'Spricht das Team Deutsch?',
    a: 'Nicht fließend — wir kommunizieren primär auf Englisch und Albanisch. Viele unserer Patienten aus Deutschland und der Schweiz sind albanischstämmig und sprechen beides. Für deutschsprachige Patienten ohne Albanischkenntnisse helfen wir mit Übersetzungshilfen und klaren schriftlichen Unterlagen.',
  },
  {
    q: 'Wie buche ich einen Termin?',
    a: 'Am einfachsten per WhatsApp: schicken Sie uns Ihr Röntgenbild (OPG) oder eine kurze Beschreibung Ihrer Situation. Dr. Lendita meldet sich persönlich innerhalb von 24 Stunden.',
  },
];

const ZahnbehandlungPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Hreflang + meta for SEO
  useEffect(() => {
    const prev = document.title;
    document.title = 'Zahnbehandlung in Kosovo — Medident Peja | bis zu 70% günstiger';
    document.documentElement.lang = 'de';

    // hreflang tags
    const tags: HTMLLinkElement[] = [];
    const addHreflang = (hreflang: string, href: string) => {
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.hreflang = hreflang;
      el.href = href;
      document.head.appendChild(el);
      tags.push(el);
    };
    addHreflang('de', 'https://medident-ks.com/de');
    addHreflang('de-DE', 'https://medident-ks.com/de');
    addHreflang('de-CH', 'https://medident-ks.com/de');
    addHreflang('de-AT', 'https://medident-ks.com/de');
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
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Zurück</span>
          </button>
          <span className="text-lg font-display font-black tracking-tighter text-slate-900">
            MEDIDENT<span className="text-blue-600">.</span>DE
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

          {/* ── HERO ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-20 md:mb-32 max-w-5xl"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-8 border border-blue-100">
              <Plane size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Zahnarzt-Tourismus · Peja, Kosovo
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-[72px] font-display font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
              Professionelle<br />
              Zahnbehandlung<br />
              <span className="text-blue-600">bis zu 70 % günstiger.</span>
            </h1>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl mb-10">
              Implantate, Kronen, Veneers und Full-Mouth-Rehabilitation —
              in einer ISO-9001-zertifizierten Klinik, persönlich betreut von Dr. Lendita,
              seit 1999 in Peja, Kosovo.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
              >
                <MessageSquare size={15} /> Kostenlos anfragen
              </a>
              <a
                href="#preise"
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
              >
                Preisvergleich <ChevronRight size={14} />
              </a>
            </div>
          </motion.div>

          {/* ── TRUST BAR ────────────────────────────────── */}
          <div className="mb-20 md:mb-32 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <ShieldCheck size={20} className="text-blue-600" />, label: 'ISO 9001', sub: 'Zertifiziert' },
              { icon: <Award size={20} className="text-blue-600" />, label: 'Seit 1999', sub: 'Familienklinik' },
              { icon: <Euro size={20} className="text-blue-600" />, label: 'Bis 70 %', sub: 'Ersparnis' },
              { icon: <Heart size={20} className="text-blue-600" />, label: 'Dr. Lendita', sub: 'Persönliche Betreuung' },
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

          {/* ── PRICE TABLE ──────────────────────────────── */}
          <section id="preise" className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">
                Preisvergleich 2025
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Was Sie <span className="text-blue-600">wirklich sparen.</span>
              </h2>
              <p className="text-slate-500 font-medium mt-4 max-w-xl mx-auto">
                Alle Preise sind Richtwerte. Ihren genauen Kostenvoranschlag erhalten Sie nach
                Einsendung Ihres Röntgenbilds — kostenlos und unverbindlich.
              </p>
            </div>

            {/* Mobile: cards */}
            <div className="md:hidden space-y-4">
              {PRICES.map((row, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
                  <p className="font-black text-slate-900 mb-3">{row.treatment}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">🇩🇪 DE</p>
                      <p className="text-xs font-black text-slate-600">{row.de}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">🇨🇭 CH</p>
                      <p className="text-xs font-black text-slate-600">{row.ch}</p>
                    </div>
                    <div className="bg-blue-600 rounded-xl p-3">
                      <p className="text-[9px] font-bold text-blue-200 uppercase mb-1">🇽🇰 Uns</p>
                      <p className="text-xs font-black text-white">{row.med}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 justify-center">
                    <TrendingDown size={13} className="text-green-600" />
                    <span className="text-xs font-black text-green-700">Ersparnis {row.save}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Behandlung</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">🇩🇪 Deutschland</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">🇨🇭 Schweiz</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-white bg-blue-600">🇽🇰 Medident</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Ersparnis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRICES.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-900">{row.treatment}</td>
                      <td className="px-6 py-4 text-center text-slate-500 font-medium text-sm">{row.de}</td>
                      <td className="px-6 py-4 text-center text-slate-500 font-medium text-sm">{row.ch}</td>
                      <td className="px-6 py-4 text-center font-black text-blue-600 bg-blue-50">{row.med}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-50 border border-green-100 rounded-lg px-2 py-1">
                          <TrendingDown size={11} /> {row.save}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
              * Preise in Deutschland/Schweiz sind Marktdurchschnittswerte 2024. Unsere Preise sind Richtwerte — Ihr persönlicher Kostenvoranschlag nach Einsendung Ihres Röntgenbilds.
            </p>
          </section>

          {/* ── SO FUNKTIONIERT ES ───────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">In 3 Schritten</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                So einfach <span className="text-blue-600">funktioniert es.</span>
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              {STEPS.map((s, i) => (
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

          {/* ── BEHANDLUNGSPAKETE ────────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Behandlungspakete</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Alles aus <span className="text-blue-600">einer Hand.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PACKAGES.map((pkg, i) => (
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
                  <h3 className={`text-2xl font-display font-black tracking-tight mb-1 ${pkg.dark ? 'text-white' : 'text-slate-900'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-3xl font-display font-black mb-6 ${pkg.dark ? 'text-white' : 'text-blue-600'}`}>
                    {pkg.price}
                  </p>
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
                    Paket anfragen
                  </a>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
              Alle Pakete sind als Richtwerte gedacht. Ihr individueller Kostenvoranschlag nach Befund.
            </p>
          </section>

          {/* ── REISEPLAN ────────────────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Ihr Aufenthalt, Tag für Tag</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Ihre Reise — <span className="text-blue-600">konkret geplant.</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {JOURNEY.map((step, idx) => (
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

            {/* Flights info */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Plane size={18} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-2">Direktflüge nach Prishtina</h4>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-600 font-medium">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">🇩🇪 Aus Deutschland</p>
                      <p>Eurowings: Düsseldorf, München, Köln/Bonn</p>
                      <p>WizzAir: Berlin, Dortmund, Hamburg</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">🇨🇭 Aus der Schweiz</p>
                      <p>Albawings: Zürich → Prishtina</p>
                      <p>WizzAir: Genf → Prishtina (saisonal)</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Clock size={11} /> Flugzeit ca. 2 Stunden</span>
                    <span className="flex items-center gap-1.5"><Car size={11} /> Transfer Prishtina → Peja: 45 min (inklusive)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── ARZT & MATERIALIEN ───────────────────────── */}
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
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Ihre Ärztin</p>
                    <p className="text-lg font-display font-black leading-tight">Dr. Lendita I. Nallbani</p>
                    <p className="text-slate-400 text-xs font-medium">Implantologie & Oralchirurgie</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  „Ich überprüfe jeden eingehenden Fall persönlich. Wenn ich ihn annehme, wissen Sie genau, was der Plan ist — bevor Sie einen Flug buchen."
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'ISO 9001', sub: 'Zertifiziert' },
                    { label: 'Seit 1999', sub: 'Familienklinik' },
                    { label: '3D CBCT', sub: 'Digitale Planung' },
                    { label: 'Hiossen · MegaGen', sub: 'CE-zertifiziert' },
                  ].map((b, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <p className="text-xs font-black text-white">{b.label}</p>
                      <p className="text-[10px] text-slate-400">{b.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location card */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-blue-200 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Hotel size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">Hotel Dukagjini</h4>
                      <p className="text-sm text-slate-500 font-medium">Unser Partnerhotel im Zentrum von Peja — zu Fuß zur Klinik, ideale Erholung.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-blue-200 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">Rugova-Schlucht · 30 Min.</h4>
                      <p className="text-sm text-slate-500 font-medium">Eine der schönsten Bergregionen des Balkans — direkt vor Ihrer Haustür während der Erholungszeit.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-600 rounded-3xl p-6 text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Car size={18} />
                    </div>
                    <div>
                      <h4 className="font-black mb-1">Transferservice inklusive</h4>
                      <p className="text-sm opacity-80 font-medium">Wir holen Sie am Flughafen Prishtina ab und bringen Sie am Ende zurück — kostenlos im Implantat- und Veneer-Paket.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────── */}
          <section className="mb-20 md:mb-32">
            <div className="text-center mb-12">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Häufige Fragen</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
                Ihre Fragen, <span className="text-blue-600">ehrlich beantwortet.</span>
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

          {/* ── FINAL CTA ────────────────────────────────── */}
          <section className="text-center bg-slate-900 rounded-3xl py-20 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Kostenlos & unverbindlich</p>
              <h3 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter mb-6">
                Bereit für Ihr<br />
                <span className="text-blue-400">neues Lächeln?</span>
              </h3>
              <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto">
                Schicken Sie uns Ihr OPG-Röntgenbild. Dr. Lendita meldet sich persönlich
                innerhalb von 24 Stunden — mit einem ehrlichen Urteil, ob und wie wir helfen können.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-600/40 active:scale-95"
                >
                  <MessageSquare size={15} /> WhatsApp — Jetzt anfragen
                </a>
                <a
                  href="mailto:info@medident-ks.com"
                  className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  Per E-Mail anfragen
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

export default ZahnbehandlungPage;
