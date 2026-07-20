
import React from 'react';
import { Shield, Sparkles, Plane, Hotel, Activity, Award, Zap, BookOpen, Clock, ShieldCheck, Mountain, Compass, Wind, Utensils } from 'lucide-react';
import { Service, Testimonial, BeforeAfter, Doctor, BlogPost, Course } from './types';

export const ACADEMY_BENEFITS = (lang: 'en' | 'sq') => [
  {
    icon: <Zap className="w-6 h-6" />,
    title: lang === 'en' ? 'Immediate ROI & Practice Skills' : 'ROI i Menjëhershëm dhe Aftësi Praktike',
    description: lang === 'en' ? 'Our curriculum is built for "Monday-morning readiness." Acquire specialized surgical and prosthetic skills that translate directly into clinical revenue and patient satisfaction from day one.' : 'Kurrikula jonë është ndërtuar për "gatishmëri të menjëhershme". Përfitoni aftësi të specializuara që përkthehen direkt në të ardhura klinike që nga dita e parë.'
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: lang === 'en' ? 'High-Fidelity Hands-on Workshops' : 'Punëtori Praktike me Saktësi të Lartë',
    description: lang === 'en' ? 'Go beyond theory. Train on high-fidelity anatomical models and observe live surgical cases in our ISO-certified clinical environment under the direct supervision of world-class experts.' : 'Shkoni përtej teorisë. Trajnohuni në modele anatomike dhe vëzhgoni raste kirurgjikale live në mjedisin tonë të certifikuar nga ISO nën mbikëqyrjen e ekspertëve.'
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: lang === 'en' ? 'Institutional Certification' : 'Certifikimi Institucional',
    description: lang === 'en' ? 'Earn prestigious Medident Academy certifications and digital badges. Our credentials validate your mastery of advanced surgical protocols and CAD/CAM restorative excellence.' : 'Fitoni certifikata prestigjioze të Akademisë Medident. Kredencialet tona vërtetojnë mjeshtërinë tuaj në protokollet e avancuara kirurgjikale dhe CAD/CAM.'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: lang === 'en' ? 'Agile & Flexible Learning Tiers' : 'Nivele Fleksibile dhe Agjile të Mësimit',
    description: lang === 'en' ? 'Choose the tier that fits your career stage: Intensive on-site workshops, personalized 1-on-1 surgical mentorship, or high-impact online modules accessible anywhere in the world.' : 'Zgjidhni nivelin që i përshtatet karrierës suaj: Punëtori intensive në vend, mentorim kirurgjikal 1-on-1, ose module online të aksesueshme kudo në botë.'
  }
];

export const SERVICES: Service[] = [
  {
    id: '1',
    title: { en: 'Dental Implants', sq: 'Implante Dentare' },
    description: {
      en: 'Hiossen (USA) and MegaGen implant systems. Every case starts with a CBCT 3D scan — Dr. Lendita plans the exact angle, depth, and position before surgery. A 3D-printed surgical guide ensures the implant goes exactly where it was planned. Flapless when possible: less swelling, faster recovery.',
      sq: 'Sisteme Hiossen (SHBA) dhe MegaGen. Çdo rast fillon me skanim 3D CBCT — Dr. Lendita planifikon këndin, thellësinë dhe pozicionin e saktë para kirurgjisë. Udhëzuesi kirurgjikal i printuar 3D siguron se implanti shkon saktësisht ku u planifikua. Flapless kur është e mundur: më pak ënjtje, rikuperim më i shpejtë.'
    },
    icon: 'Activity',
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/487392382_1282806653292502_7830483863337131816_n.jpg',
    badge: { en: 'Dr. Lendita · Lead Surgeon', sq: 'Dr. Lendita · Kirurge Kryesore' },
    highlight: { en: '4,000+ placed since 2004', sq: '4,000+ të vendosura që nga 2004' }
  },
  {
    id: '2',
    title: { en: 'All-on-4 / All-on-6', sq: 'All-on-4 / All-on-6' },
    description: {
      en: 'Full arch rehabilitation on 4 or 6 implants — the solution for patients who have lost most or all of their teeth. Planned entirely in 3D before any surgery. Temporary teeth placed the same day; permanent zirconia arch fitted once osseointegration is confirmed.',
      sq: 'Rehabilitim i plotë i harkut mbi 4 ose 6 implante — zgjidhja për pacientët që kanë humbur shumicën ose të gjithë dhëmbët. Planifikim i plotë 3D para çdo kirurgjie. Dhëmbë temporarë vendosen të njëjtën ditë; harku permanent zirkoni vendoset pasi osseointegrimet konfirmohet.'
    },
    icon: 'Layers',
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/522466288_18258761737303287_2709900497171704416_n.jpg',
    badge: { en: 'Full Arch Rehabilitation', sq: 'Rehabilitim i Harkut të Plotë' },
    highlight: { en: 'Same-day temporaries', sq: 'Temporare të njëjtën ditë' }
  },
  {
    id: '3',
    title: { en: 'Oral Surgery', sq: 'Kirurgji Orale' },
    description: {
      en: 'Led by Dr. Lendita Islami Nallbani — the first woman in Kosovo to place a dental implant (2004). Complex extractions, sinus lift, bone graft, guided bone regeneration. All surgical cases are reviewed by Dr. Lendita personally before the patient books.',
      sq: 'E udhëhequr nga Dr. Lendita Islami Nallbani — gruaja e parë në Kosovë që vendosi implant dentar (2004). Ekstraksione komplekse, sinus lift, graft kockor, regenerim kockor i udhëhequr. Të gjitha rastet kirurgjikale rishikohen nga Dr. Lendita personalisht para se pacienti të rezervojë.'
    },
    icon: 'Shield',
    image: '/photos/lendita-operating.jpg',
    badge: { en: 'Dr. Lendita · Specialist', sq: 'Dr. Lendita · Specialiste' },
    highlight: { en: '27 years of experience', sq: '27 vite përvojë' }
  },
  {
    id: '4',
    title: { en: 'Zirconia Crowns', sq: 'Kurora Zirkoni' },
    description: {
      en: 'Led by Dr. Faton Loci. Shade matched in natural light, window light, and clinical light — then communicated to the lab with photographs, written notes, and calls. The result should be a crown that disappears into the smile. Not a white rectangle.',
      sq: 'E udhëhequr nga Dr. Faton Loci. Ngjyra përpunohet në dritë natyrale, dritë dritareje dhe dritë klinike — pastaj komunikohet me laboratorin me fotografi, shënime dhe telefonata. Rezultati duhet të jetë një kurorë që zhduket në buzëqeshje. Jo drejtkëndësh i bardhë.'
    },
    icon: 'Sparkles',
    image: '/photos/faton-aesthetic-closeup.jpg',
    badge: { en: 'Dr. Faton · Aesthetic Lead', sq: 'Dr. Faton · Kreu Estetik' },
    highlight: { en: 'Natural shade matching', sq: 'Përputhje natyrale e ngjyrës' }
  },
  {
    id: '5',
    title: { en: 'Smile Makeover', sq: 'Transformim i Buzëqeshjes' },
    description: {
      en: 'Full aesthetic rehabilitation combining crowns, veneers, and composite bonding — designed around your face, your natural smile, and your skin tone. Before anything is cemented, you approve the temporary result. Only then do we go final.',
      sq: 'Rehabilitim i plotë estetik duke kombinuar kurora, faseta dhe bonding kompozit — projektuar rreth fytyrës, buzëqeshjes natyrale dhe tonit të lëkurës. Para se të çimentohet çdo gjë, ju aprovoni rezultatin temporar. Vetëm atëherë kalojmë në finale.'
    },
    icon: 'Star',
    image: '/photos/faton-smile-after.jpg',
    badge: { en: 'Full Aesthetic Workflow', sq: 'Rrjedhë e Plotë Estetike' },
    highlight: { en: 'Patient-approved before final', sq: 'I aprovuar para finalit' }
  },
  {
    id: '6',
    title: { en: 'General Dentistry', sq: 'Stomatologji e Përgjithshme' },
    description: {
      en: 'Fillings, root canals, scaling, paediatric dentistry, and preventive care. The same standard of care applies to every treatment, not just surgical cases.',
      sq: 'Plombe, kanale rrënjore, pastrimi, stomatologji pediatrike dhe kujdes preventiv. I njëjti standard kujdesi zbatohet për çdo trajtim, jo vetëm për rastet kirurgjikale.'
    },
    icon: 'Heart',
    image: '/photos/faton-clinical.jpg',
    badge: { en: 'All ages welcome', sq: 'Të gjitha moshat të mirëpritura' },
    highlight: { en: 'Since 1999', sq: 'Që nga 1999' }
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Lendita Nallbani',
    role: { en: 'Oral Surgery Specialist & Implantologist', sq: 'Specialiste e Kirurgjisë Orale, Implantologe' },
    bio: {
      en: 'Oral surgery specialist and implantologist leading the surgical team at Klinika Medident, a family dental clinic founded in Pejë in 1999.',
      sq: 'Specialiste e Kirurgjisë Orale dhe Implantologe, udhëheqëse e ekipit kirurgjik në Klinikën Dentare Medident, klinikë familjare e themeluar në Pejë në vitin 1999.'
    },
    image: '/team/lendita-nallbani.jpg',
    specialties: ['Oral Surgery', 'Implantology'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina', 'Specialization in Oral Surgery'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës', 'Specializimi në Kirurgji Orale']
    },
    experience: { en: 'Founder & Chief Oral Surgeon', sq: 'Themeluese & Kryekirurge Orale' },
    languages: ['Albanian', 'English'],
    certifications: ['Licensed Oral Surgery Specialist']
  },
  {
    id: '2',
    name: 'Dr. Faton Loci',
    role: { en: 'Dentist', sq: 'Stomatolog' },
    bio: {
      en: 'Dentist and part of the clinical leadership at Klinika Medident, working alongside Dr. Lendita Nallbani on day-to-day clinical care.',
      sq: 'Stomatolog dhe pjesë e udhëheqjes klinike në Klinikën Dentare Medident, duke punuar krah për krah me Dr. Lendita Nallbani në kujdesin klinik ditor.'
    },
    image: '/team/faton-loci.jpg',
    specialties: ['General Dentistry'],
    education: {
      en: ['Faculty of Dental Medicine'],
      sq: ['Fakulteti i Mjekësisë Dentare']
    },
    experience: { en: 'Clinical practice at Klinika Medident', sq: 'Praktikë klinike në Klinikën Dentare Medident' },
    languages: ['Albanian', 'English'],
    certifications: ['Licensed Dentist']
  },
  {
    id: '3',
    name: 'Dr. Muharrem Thaqi',
    role: { en: 'Dentist', sq: 'Stomatolog' },
    bio: {
      en: 'Dentist at Klinika Medident, providing general dental care to patients in Pejë and the surrounding region.',
      sq: 'Stomatolog në Klinikën Dentare Medident, duke ofruar kujdes stomatologjik të përgjithshëm për pacientët në Pejë dhe rajonin përreth.'
    },
    image: '/team/muharrem-thaqi.jpg',
    specialties: ['General Dentistry'],
    education: {
      en: ['Faculty of Dental Medicine'],
      sq: ['Fakulteti i Mjekësisë Dentare']
    },
    experience: { en: 'Clinical practice at Klinika Medident', sq: 'Praktikë klinike në Klinikën Dentare Medident' },
    languages: ['Albanian', 'English'],
    certifications: ['Licensed Dentist']
  },
  {
    id: '4',
    name: 'Dr. Fjolla Kelmendi',
    role: { en: 'Dentist', sq: 'Stomatologe' },
    bio: {
      en: 'Dentist at Klinika Medident, providing general dental care to patients in Pejë and the surrounding region.',
      sq: 'Stomatologe në Klinikën Dentare Medident, duke ofruar kujdes stomatologjik të përgjithshëm për pacientët në Pejë dhe rajonin përreth.'
    },
    image: '/team/fjolla-kelmendi.jpg',
    specialties: ['General Dentistry'],
    education: {
      en: ['Faculty of Dental Medicine'],
      sq: ['Fakulteti i Mjekësisë Dentare']
    },
    experience: { en: 'Clinical practice at Klinika Medident', sq: 'Praktikë klinike në Klinikën Dentare Medident' },
    languages: ['Albanian', 'English'],
    certifications: ['Licensed Dentist']
  },
  {
    id: '5',
    name: 'Dr. Arbresha Nila',
    role: { en: 'Dentist', sq: 'Stomatologe' },
    bio: {
      en: 'Dentist at Klinika Medident, providing general dental care to patients in Pejë and the surrounding region.',
      sq: 'Stomatologe në Klinikën Dentare Medident, duke ofruar kujdes stomatologjik të përgjithshëm për pacientët në Pejë dhe rajonin përreth.'
    },
    image: '/team/arbresha-nila.jpg',
    specialties: ['General Dentistry'],
    education: {
      en: ['Faculty of Dental Medicine'],
      sq: ['Fakulteti i Mjekësisë Dentare']
    },
    experience: { en: 'Clinical practice at Klinika Medident', sq: 'Praktikë klinike në Klinikën Dentare Medident' },
    languages: ['Albanian', 'English'],
    certifications: ['Licensed Dentist']
  },
  {
    id: '6',
    name: 'Arjeta Muhaxheri Morina',
    role: { en: 'Clinic Manager', sq: 'Menaxhere e Klinikës' },
    bio: {
      en: 'Arjeta has been at Medident since 1999 — since the very first day, when the clinic was just one doctor and a shared determination to build something lasting. She has seen every chapter of this clinic: the growth, the new faces, the new equipment, the thousands of patients who have walked through the door. She holds everything together so the doctors can do their work.',
      sq: 'Arjeta është në Medident që nga viti 1999 — që nga dita e parë, kur klinika ishte vetëm një mjeke dhe një vendosmëri e përbashkët për të ndërtuar diçka të qëndrueshme. Ajo ka parë çdo kapitull të kësaj klinike: rritjen, fytyrat e reja, pajisjet e reja, mijëra pacientët që kanë kaluar nëpër derë. Ajo mban gjithçka bashkë që mjekët të mund të bëjnë punën e tyre.'
    },
    image: '/team/arjeta-manager.jpg',
    specialties: ['Clinic Operations', 'Patient Coordination', 'Team Management'],
    education: {
      en: ['Klinika Dentare Medident — since 1999'],
      sq: ['Klinika Dentare Medident — që nga 1999']
    },
    experience: { en: '25+ years running Medident alongside Dr. Lendita', sq: '25+ vite duke drejtuar Medidentin krah Dr. Lenditës' },
    languages: ['Albanian'],
    certifications: ['Clinic Manager — Klinika Dentare Medident']
  }
];

export const RUGOVA_EXPERIENCES = (lang: 'en' | 'sq') => [
  {
    title: lang === 'en' ? 'Via Ferrata Climbing' : 'Via Ferrata: Ngjitja',
    desc: lang === 'en' ? 'Scale the vertical cliffs of Rugova Canyon with professional gear and guides. A safe yet exhilarating adrenaline peak.' : 'Ngjituni në shkëmbinjtë vertikalë të Kanionit të Rugovës me pajisje profesionale dhe guida. Një kulm adrenaline i sigurt.',
    icon: <Mountain className="w-6 h-6" />,
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/122000439_1705318082948560_4310788433208396905_n.webp'
  },
  {
    title: lang === 'en' ? 'The Great Zip Line' : 'Zip Line-i i Madh',
    desc: lang === 'en' ? 'Fly across the gorge on one of the longest zip lines in the Balkans, offering a bird\'s-eye view of the Rugova river.' : 'Fluturoni mbi grykë në një nga vijat më të gjata në Ballkan, duke ofruar një pamje mahnitëse të lumit të Rugovës.',
    icon: <Wind className="w-6 h-6" />,
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/Zipline-Peja-4.webp'
  },
  {
    title: lang === 'en' ? 'Hiking Kuqishta Lakes' : 'Liqenet e Kuqishtës',
    desc: lang === 'en' ? 'A serene trek to the glacial lakes at 1,900m altitude. Fresh mountain air, perfect for gentle recovery days.' : 'Një ecje qetësuese drejt liqeneve akullnajore në 1,900m lartësi. Nivelet e larta të oksigjenit përshpejtojnë shërimin.',
    icon: <Compass className="w-6 h-6" />,
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/rugova-canyon-trail-28km.jpg'
  },
  {
    title: lang === 'en' ? 'Traditional Slow-Food' : 'Ushqimi Tradicional',
    desc: lang === 'en' ? 'Taste the famous "Fli" and organic mountain cheese. A culinary heritage that supports recovery with pure nutrition.' : 'Shijoni "Flinë" e famshme dhe djathin organik të bjeshkëve. Një trashëgimi kulinare që mbështet shërimin.',
    icon: <Utensils className="w-6 h-6" />,
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/rugova-canyon-trail-28km.jpg'
  }
];

export const TOURISM_STEPS = (lang: 'en' | 'sq') => [
  {
    title: lang === 'en' ? 'Clinical Assessment' : 'Vlerësimi Klinik',
    description: lang === 'en' ? 'Dr. Lendita personally reviews your X-rays and plans your new smile.' : 'Dr. Lendita i rishikon personalisht radiografitë tuaja dhe planifikon buzëqeshjen tuaj të re.',
    icon: <Sparkles className="w-8 h-8 text-blue-600" />
  },
  {
    title: lang === 'en' ? 'Logistical Protocol' : 'Protokolli Logjistik',
    description: lang === 'en' ? 'VIP transit from PRN Airport to Peja.' : 'Transit VIP nga Aeroporti i PRN në Pejë.',
    icon: <Plane className="w-8 h-8 text-blue-600" />
  },
  {
    title: lang === 'en' ? 'Institutional Stay' : 'Qëndrimi Institucional',
    description: lang === 'en' ? 'Luxury partner hotels in the heart of Peja.' : 'Hotele partnere luksoze në zemër të Pejës.',
    icon: <Hotel className="w-8 h-8 text-blue-600" />
  },
  {
    title: lang === 'en' ? 'Surgical Execution' : 'Ekzekutimi Kirurgjikal',
    description: lang === 'en' ? 'Specialized surgery in an ISO-certified environment.' : 'Kirurgji e specializuar në një mjedis të certifikuar ISO.',
    icon: <Shield className="w-8 h-8 text-blue-600" />
  }
];

export const GALLERY: BeforeAfter[] = [
  {
    id: '1',
    category: { en: 'Aesthetic Rehabilitation — Zirconia Crowns', sq: 'Rehabilitim Estetik — Kurora Zirkoni' },
    before: '/photos/case-smile-view.jpg', after: '/photos/case-clinical-view.jpg',
    labelBefore: 'Smile View', labelAfter: 'Clinical Detail',
    procedure: {
      title: { en: 'Full-Arch Zirconia Crown Rehabilitation', sq: 'Rehabilitim i Plotë me Kurora Zirkoni' },
      steps: {
        en: ['Clinical examination and digital shade matching', 'Tooth preparation — minimal reduction protocol', 'Digital impressions taken and sent to dental lab', 'Temporary crowns fitted chair-side', 'Zirconia crowns fabricated in lab', 'Try-in, occlusal adjustment, and final cementation'],
        sq: ['Ekzaminimi klinik dhe përputhja digjitale e ngjyrës', 'Preparimi i dhëmbëve — protokoll i reduktimit minimal', 'Masa digjitale të marra dhe dërguar në laborator', 'Kurora temporare të vendosura pranë karrigës', 'Kurora zirkoni të fabrikuara në laborator', 'Prove, rregullim okluzal dhe çimentim final']
      },
      doctor: 'Dr. Faton Loci',
      duration: { en: '2 appointments over 1 week', sq: '2 vizita gjatë 1 jave' },
      materials: { en: 'Zirconia crowns — high-strength monolithic', sq: 'Kurora zirkoni — monolitike me rezistencë të lartë' }
    }
  },
  {
    id: '2',
    category: { en: 'Guided Implant Surgery — 3D Planned', sq: 'Kirurgji e Udhëhequr Implantesh — Planifikuar në 3D' },
    before: '/photos/guided-plan-3d.jpg', after: '/photos/implant-placed.jpg',
    labelBefore: '3D Surgical Plan', labelAfter: 'Implant Placed',
    procedure: {
      title: { en: 'Single Implant Placement with Guided Surgery', sq: 'Vendosje Implanti me Kirurgji të Udhëhequr' },
      steps: {
        en: ['CBCT 3D scan taken and bone volume assessed', 'Digital surgical plan created — implant position, depth and angle set virtually', '3D-printed surgical guide fabricated from the plan', 'Flapless guided surgery performed using the OneGuide kit', 'Hiossen implant placed with high primary stability', 'Healing abutment placed — osseointegration phase begins'],
        sq: ['Skanim 3D CBCT dhe vlerësim i vëllimit kockor', 'Plan kirurgjikal digjital — pozicioni, thellësia dhe këndi i implantit vendosen virtualisht', 'Udhëzues kirurgjikal i printuar 3D nga plani', 'Kirurgji e udhëhequr pa prerje duke përdorur OneGuide kit', 'Implant Hiossen vendosur me stabilitet primar të lartë', 'Abutment shëruese vendosur — faza e oseointegrimid fillon']
      },
      doctor: 'Dr. Lendita Islami Nallbani',
      duration: { en: 'Single surgical session — 45–60 min', sq: 'Seancë e vetme kirurgjikale — 45–60 min' },
      materials: { en: 'Hiossen ET III implant system (USA) — OneGuide surgical kit', sq: 'Sistemi i implanteve Hiossen ET III (SHBA) — OneGuide kit kirurgjikal' }
    }
  },
  {
    id: '3',
    category: { en: 'Smile Makeover — Dr. Faton Loci', sq: 'Transformim i Buzëqeshjes — Dr. Faton Loci' },
    before: '/photos/faton-smile-before.jpg', after: '/photos/faton-smile-after.jpg',
    labelBefore: 'Before', labelAfter: 'After',
    procedure: {
      title: { en: 'Full Smile Makeover — Composite & Crown Rehabilitation', sq: 'Transformim i Plotë i Buzëqeshjes — Rehabilitim me Kompozit dhe Kurora' },
      steps: {
        en: ['Full photographic and clinical smile analysis', 'Shade and shape design — digital mock-up', 'Tooth preparation adapted to each tooth condition', 'Temporary smile placed and patient approved', 'Final restorations fabricated and adjusted in lab', 'Bonding and cementation with final polish'],
        sq: ['Analizë e plotë fotografike dhe klinike e buzëqeshjes', 'Dizajn i ngjyrës dhe formës — mock-up digjital', 'Preparim dhëmbësh i përshtatur me gjendjen e çdo dhëmbi', 'Buzëqeshje temporare vendosur dhe aprovuar nga pacienti', 'Restaurimet finale fabrikuara dhe rregulluara në laborator', 'Bonding dhe çimentim me polish final']
      },
      doctor: 'Dr. Faton Loci',
      duration: { en: '2–3 appointments over 1–2 weeks', sq: '2–3 vizita gjatë 1–2 javëve' },
      materials: { en: 'Zirconia crowns and composite bonding', sq: 'Kurora zirkoni dhe bonding kompozit' }
    }
  },
  {
    id: '4',
    category: { en: 'Zirconia Crowns — Dr. Faton Loci', sq: 'Kurora Zirkoni — Dr. Faton Loci' },
    before: '/photos/faton-crowns-before.jpg', after: '/photos/faton-crowns-after.jpg',
    labelBefore: 'Before', labelAfter: 'After',
    procedure: {
      title: { en: 'Anterior Zirconia Crown Restoration', sq: 'Restaurim me Kurora Zirkoni Anterior' },
      steps: {
        en: ['Detailed shade mapping — upper and lower arch photographed', 'Conservative tooth preparation to preserve tooth structure', 'Precision digital impressions — full arch', 'Provisional crowns fitted while lab fabricates final restorations', 'Zirconia crowns tried in — shape and shade verified by patient', 'Final bonding with adhesive resin cement'],
        sq: ['Hartëzim i detajuar i ngjyrës — fotografim i harkut të sipërm dhe të poshtëm', 'Preparim konservativ i dhëmbëve për të ruajtur strukturën', 'Masa digjitale precize — hark i plotë', 'Kurora provizore vendosur ndërsa laboratori fabrikovon restaurimet finale', 'Prova e kurorave zirkoni — forma dhe ngjyra verifikohen nga pacienti', 'Bonding final me çimento resinë adezive']
      },
      doctor: 'Dr. Faton Loci',
      duration: { en: '2 appointments — 1 week apart', sq: '2 vizita — 1 javë ndërmjet' },
      materials: { en: 'Monolithic zirconia crowns — anterior-grade translucency', sq: 'Kurora zirkoni monolitike — translucencë e gradës anteriore' }
    }
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: {
      en: 'Why I Plan Every Implant in 3D Before I Touch the Patient',
      sq: 'Pse e Planifikoj Çdo Implant në 3D Para se të Filloj'
    },
    excerpt: {
      en: 'After 27 years in oral surgery, the single biggest shift in my practice has not been a new implant system — it has been the moment I stopped working from a 2D X-ray and started planning in three dimensions.',
      sq: 'Pas 27 vitesh në kirurgji orale, ndryshimi më i madh në praktikën time nuk ka qenë një sistem i ri implantesh — ka qenë momenti kur ndalova së punuari nga një radiografi 2D dhe fillova të planifikoj në tre dimensione.'
    },
    content: {
      en: `I still remember the first implant I placed in 2004. I was the first woman in Kosovo to perform the procedure. We had a periapical radiograph, a probe, and a great deal of determination. That was the standard at the time — and it worked. But "working" and "optimal" are two different things.

Today, before any implant surgery at Medident, I sit down with a CBCT scan — a full 3D image of the patient's jaw — and I plan the entire procedure digitally. I decide the exact angle, depth, and diameter of the implant before I have picked up a single instrument. I see where the nerve runs. I see the available bone height. I see the anatomy in ways a flat X-ray simply cannot show.

The result is a 3D-printed surgical guide, made specifically for that patient. During surgery, I place the implant through that guide — which means the drill follows the exact path I planned on screen. There is no estimation. No guesswork.

What this means in practice: for the patient, it means a shorter surgical time — often under 45 minutes for a single implant. It means a smaller incision or sometimes no incision at all (what we call flapless surgery). It means less swelling, less discomfort, and a faster recovery.

For me as a surgeon, it means I can take on more complex cases safely — patients with limited bone, patients who have had previous failures elsewhere, patients who were told they were not candidates for implants. With a proper 3D plan, many of those cases become possible.

The systems I trust: I work with Hiossen (USA) and MegaGen implants. I chose them because of their surface technology and their documented osseointegration rates — the process by which the implant fuses with the bone. A well-placed implant in well-prepared bone, with the right surface treatment, should last a lifetime. That is what I aim for with every patient.

Technology does not replace experience — it amplifies it. A 3D plan is only as good as the surgeon interpreting it. After 27 years and more than 4,000 implants placed, I have learned to read anatomy, anticipate complications, and make decisions under pressure. The digital workflow gives me more information. My experience tells me what to do with it.

If you are considering implants, or if you have been told your case is complicated, I would like to see your scan personally. We can talk through the plan together before anything else happens.

— Dr. Lendita Islami Nallbani, Oral Surgery Specialist & Implantologist, Klinika Dentare Medident, Pejë`,
      sq: ``
    },
    authorId: '1',
    date: 'Jul 19, 2025',
    image: '/photos/lendita-surgical-bw.jpg',
    category: { en: 'Implantology', sq: 'Implantologji' },
    readTime: { en: '5 min read', sq: '5 min lexim' }
  },
{
    id: 'b2',
    title: {
      en: 'Dr. Faton Loci: A Tooth Is Not a White Rectangle. On Natural Aesthetics.',
      sq: 'Dr. Faton Loci: Një Dhëmb Nuk Është Drejtkëndësh i Bardhë. Mbi Estetikën Natyrale.'
    },
    excerpt: {
      en: 'I spend a lot of time outside. Mountains, rivers, forests — nothing in nature is perfectly symmetrical, perfectly uniform, perfectly white. That observation is the foundation of everything I do in the clinic.',
      sq: 'Kaloj shumë kohë jashtë. Male, lumenj, pyje — asgjë në natyrë nuk është perfektisht simetrike, perfektisht uniforme, perfektisht e bardhë. Ky vëzhgim është themeli i gjithçkaje që bëj në klinikë.'
    },
    content: {
      en: `I spend a lot of time outside. Mountains, rivers, forests — nothing in nature is perfectly symmetrical, perfectly uniform, perfectly white. A pine tree does not grow in a straight line. A river stone is not a perfect oval. And a natural tooth is not a white rectangle.

That sounds obvious. And yet it is easy to lose sight of when the pressure is to make teeth look "done."

I have been thinking about this for as long as I have been practising dentistry. It comes back, always, to the same thing — I am a person who pays attention to nature. Not just in the mountains on a weekend. In the way light falls on a leaf. In the way shadows create depth. In the way nothing living is ever perfectly even.

That thinking directly shapes how I work. And it starts long before I pick up an instrument — it starts with communication.

I spend a great deal of time talking with my patients and with the dental lab. More than most people expect. Before any aesthetic case, I want to understand the person sitting in front of me. How they talk. What kind of smile they have naturally — wide and open, or subtle and closed. Whether they are someone who wants to be noticed or someone who wants to blend in. Whether they spend time outdoors, under natural light, or mostly indoors. All of that informs the final result.

With the lab, I do not send a shade number and wait. I send photographs — in window light, in clinical light, in natural daylight outside. I write notes. I call. I ask for samples. The back-and-forth takes time, but it is the difference between a restoration that fits a mouth and one that fits a person.

When I plan an aesthetic rehabilitation — whether it is a single crown or a full smile — the first thing I look at is the patient's existing teeth. Not to copy what is damaged, but to understand what was there. The natural shape, the slight translucency at the edges, the way the centrals are a fraction wider than the laterals, the way the canines catch light differently. These small imperfections are not flaws. They are what makes a smile look real.

The second thing I look at is the patient's face. The width of their smile should relate to the width of their jaw. The curve of the upper teeth should follow the curve of the lower lip. Shade should match skin tone and eye colour. A very fair person with extremely white crowns can look theatrical. A darker complexion can carry a brighter result. There is no universal formula — only observation.

On materials: I work with zirconia and Emax. Both can be milled or pressed to precise tolerances. But the specification I give the lab is not just a shade number. I send photographs in natural light, in window light, in the operatory light. I communicate the translucency I want at the incisal edge. I ask for texture — a surface that catches light the way enamel does, with micro-ridges rather than a polished flat surface. A flat surface reflects light uniformly. Enamel does not. And that difference, invisible to most people, is what separates a crown that looks like a crown from one that disappears into a smile.

Preparation matters enormously. Conservative preparation — removing as little natural tooth structure as possible — is both better for the patient long-term and better aesthetically. The remaining tooth is what gives the restoration its base, its depth, its colour from underneath. Remove too much and the crown sits on a prep that cannot support natural-looking translucency.

The last thing I will say is this: I ask my patients to trust the process. The temporary crowns we place while the lab works often look rough — not the final shape, not the final shade. Patients sometimes worry. But it is the final try-in, when I seat the restorations dry, in natural light, and ask the patient to look in a hand mirror, that I know whether we got it right. When the answer is that they cannot find their crowns in the mirror because they blend in so well — that is the result I am working toward.

Not white rectangles. Something that looks like it grew there.

— Dr. Faton Loci, Dentist
Klinika Dentare Medident, Pejë`,
      sq: ``
    },
    authorId: '2',
    date: 'Jul 19, 2025',
    image: '/photos/faton-clinical.jpg',
    category: { en: 'Aesthetic Dentistry', sq: 'Stomatologji Estetike' },
    readTime: { en: '5 min read', sq: '5 min lexim' }
  },
{
    id: 'b3',
    title: {
      en: 'From 16 Square Metres to 200. What 25 Years of Running This Clinic Taught Me.',
      sq: 'Nga 16 Metra Katrorë në 200. Çfarë më Mësuan 25 Vite Drejtimi i Kësaj Klinike.'
    },
    excerpt: {
      en: 'In 1999 we had one dentist, one room, and a waiting area barely big enough for three chairs. I did not know then that I would still be here 25 years later — or that the clinic would grow into something none of us had dared to imagine.',
      sq: 'Në vitin 1999 kishim një mjeke, një dhomë dhe një dhomë pritjeje që mbante me vështirësi tre karrige. Nuk e dija atëherë se do të isha ende këtu 25 vite më vonë — ose se klinika do të rritej në diçka që asnjë prej nesh nuk kishte guxuar ta imagjinonte.'
    },
    content: {
      en: `In 1999 we had 16 square metres. One dentist. A waiting area barely big enough for three chairs. No system, no software, no staff manual. Just Dr. Lendita, me, and the determination that we were going to make this work.

I was not a clinic manager then. I did not have that title or that training. I was someone who showed up every day, answered the phone, kept the appointment book, made sure the sterilisation was done, and learned — slowly, sometimes painfully — what it meant to run a medical practice.

The first years were the hardest. Not because we did not have patients. We did, from very early on, because Dr. Lendita is the kind of doctor people talk about. But managing growth when you do not yet have the structure to support it — that is where things get difficult. Every problem that appeared, I had to solve for the first time. There was no one to ask. There was no template.

I remember the first time we hired a second person. I thought: now it will be easier. And in some ways it was. But in other ways it became more complicated, because now I was responsible not just for the work but for another person, their schedule, their questions, their mistakes, their learning. That is when I understood that managing a clinic is not really about systems. It is about people.

Today we are 200 square metres. Fifteen people on staff. Multiple treatment rooms running at the same time. A full surgical suite. An academy. Patients who travel from other countries. When I walk through the clinic in the morning before anyone arrives and I see what this place has become, I still find it difficult to connect to those 16 square metres in 1999.

What made the growth possible? Honestly, three things.

The first was Dr. Lendita. A clinic is only as good as its lead doctor, and she has never stopped. Not when it was hard, not when equipment failed, not when we lost patients to circumstances beyond our control. She set the standard, and everything else had to meet it.

The second was the team we built, slowly, carefully. I have always believed that the wrong person in the wrong role costs you more than the empty chair. I have made hiring mistakes — everyone does. But over time we found people who understood what kind of clinic this was trying to be, and who wanted to be part of that.

The third was stubbornness. There is no more honest word for it. There were moments — more than a few — when the easier thing would have been to stay small, to not take the risk, to not sign the lease, to not buy the equipment. We did it anyway. Not because we were certain it would work. Because we believed it should.

I am still learning. The clinic at 200 square metres has problems the clinic at 16 square metres never imagined. But I would not trade any of it.

If you have ever walked through our door and felt that this was a place that cared — that was not an accident. That was 25 years of work.

— Arjeta Muhaxheri Morina
Clinic Manager, Klinika Dentare Medident
Since 1999`,
      sq: ``
    },
    authorId: '6',
    date: 'Jul 19, 2025',
    image: '/team/arjeta-manager.jpg',
    category: { en: 'Our Story', sq: 'Historia Jonë' },
    readTime: { en: '5 min read', sq: '5 min lexim' }
  },
{
    id: 'b4',
    title: {
      en: 'I Did Not Plan to Be Here. But I Chose to Stay.',
      sq: 'Nuk E Kisha Planifikuar të Jem Këtu. Por Zgjodha të Qëndroj.'
    },
    excerpt: {
      en: 'I was a dental student in Sarajevo when the war started. I finished my degree in Istanbul, came back to Kosovo, built a clinic from nothing, and in 2017 lost my husband to cancer. I kept going. This is not a story about success. It is a story about not stopping.',
      sq: 'Isha studentë stomatologjie në Sarajevë kur filloi lufta. E mbarova diplomën në Istanbul, u ktheva në Kosovë dhe ndërtova një klinikë nga hiçi. Në vitin 2017 humba burrin nga kanceri. Vazhdova. Kjo nuk është një histori suksesi. Është një histori rreth mosndalesës.'
    },
    content: {
      en: `I was a dental student in Sarajevo when the war started. I was young, I was in the middle of my studies, and suddenly everything stopped. The city I had gone to in order to build a future became a place I had to leave. That is not a moment you plan for. That is a moment that plans you.

I finished my dental degree at Çapa University in Istanbul — one of the best medical faculties in Turkey, and one of the most demanding places I have ever been. I was not supposed to be there. I had not chosen Istanbul. But I worked, I passed, I graduated. And I learned something that no curriculum teaches: that the circumstances that interrupt your plan are often the ones that build your character.

I came back to Kosovo and I opened this clinic in 1999. Sixteen square metres. One room. No equipment to speak of. The country was just beginning to find itself after everything it had been through. I was just beginning to find myself after everything I had been through.

In 2017, I lost my husband to cancer. The clinic was already eighteen years old by then. The children were growing up. And still, it was one of the hardest things I have ever had to carry — because grief does not wait for a good moment, and life does not pause while you go through it. I had a clinic to run, patients booked, staff who needed direction, and two children who needed their mother to hold it together. So I did.

I do not say this for sympathy. I say it because I think it is important for people to know that the person treating them, the person planning their surgery, the person who stays calm when something unexpected happens in the chair — that person has been tested. Not in a classroom. In life.

What kept me going? My children, always. The patients — because when someone trusts you with their health, that trust is not something you can put down. And this clinic. Because a place that carries 25 years of your life is not just a business. It is proof that you did not stop.

In 2004 I placed the first dental implant ever performed by a woman in Kosovo. I remember the day. I remember being aware of what it meant — not for my ego, but because representation matters. If one young woman in Kosovo saw that and thought it was possible for her too, then it was worth doing.

I have two children who watched their mother run a clinic, perform surgery, hire people, fire people, make decisions, carry responsibility, and keep going through things that could have stopped her. I hope they saw something useful in that. I hope they know that the point is not to have a life without difficulties. The point is to decide that the difficulties do not have the last word.

I am still here. Still operating. Still planning every case in 3D, still learning, still building this place into what it can be.

I did not plan to be here. But I chose to stay. Every single day.

— Dr. Lendita Islami Nallbani
Oral Surgery Specialist & Implantologist
Founder, Klinika Dentare Medident, Pejë`,
      sq: ``
    },
    authorId: '1',
    date: 'Jul 19, 2025',
    image: '/photos/lendita-operating.jpg',
    category: { en: 'Personal', sq: 'Personale' },
    readTime: { en: '5 min read', sq: '5 min lexim' }
  }
];

export const TESTIMONIALS: Testimonial[] = [];

export const FAQS: FAQ[] = [
  {
    id: '1',
    question: { en: 'Is it safe to have dental treatment in Kosovo?', sq: 'A është e sigurt të kryhet trajtimi dentar në Kosovë?' },
    answer: { en: 'Yes. Klinika Dentare Medident is ISO 9001 certified and has been operating since 1999. Dr. Lendita Islami Nallbani, our lead surgeon, has placed 4,000+ implants. We use FDA-cleared (Hiossen) and CE-certified (MegaGen) implant systems, and every surgical case is 3D-planned before the procedure.', sq: 'Po. Klinika Dentare Medident është e çertifikuar ISO 9001 dhe është operative që nga 1999. Ne përdorim sisteme implantesh të aprovuara nga FDA dhe CE, dhe çdo rast kirurgjikal planifikohet në 3D para procedurës.' },
    category: 'clinical'
  },
  {
    id: '2',
    question: { en: 'Do you provide airport transfers?', sq: 'A ofroni transport nga aeroporti?' },
    answer: { en: 'Yes. We pick up international patients from Prishtina International Airport (PRN) and drive them directly to Pejë — around 1 hour. Just send us your flight details on WhatsApp (+383 49 772 307) before you travel.', sq: 'Po. I marrim pacientët ndërkombëtarë nga Aeroporti Ndërkombëtar i Prishtinës dhe i çojmë direkt në Pejë — rreth 1 orë. Na dërgoni detajet e fluturimit në WhatsApp (+383 49 772 307) para se të udhëtoni.' },
    category: 'logistics'
  },
  {
    id: '3',
    question: { en: 'How do I send my X-ray or scan for a review?', sq: 'Si mund të dërgoj radiografinë ose skanimin tim për rishikim?' },
    answer: { en: 'Simply send your OPG panoramic X-ray or CBCT scan on WhatsApp to +383 49 772 307. Dr. Lendita reviews every incoming case personally and will respond with a plan — before you commit to anything.', sq: 'Dërgojeni thjesht panoramen OPG ose skanimin CBCT në WhatsApp te +383 49 772 307. Dr. Lendita rishikon çdo rast personalisht dhe do të përgjigjet me një plan — para se të angazhoheni për diçka.' },
    category: 'logistics'
  },
  {
    id: '4',
    question: { en: 'What implant brands do you use?', sq: 'Çfarë markash implantesh përdorni?' },
    answer: { en: 'We use Hiossen (USA, FDA-cleared) and MegaGen (South Korea, CE-certified) implant systems. Both are documented, traceable systems with strong long-term osseointegration records. We do not use unbranded or budget implants.', sq: 'Përdorim sistemet e implanteve Hiossen (SHBA, FDA) dhe MegaGen (Kore e Jugut, CE). Të dyja janë sisteme të dokumentuara me rekorde të forta të osseointegrimid afatgjatë.' },
    category: 'clinical'
  },
  {
    id: '5',
    question: { en: 'How many visits do I need?', sq: 'Sa vizita nevojiten?' },
    answer: { en: 'For implants, typically two visits: the first for surgery and temporaries (5–7 days), and the second 3–6 months later for final restorations (5–7 days). For crowns and smile rehabilitation, usually 2 appointments within the same week.', sq: 'Për implante, zakonisht dy vizita: e para për kirurgji dhe temporare (5–7 ditë), dhe e dyta 3–6 muaj më vonë për restaurimet finale (5–7 ditë). Për kurora dhe rehabilitim estetik, zakonisht 2 takime brenda të njëjtës javë.' },
    category: 'logistics'
  },
  {
    id: '6',
    question: { en: 'Where can I stay while I am in Pejë?', sq: 'Ku mund të qëndroj ndërkohë që jam në Pejë?' },
    answer: { en: 'We work with Hotel Dukagjini in central Pejë, a short walk from the clinic. We can coordinate your booking on request. Pejë also sits at the edge of Rugova Canyon — a beautiful area to rest and recover during your stay.', sq: 'Bashkëpunojmë me Hotel Dukagjini në qendër të Pejës, pak minuta larg klinikës. Mund të koordinojmë rezervimin tuaj me kërkesë. Peja ndodhet gjithashtu pranë Kanionit të Rugovës — një zonë e bukur për të pushuar.' },
    category: 'logistics'
  },
  {
    id: '7',
    question: { en: 'How long does a dental implant take to complete?', sq: 'Sa kohë duhet për të kompletuar një implant dentar?' },
    answer: { en: 'The surgical placement takes 45–60 minutes per implant. After surgery, the implant needs 3–6 months to fuse with the bone (osseointegration). You leave with a temporary crown the same day. You return for your permanent zirconia crown once osseointegration is confirmed — this usually takes 1–2 appointments over 5–7 days.', sq: 'Vendosja kirurgjikale merr 45–60 minuta për implant. Pas kirurgjisë, implanti ka nevojë për 3–6 muaj të bashkohet me kockën (osseointegrim). Largoheni me kurorë temporare të njëjtën ditë. Ktheheni për kurorën permanente zirkoni pasi osseointegrimet konfirmohet — zakonisht 1–2 takime gjatë 5–7 ditëve.' },
    category: 'clinical'
  },
  {
    id: '8',
    question: { en: 'Does the implant procedure hurt?', sq: 'A dhemb procedura e implantit?' },
    answer: { en: 'The procedure is performed under local anaesthesia — you will not feel pain during surgery. Afterwards, mild discomfort and swelling for 2–3 days is normal and managed with over-the-counter pain relief. Most patients return to normal activity the next day. Flapless guided surgery (which we use when anatomy allows) produces significantly less swelling and discomfort than traditional open surgery.', sq: 'Procedura kryhet nën anestezi lokale — nuk do të ndjeni dhimbje gjatë kirurgjisë. Më pas, siklet i lehtë dhe ënjtje për 2–3 ditë është normale dhe menaxhohet me analgjezikë pa recetë. Shumica e pacientëve kthehen në aktivitetin normal ditën tjetër. Kirurgjia flapless e udhëhequr prodhon ënjtje dhe siklet dukshëm më pak.' },
    category: 'clinical'
  },
  {
    id: '9',
    question: { en: 'Can I get All-on-4 or All-on-6 at Medident?', sq: 'A mund të bëj All-on-4 ose All-on-6 në Medident?' },
    answer: { en: 'Yes. Dr. Lendita Islami Nallbani performs All-on-4, All-on-6, and All-on-8 procedures. Every case is planned in 3D — bone volume, implant position, and the final prosthesis are all mapped digitally before any surgery. Send us your OPG or CBCT on WhatsApp (+383 49 772 307) and we will review your case personally.', sq: 'Po. Dr. Lendita Islami Nallbani kryen procedurat All-on-4, All-on-6 dhe All-on-8. Çdo rast planifikohet në 3D — vëllimi kockor, pozicioni i implantit dhe proteza finale hartohen digjitalisht para çdo kirurgjie. Na dërgoni OPG ose CBCT në WhatsApp (+383 49 772 307) dhe ne do ta rishikojmë rastin tuaj personalisht.' },
    category: 'clinical'
  },
  {
    id: '10',
    question: { en: 'What is the difference between zirconia and Emax crowns?', sq: 'Cili është ndryshimi midis kurorave zirkoni dhe Emax?' },
    answer: { en: 'Zirconia is stronger and better for back teeth or patients who grind their teeth. Emax (lithium disilicate) has superior translucency and is the preferred choice for front teeth where natural aesthetics matter most. Dr. Faton Loci selects the material based on the tooth position, bite forces, and the aesthetic result the patient wants — it is not a one-size-fits-all decision.', sq: 'Zirkoni është më i fortë dhe më i mirë për dhëmbët e pasëm ose pacientëve që kërcasin dhëmbët. Emax (lithium disilicate) ka translucencë superiore dhe është zgjedhja e preferuar për dhëmbët e përparmë ku estetika natyrale ka rëndësi më të madhe. Dr. Faton Loci zgjedh materialin bazuar në pozicionin e dhëmbit, forcat e kafshimit dhe rezultatin estetik që dëshiron pacienti.' },
    category: 'clinical'
  },
  {
    id: '11',
    question: { en: 'Is Medident ISO certified?', sq: 'A është Medident ISO e çertifikuar?' },
    answer: { en: 'Yes. Klinika Dentare Medident is ISO 9001 certified. We use sterilisation protocols that meet EU standards, and every material we use — implants, ceramics, bonding agents — is a documented, traceable product from certified manufacturers (Hiossen USA, MegaGen South Korea, Ivoclar Liechtenstein).', sq: 'Po. Klinika Dentare Medident është e çertifikuar ISO 9001. Përdorim protokolle sterilizimi që plotësojnë standardet e BE-së, dhe çdo material që përdorim — implante, qeramikë, agjentë bonding — është produkt i dokumentuar, i gjurmueshëm nga prodhues të çertifikuar (Hiossen SHBA, MegaGen Kore e Jugut, Ivoclar Lihtenshtajn).' },
    category: 'clinical'
  },
  {
    id: '12',
    question: { en: 'A pranohen pacijentë nga Rožaje, Plav dhe Gusinje?', sq: 'A pranohen pacientë nga Rožaje, Plav dhe Gusinje?' },
    answer: { en: 'Yes. We regularly treat patients from Rožaje (1 hour away), Plav (45 minutes), and Gusinje (50 minutes). Our staff speaks Bosnian, Albanian, and English. WhatsApp us your scan and we will take it from there: +383 49 772 307.', sq: 'Po. Ne trajtojmë rregullisht pacientë nga Rožaje (1 orë larg), Plav (45 minuta) dhe Gusinje (50 minuta). Stafi ynë flet boshnjakisht, shqip dhe anglisht. Na dërgoni skanimin tuaj në WhatsApp dhe ne do ta marrim nga aty: +383 49 772 307.' },
    category: 'logistics'
  },
  {
    id: '13',
    question: { en: 'Can children be treated at Medident?', sq: 'A mund të trajtohen fëmijët në Medident?' },
    answer: { en: 'Yes. We offer general dentistry for children — check-ups, fillings, and preventive care. For implants, patients need to be adults (18+) with fully developed jaws. Contact us on +383 49 272 803 to schedule a paediatric appointment.', sq: 'Po. Ofrojmë stomatologji të përgjithshme për fëmijë — kontrolle, plombe dhe kujdes preventiv. Për implante, pacientët duhet të jenë të rritur (18+) me nofulla të zhvilluara plotësisht. Na kontaktoni në +383 49 272 803 për të caktuar një takim pediatrik.' },
    category: 'clinical'
  }
];

export const TECHNOLOGIES: Technology[] = [
  {
    id: '1',
    name: '3D CBCT Scanning',
    description: { en: 'High-precision volumetric imaging for pre-surgical bone assessment.', sq: 'Imazheri volumetrike me saktësi të lartë për vlerësimin e kockave para operacionit.' },
    icon: 'Scan',
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/cbct-scan.jpg'
  },
  {
    id: '2',
    name: 'CAD/CAM Lab',
    description: { en: 'In-house digital manufacturing for same-day prosthetic solutions.', sq: 'Prodhimi digjital i brendshëm për zgjidhje protetike në të njëjtën ditë.' },
    icon: 'Cpu',
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/cad-cam.jpg'
  }
];

export const ACADEMY_COURSES: Course[] = [
  {
    id: 'c1',
    title: { en: 'Implantology & Sinus Lift', sq: 'Implantologji & Sinus Lift' },
    description: {
      en: 'Hands-on course in implantology and sinus lift techniques, led by Dr. Lendita Islami Nallbani, oral surgery specialist with 27 years of clinical experience.',
      sq: 'Kurs praktik në implantologji dhe teknikat e sinus lift, i udhëhequr nga Dr. Lendita Islami Nallbani, specialiste e kirurgjisë orale me 27 vite përvojë klinike.'
    },
    duration: { en: 'Contact for schedule', sq: 'Kontaktoni për orarin' },
    curriculum: ['Implant Placement', 'Sinus Lift Techniques', '3D Case Planning & Surgical Guides', 'Guided Surgery Protocol', 'Live Clinical Observation'],
    keyTakeaways: {
      en: ['Plan and place dental implants with confidence', 'Design and use 3D-printed surgical guides', 'Perform sinus lift procedures safely', 'Assess bone and anatomical considerations', 'Observe live cases in a working clinic'],
      sq: ['Planifikoni dhe vendosni implante dentare me siguri', 'Dizajnoni dhe përdorni udhëzues kirurgjikal të printuar në 3D', 'Kryeni procedurat e sinus lift në mënyrë të sigurt', 'Vlerësoni kockën dhe konsideratat anatomike', 'Vëzhgoni raste live në një klinikë aktive']
    },
    image: '/photos/guided-kit.jpg',
    category: 'Hands-on',
    instructorId: '1'
  },
  {
    id: 'c2',
    title: { en: 'Aesthetic Preparation & Crown Placement', sq: 'Preparimi Estetik & Vendosja e Kurorave' },
    description: {
      en: 'A hands-on course covering the full aesthetic workflow — from tooth preparation and shade selection through to crown cementation and polishing. Led by Dr. Faton Loci, with real clinical cases.',
      sq: 'Kurs praktik që mbulon të gjithë rrjedhën estetike — nga preparimi i dhëmbëve dhe zgjedhja e ngjyrës deri tek çimentimi i kurorave dhe polierimi. I udhëhequr nga Dr. Faton Loci, me raste reale klinike.'
    },
    duration: { en: 'Contact for schedule', sq: 'Kontaktoni për orarin' },
    curriculum: [
      'Aesthetic Tooth Preparation Principles',
      'Shade Selection & Communication with Lab',
      'Temporary Crown Fabrication',
      'Zirconia & Emax Crown Cementation',
      'Finishing, Polishing & Occlusal Check'
    ],
    keyTakeaways: {
      en: [
        'Master aesthetic preparation techniques for anterior and posterior teeth',
        'Select and communicate shade accurately with the dental lab',
        'Fabricate functional temporaries chair-side',
        'Apply the correct cementation protocol for zirconia and Emax',
        'Achieve a natural, balanced aesthetic result'
      ],
      sq: [
        'Zotëroni teknikat estetike të preparimit për dhëmbët anterior dhe posterior',
        'Zgjidhni dhe komunikoni ngjyrën saktë me laboratorin dentar',
        'Fabrikoni temporare funksionale pranë karrigës',
        'Zbatoni protokollin e duhur të çimentimit për zirkon dhe Emax',
        'Arrini një rezultat estetik natyral dhe të balancuar'
      ]
    },
    image: '/photos/faton-aesthetic-closeup.jpg',
    category: 'Hands-on',
    instructorId: '2'
  }
];
