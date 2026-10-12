import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useInView, animate } from 'framer-motion';

type L = Record<string, string>;
export interface BlogExtra {
  stats?: { from: number; to: number; suffix?: L; label: L }[];
  quote?: L;
  timeline?: { year: L; title: L; text: L }[];
}

export const BLOG_EXTRAS: Record<string, BlogExtra> = {
  b1: {
    stats: [
      { from: 0, to: 4000, suffix: { en: '+', sq: '+' }, label: { en: 'implants placed', sq: 'implante të vendosura' } },
      { from: 0, to: 27, suffix: { en: '', sq: '' }, label: { en: 'years in oral surgery', sq: 'vite në kirurgji orale' } },
      { from: 0, to: 45, suffix: { en: ' min', sq: ' min' }, label: { en: 'often under, for one guided implant', sq: 'shpesh nën këtë, për një implant me guidë' } },
    ],
    quote: { en: 'Technology does not replace experience — it amplifies it.', sq: 'Teknologjia nuk e zëvendëson përvojën — e përforcon atë.' },
    timeline: [
      { year: { en: '2004', sq: '2004' }, title: { en: 'The first implant', sq: 'Implanti i parë' }, text: { en: 'A periapical X-ray, a probe and a lot of determination.', sq: 'Një radiografi periapikale, një sondë dhe shumë vendosmëri.' } },
      { year: { en: 'Step 1', sq: 'Hapi 1' }, title: { en: 'CBCT 3D scan', sq: 'Skanimi 3D me CBCT' }, text: { en: 'Nerve, bone height and anatomy seen in three dimensions.', sq: 'Nervi, lartësia e kockës dhe anatomia në tre dimensione.' } },
      { year: { en: 'Step 2', sq: 'Hapi 2' }, title: { en: 'Digital plan', sq: 'Plani digjital' }, text: { en: 'Angle, depth and diameter decided before any instrument is picked up.', sq: 'Këndi, thellësia dhe diametri vendosen para se të merret instrumenti.' } },
      { year: { en: 'Step 3', sq: 'Hapi 3' }, title: { en: '3D-printed guide', sq: 'Guida e printuar 3D' }, text: { en: 'The drill follows exactly the path planned on screen.', sq: 'Freza ndjek saktësisht rrugën e planifikuar në ekran.' } },
      { year: { en: 'Today', sq: 'Sot' }, title: { en: 'Shorter surgery, faster recovery', sq: 'Kirurgji më e shkurtër, shërim më i shpejtë' }, text: { en: 'Smaller incision or none, less swelling, more complex cases possible.', sq: 'Prerje më e vogël ose pa prerje, më pak ënjtje, më shumë raste të mundshme.' } },
    ],
  },
  b3: {
    stats: [
      { from: 16, to: 200, suffix: { en: ' m²', sq: ' m²' }, label: { en: 'from 16 m² in 1999', sq: 'nga 16 m² në 1999' } },
      { from: 1, to: 15, suffix: { en: '', sq: '' }, label: { en: 'people on staff', sq: 'veta në staf' } },
      { from: 0, to: 25, suffix: { en: '+', sq: '+' }, label: { en: 'years of work', sq: 'vite punë' } },
    ],
    quote: { en: 'Managing a clinic is not really about systems. It is about people.', sq: 'Menaxhimi i një klinike nuk ka të bëjë vërtet me sisteme. Ka të bëjë me njerëz.' },
    timeline: [
      { year: { en: '1999', sq: '1999' }, title: { en: '16 square metres', sq: '16 metra katrorë' }, text: { en: 'One dentist, three chairs in the waiting area, no system and no software.', sq: 'Një dentiste, tri karrige në pritore, pa sistem e pa softuer.' } },
      { year: { en: 'The first years', sq: 'Vitet e para' }, title: { en: 'Learning by doing', sq: 'Duke mësuar me punë' }, text: { en: 'Every problem solved for the first time, with no one to ask.', sq: 'Çdo problem zgjidhej për herë të parë, pa pasur kë të pyesje.' } },
      { year: { en: 'The second hire', sq: 'Punonjësi i dytë' }, title: { en: 'It is about people', sq: 'Ka të bëjë me njerëz' }, text: { en: 'Responsible not just for the work, but for another person.', sq: 'Përgjegjëse jo vetëm për punën, por edhe për një njeri tjetër.' } },
      { year: { en: 'Today', sq: 'Sot' }, title: { en: '200 square metres', sq: '200 metra katrorë' }, text: { en: 'Fifteen staff, a full surgical suite, an academy, patients from abroad.', sq: 'Pesëmbëdhjetë veta staf, sallë kirurgjike, akademi, pacientë nga jashtë.' } },
    ],
  },
  b4: {
    stats: [
      { from: 1999, to: 2026, suffix: { en: '', sq: '' }, label: { en: 'the clinic since 1999', sq: 'klinika që nga 1999' } },
      { from: 0, to: 4000, suffix: { en: '+', sq: '+' }, label: { en: 'implants placed', sq: 'implante të vendosura' } },
      { from: 1990, to: 2004, suffix: { en: '', sq: '' }, label: { en: 'first implant by a woman in Kosovo', sq: 'implanti i parë nga një grua në Kosovë' } },
    ],
    quote: { en: 'I did not plan to be here. But I chose to stay.', sq: 'Nuk e kisha planifikuar të jem këtu. Por zgjodha të qëndroj.' },
    timeline: [
      { year: { en: 'Sarajevo', sq: 'Sarajevë' }, title: { en: 'Studies interrupted', sq: 'Studimet e ndërprera' }, text: { en: 'A dental student when the war started.', sq: 'Studente e stomatologjisë kur filloi lufta.' } },
      { year: { en: 'Istanbul', sq: 'Stamboll' }, title: { en: 'Çapa University', sq: 'Universiteti Çapa' }, text: { en: 'Dental degree at one of the most demanding faculties in Turkey.', sq: 'Diploma në një nga fakultetet më kërkuese në Turqi.' } },
      { year: { en: '1999', sq: '1999' }, title: { en: 'Medident opens', sq: 'Hapet Medident' }, text: { en: 'Sixteen square metres, one room, in Pejë.', sq: 'Gjashtëmbëdhjetë metra katrorë, një dhomë, në Pejë.' } },
      { year: { en: '2004', sq: '2004' }, title: { en: 'A first for Kosovo', sq: 'E para në Kosovë' }, text: { en: 'The first dental implant placed by a woman in Kosovo.', sq: 'Implanti i parë dentar i vendosur nga një grua në Kosovë.' } },
      { year: { en: '2017', sq: '2017' }, title: { en: 'Carrying on', sq: 'Duke vazhduar' }, text: { en: 'A year of loss — and the clinic, the patients and the children kept going.', sq: 'Një vit humbjeje — dhe klinika, pacientët e fëmijët vazhduan.' } },
      { year: { en: 'Today', sq: 'Sot' }, title: { en: 'Still here', sq: 'Ende këtu' }, text: { en: 'Still operating, still planning every case in 3D.', sq: 'Ende operon, ende planifikon çdo rast në 3D.' } },
    ],
  },
  b5: {
    quote: { en: 'Not hand parts of it to someone else and hope for the best.', sq: 'Jo t\'ia lësh pjesë të punës dikujt tjetër dhe të shpresosh për më të mirën.' },
    timeline: [
      { year: { en: 'Before', sq: 'Më parë' }, title: { en: 'Referral out', sq: 'Dërgim jashtë' }, text: { en: 'Orthodontic patients left for months and we never fully knew what happened.', sq: 'Pacientët ortodontikë largoheshin për muaj dhe s\'e dinim plotësisht çka ndodhte.' } },
      { year: { en: 'Linea', sq: 'Linea' }, title: { en: 'Aligners come in-house', sq: 'Alignerët brenda klinikës' }, text: { en: 'Linea Aligners launches in Kosovo and joins the Medident workflow.', sq: 'Linea Aligners lansohet në Kosovë dhe hyn në punën e Medident.' } },
      { year: { en: 'Now', sq: 'Tani' }, title: { en: 'One clinic, one plan', sq: 'Një klinikë, një plan' }, text: { en: 'Scan, plan and show the outcome first — alignment and restorations together.', sq: 'Skanim, plan dhe rezultati paraprakisht — rreshtimi dhe restaurimet bashkë.' } },
    ],
  },
};

export const ReadingProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return <motion.div style={{ scaleX, transformOrigin: '0%' }} className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[100]" />;
};

export const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: 'easeOut' }} className={className}>
    {children}
  </motion.div>
);

const CountUp: React.FC<{ from: number; to: number; suffix?: string }> = ({ from, to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(from);
  const isYear = from > 1000;
  useEffect(() => {
    if (!inView) return;
    const c = animate(from, to, { duration: isYear ? 1.4 : 1.8, ease: 'easeOut', onUpdate: v => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, from, to, isYear]);
  return <span ref={ref}>{isYear ? val : val.toLocaleString('de-DE')}{suffix}</span>;
};

export const BlogStats: React.FC<{ extra?: BlogExtra; lang: string }> = ({ extra, lang }) => {
  if (!extra?.stats?.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-12 not-prose">
      {extra.stats.map((s, i) => (
        <Reveal key={i} delay={i * 0.12} className="bg-slate-900 text-white rounded-2xl p-6">
          <div className="text-4xl md:text-5xl font-display font-black tracking-tight text-blue-400"><CountUp from={s.from} to={s.to} suffix={s.suffix?.[lang] ?? ''} /></div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-2">{s.label[lang]}</div>
        </Reveal>
      ))}
    </div>
  );
};

export const BlogQuote: React.FC<{ extra?: BlogExtra; lang: string }> = ({ extra, lang }) => {
  if (!extra?.quote) return null;
  return (
    <motion.blockquote initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: 'easeOut' }}
      className="not-prose my-14 py-10 px-8 md:px-12 border-l-8 border-blue-600 bg-blue-50 rounded-r-3xl">
      <p className="text-2xl md:text-4xl font-display font-black text-slate-900 leading-tight tracking-tight">“{extra.quote[lang]}”</p>
    </motion.blockquote>
  );
};

export const BlogTimeline: React.FC<{ extra?: BlogExtra; lang: string }> = ({ extra, lang }) => {
  if (!extra?.timeline?.length) return null;
  return <TimelineInner extra={extra} lang={lang} />;
};

const TimelineInner: React.FC<{ extra: BlogExtra; lang: string }> = ({ extra, lang }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <div className="not-prose my-16">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8">{lang === 'en' ? 'Timeline' : 'Rrugëtimi'}</p>
      <div ref={ref} className="relative pl-10">
        <div className="absolute left-3 top-0 bottom-0 w-[3px] bg-slate-200 rounded" />
        <motion.div style={{ scaleY, transformOrigin: 'top' }} className="absolute left-3 top-0 bottom-0 w-[3px] bg-blue-600 rounded" />
        <div className="space-y-10">
          {extra.timeline!.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: 'easeOut' }} className="relative">
              <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                className="absolute -left-[35px] top-1 w-5 h-5 rounded-full bg-white border-4 border-blue-600" />
              <div className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight">{t.year[lang]}</div>
              <div className="text-sm font-black uppercase tracking-widest text-blue-600 mt-1">{t.title[lang]}</div>
              <p className="text-slate-600 mt-2 leading-relaxed">{t.text[lang]}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
