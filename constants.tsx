
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
    title: { en: 'Advanced Oral Surgery', sq: 'Kirurgjia Orale e Avancuar' },
    description: { 
      en: 'Primary specialization in complex surgical interventions, including bone grafting and sinus lift protocols.',
      sq: 'Specializimi parësor në ndërhyrje kirurgjikale komplekse, duke përfshirë transplantin e kockave.'
    },
    icon: 'Shield',
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/522466288_18258761737303287_2709900497171704416_n.jpg'
  },
  {
    id: '2',
    title: { en: 'Implantology', sq: 'Implantologjia' },
    description: {
      en: 'Surgical placement of Hiossen (USA) and MegaGen implant systems, using guided surgery protocols for long-term stability.',
      sq: 'Vendosja kirurgjikale e sistemeve të implanteve Hiossen (SHBA) dhe MegaGen, me protokolle të kirurgjisë së udhëhequr.'
    },
    icon: 'Activity',
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/487392382_1282806653292502_7830483863337131816_n.jpg'
  },
  {
    id: '3',
    title: { en: 'Aesthetic Rehabilitation', sq: 'Rehabilitimi Estetik' },
    description: { 
      en: 'Advanced prosthetic solutions including high-translucency veneers and E-Max laminates for comprehensive smile design.',
      sq: 'Zgjidhje protetike të avancuara duke përfshirë faseta me translucencë të lartë dhe laminat E-Max.'
    },
    icon: 'Sparkles',
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/567164899_18269114518303287_4783023056972037593_n.jpg'
  },
  {
    id: '4',
    title: { en: 'Clinical Whitening', sq: 'Zbardhja Klinike' },
    description: {
      en: 'Medical-grade photo-activated whitening systems for safe and effective reduction of dental chromogens.',
      sq: 'Sisteme zbardhimi mjekësore të foto-aktivizuara për reduktim të sigurt dhe efektiv.'
    },
    icon: 'Award',
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/Teeth-whitening-all-you-should-know.png'
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
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop'
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
    title: { en: 'Advanced Surgical Protocols', sq: 'Protokollet e Avancuara Kirurgjikale' },
    excerpt: { en: 'A review of structural integrity and surgical outcomes.', sq: 'Një rishikim i integritetit strukturor dhe rezultateve kirurgjikale.' },
    content: { 
      en: 'Institutional report on surgical integration... Full research following advanced clinical protocols brought by Chief Surgeon Dr. Lendita.',
      sq: 'Raport institucional mbi integrimin kirurgjikal... Kërkimi i plotë sipas protokolleve klinike të avancuara të sjella nga Kryekirurgja Dr. Lendita.'
    },
    authorId: '1',
    date: 'Oct 24, 2024',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
    category: { en: 'Surgical Protocols', sq: 'Protokollet Kirurgjikale' },
    readTime: { en: '6 min read', sq: '6 min lexim' }
  }
];

export const TESTIMONIALS: Testimonial[] = [];

export const FAQS: FAQ[] = [
  {
    id: '1',
    question: { en: 'Is dental tourism safe in Kosovo?', sq: 'A është i sigurt turizmi dentar në Kosovë?' },
    answer: { en: 'Absolutely. We follow strict ISO 9001 protocols and our surgeons are internationally trained with decades of experience.', sq: 'Absolutisht po. Ne ndjekim protokolle të rrepta ISO 9001 dhe kirurgët tanë janë të trajnuar ndërkombëtarisht me dekada përvojë.' },
    category: 'clinical'
  },
  {
    id: '2',
    question: { en: 'Do you provide airport transfers?', sq: 'A ofroni transferta nga aeroporti?' },
    answer: { en: 'Yes, we provide VIP transit from Prishtina International Airport (PRN) directly to Peja for all our international patients.', sq: 'Po, ne ofrojmë transit VIP nga Aeroporti Ndërkombëtar i Prishtinës direkt në Pejë.' },
    category: 'logistics'
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
