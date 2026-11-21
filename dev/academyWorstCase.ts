// DEV-ONLY worst-case fixture for AcademyPage (break-ui). Not used in production builds.
import { Course } from '../types';
import { ACADEMY_COURSES } from '../constants';

const L = (sq: string, en = sq) => ({ sq, en });

export const ACADEMY_WORST: Course[] = [
  {
    ...ACADEMY_COURSES[0],
    id: 'worst-1',
    title: L('Implantologji e avancuar me kirurgji të udhëhequr, augmentim kockor horizontal dhe vertikal dhe ngarkim i menjëhershëm (All-on-X)',
             'Advanced guided implant surgery with horizontal and vertical bone augmentation and immediate loading (All-on-X)'),
    category: '1-on-1',
    instructorId: 'does-not-exist',
    image: '/photos/missing-image-404.jpg',
    date: L('E shtunë 12 – E diel 13 dhjetor 2026 · 08:30–19:00 · Pejë + seancë online e mëpasshme', 'Sat 12 – Sun 13 Dec 2026 · 08:30–19:00 · Pejë + follow-up online session'),
    price: '1.450 € (përfshirë materialet, drekën dhe certifikatën)',
    support: L('3 muaj mbështetje në planifikimin e rasteve përmes WhatsApp dhe videothirrjeve', '3 months of case-planning support via WhatsApp and video calls'),
    requirements: L('Dërgoni licencën e mjekut dentar, një CBCT të një rasti tuajin dhe një përshkrim të shkurtër të përvojës suaj me implante.', 'Send your dental licence, one CBCT of your own case and a short description of your implant experience.'),
    curriculum: ['Planifikim CBCT', 'Dizajn i udhëzuesit kirurgjik', 'Printim 3D', 'Sterilizim', 'Kit i udhëhequr', 'Graft kockor', 'Sinus lift', 'Membrana', 'Sutura', 'Ngarkim i menjëhershëm', 'Provizore PMMA', 'Komplikacionet', 'Dokumentimi', 'Fotografia klinike'],
  },
  { ...ACADEMY_COURSES[1], id: 'worst-2', title: L('Kurs'), description: L(''), date: undefined, price: undefined, support: undefined, requirements: undefined, curriculum: [] },
  { ...ACADEMY_COURSES[2], id: 'worst-3', title: L('Zahnimplantologie-Grundlagenkurs für Allgemeinzahnärzte', 'Zahnimplantologie-Grundlagenkurs für Allgemeinzahnärzte'), price: '0 €' },
];

export const academyDataMode = (): 'demo' | 'worst' | 'empty' | 'one' => {
  if (!import.meta.env.DEV) return 'demo';
  const v = new URLSearchParams(window.location.search).get('data');
  return v === 'worst' || v === 'empty' || v === 'one' ? v : 'demo';
};
