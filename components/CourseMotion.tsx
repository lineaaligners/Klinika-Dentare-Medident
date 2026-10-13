import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Short looping "video" (~12–15 s) for each Academy course: the main steps
// of the course appear one after another with an icon and a progress bar.
type Step = { icon: string; en: string; sq: string };

const STEPS: Record<string, Step[]> = {
  c1: [
    { icon: 'scan', en: 'CBCT diagnosis', sq: 'Diagnoza në CBCT' },
    { icon: 'plan', en: 'Plan from the final tooth', sq: 'Plani nga dhëmbi përfundimtar' },
    { icon: 'drill', en: 'Drilling sequence', sq: 'Sekuenca e shpimit' },
    { icon: 'implant', en: 'MegaGen BlueDiamond placement', sq: 'Vendosja MegaGen BlueDiamond' },
    { icon: 'live', en: 'Live surgery chairside', sq: 'Kirurgji live pranë karriges' },
  ],
  c4: [
    { icon: 'scan', en: 'Sinus anatomy on CBCT', sq: 'Anatomia e sinusit në CBCT' },
    { icon: 'lift', en: 'Lift the membrane', sq: 'Ngritja e membranës' },
    { icon: 'graft', en: 'Bone graft & membrane', sq: 'Grafti kockor & membrana' },
    { icon: 'implant', en: 'Implant in new bone', sq: 'Implanti në kockën e re' },
    { icon: 'live', en: 'Live sinus lift case', sq: 'Rast live i sinus liftit' },
  ],
  c3: [
    { icon: 'scan', en: 'CBCT + intraoral scan', sq: 'CBCT + skanim intraoral' },
    { icon: 'plan', en: '3D implant planning', sq: 'Planifikimi 3D i implantit' },
    { icon: 'print', en: 'Print & sterilise the guide', sq: 'Printimi & sterilizimi i guidës' },
    { icon: 'implant', en: 'Guided placement', sq: 'Vendosja me guidë' },
    { icon: 'tooth', en: 'Immediate loading', sq: 'Ngarkimi i menjëhershëm' },
  ],
  c2: [
    { icon: 'tooth', en: 'Shade selection', sq: 'Zgjedhja e ngjyrës' },
    { icon: 'drill', en: 'Minimal preparation', sq: 'Preparimi minimal' },
    { icon: 'scan', en: 'Digital impression', sq: 'Masa digjitale' },
    { icon: 'tooth', en: 'Crown cementation', sq: 'Çimentimi i kurorës' },
    { icon: 'live', en: 'Final smile', sq: 'Buzëqeshja përfundimtare' },
  ],
};

const Icon: React.FC<{ name: string }> = ({ name }) => {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'scan':
      return <svg viewBox="0 0 24 24" className="w-6 h-6"><path {...p} d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /><path {...p} d="M4 12h16" /></svg>;
    case 'plan':
      return <svg viewBox="0 0 24 24" className="w-6 h-6"><path {...p} d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path {...p} d="M12 12l8-4.5M12 12v9M12 12L4 7.5" /></svg>;
    case 'drill':
      return <svg viewBox="0 0 24 24" className="w-6 h-6"><path {...p} d="M12 2v6M9 8h6l-1 6h-4zM12 14v8" /></svg>;
    case 'implant':
      return <svg viewBox="0 0 24 24" className="w-6 h-6"><path {...p} d="M8 3h8v3H8zM9 6h6l-.5 2.5h-5zM9.5 8.5h5L14 11h-4zM10 11h4l-.5 2.5h-3zM10.5 13.5h3L12 21z" /></svg>;
    case 'lift':
      return <svg viewBox="0 0 24 24" className="w-6 h-6"><path {...p} d="M3 15c3-4 6-6 9-6s6 2 9 6" /><path {...p} d="M12 20V11M9 14l3-3 3 3" /></svg>;
    case 'graft':
      return <svg viewBox="0 0 24 24" className="w-6 h-6"><circle {...p} cx="8" cy="9" r="2" /><circle {...p} cx="15" cy="8" r="1.5" /><circle {...p} cx="12" cy="14" r="2.2" /><circle {...p} cx="17" cy="15" r="1.4" /><circle {...p} cx="7" cy="16" r="1.3" /></svg>;
    case 'print':
      return <svg viewBox="0 0 24 24" className="w-6 h-6"><path {...p} d="M6 9V3h12v6M6 18H4v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7h-2" /><path {...p} d="M7 14h10v7H7z" /></svg>;
    case 'live':
      return <svg viewBox="0 0 24 24" className="w-6 h-6"><circle {...p} cx="12" cy="12" r="3" /><path {...p} d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" className="w-6 h-6"><path {...p} d="M7 3c-2 0-3 2-3 4 0 4 2 6 2.5 10 .3 2 1 4 2 4s1.5-3 2-5c.3-1 .7-1.5 1.5-1.5s1.2.5 1.5 1.5c.5 2 1 5 2 5s1.7-2 2-4C18 13 20 11 20 7c0-2-1-4-3-4-2 0-3 1-5 1S9 3 7 3z" /></svg>;
  }
};

const STEP_MS = 2600;

const CourseMotion: React.FC<{ courseId: string; lang: string }> = ({ courseId, lang }) => {
  const steps = STEPS[courseId];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!steps) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => setI(v => (v + 1) % steps.length), STEP_MS);
    return () => clearInterval(t);
  }, [steps]);
  if (!steps) return null;
  const s = steps[i];
  const label = (lang === 'sq' ? s.sq : s.en);
  return (
    <div className="absolute right-3 top-3 w-[170px] md:top-auto md:right-8 md:bottom-8 md:w-[260px] pointer-events-none">
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 md:p-4 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-200">
            {lang === 'sq' ? 'Hapi' : 'Step'} {i + 1}/{steps.length}
          </span>
          <span className="flex items-center gap-1 text-[9px] font-bold text-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> LIVE
          </span>
        </div>
        <div className="h-11 md:h-14 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={courseId + i}
              initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center gap-3">
              <motion.span className="w-11 h-11 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center"
                initial={{ rotate: -20 }} animate={{ rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                <Icon name={s.icon} />
              </motion.span>
              <span className="text-xs md:text-base font-bold leading-tight">{label}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex gap-1 mt-3">
          {steps.map((_, k) => (
            <div key={k} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
              {k < i && <div className="h-full w-full bg-blue-400" />}
              {k === i && (
                <motion.div key={'p' + i} className="h-full bg-blue-400" initial={{ width: '0%' }} animate={{ width: '100%' }}
                  transition={{ duration: STEP_MS / 1000, ease: 'linear' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseMotion;
