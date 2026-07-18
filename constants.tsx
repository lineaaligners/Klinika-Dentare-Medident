
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
      en: 'Surgical placement of titanium and zirconia fixtures utilizing navigated surgery protocols for long-term stability.',
      sq: 'Vendosja kirurgjikale e fiksuesve të titanit dhe zirkonit duke përdorur protokolle të navigimit kirurgjikal.'
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
    name: 'Dr. Lendita Islami Nallbani',
    role: { en: 'Chief Oral Surgeon', sq: 'Kryekirurge Orale' },
    bio: {
      en: 'Senior specialist in Oral Surgery with a distinguished 27-year legacy. Trained in top-tier European university hospitals, bringing advanced surgical protocols to Peja.',
      sq: 'Specialiste e lartë në Kirurgjinë Orale me një trashëgimi 27-vjeçare. E trajnuar në spitalet më të mira universitare evropiane.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/519508741_18258447043303287_5432944367248736037_n.jpg',
    specialties: ['Oral Surgery', 'Advanced Implantology', 'Bone Augmentation'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina', 'Specialization in Oral Surgery', 'Advanced Surgical Fellowship (Vienna, Austria)'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës', 'Specializimi në Kirurgjinë Orale', 'Trajnim i Avancuar Kirurgjikal (Vjenë, Austri)']
    },
    experience: { en: '27+ Years Clinical Practice', sq: '27+ Vite Praktikë Klinike' },
    languages: ['Albanian', 'English', 'German'],
    certifications: ['ISO 9001 Clinical Auditor', 'ITI Member', 'Expert in Zygomatic Implants'],
    research: {
      en: ['Comparative analysis of immediate load vs traditional protocols in edentulous patients.', 'Bone augmentation techniques in the atrophic posterior maxilla.'],
      sq: ['Analiza krahasimore e ngarkesës e menjëhershme kundrejt protokolleve tradicionale.', 'Teknikat e shtimit të kockave në maksilën e pasme atrofike.']
    }
  },
  {
    id: '2',
    name: 'Dr. Muharrem Loci',
    role: { en: 'Oral Surgeon & Implantologist', sq: 'Kirurg Oral & Implantolog' },
    bio: {
      en: 'Specialist in dental implantology and complex oral rehabilitation. Expert in advanced bone regeneration and navigated surgery.',
      sq: 'Specialist në implantologjinë dentare dhe rehabilitimin kompleks oral. Ekspert në rigjenerimin e avancuar të kockave.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/518903332_18258447133303287_3174152709192455431_n.jpg',
    specialties: ['Dental Implants', 'Guided Surgery', 'Full Arch Rehab'],
    education: {
      en: ['University of Prishtina', 'Surgical Residency (Vienna, Austria)'],
      sq: ['Universiteti i Prishtinës', 'Rezidenca Kirurgjikale (Vjenë, Austri)']
    },
    experience: { en: '18+ Years Experience', sq: '18+ Vite Përvojë' },
    languages: ['Albanian', 'English', 'German'],
    certifications: ['International Congress of Oral Implantologists (ICOI)']
  },
  {
    id: '3',
    name: 'Dr. Faton Loci',
    role: { en: 'Restorative & CAD/CAM Specialist', sq: 'Specialist i Restaurimit & CAD/CAM' },
    bio: {
      en: 'Leading expert in digital dentistry and aesthetic design. Specializes in intraoral scanning protocols and monolithic restorations.',
      sq: 'Ekspert udhëheqës në stomatologjinë digjitale dhe dizajnin estetik. Specializohet në protokollet e skanimit intraoral.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/520120059_18258447091303287_3697667781056904147_n.jpg',
    specialties: ['Aesthetic Dentistry', 'CAD/CAM Prosthetics', 'Digital Smile Design'],
    education: {
      en: ['University of Prishtina', 'Digital Workflow Certification (Germany)'],
      sq: ['Universiteti i Prishtinës', 'Certifikimi i Rrjedhës Digjitale (Gjermani)']
    },
    experience: { en: '15+ Years Experience', sq: '15+ Vite Përvojë' },
    languages: ['Albanian', 'English'],
    // Added missing mandatory certifications property to fix type error
    certifications: ['Certified Digital Smile Designer', 'Advanced CAD/CAM Workflow']
  },
  {
    id: '4',
    name: 'Dr. Arbresha Zeneli',
    role: { en: 'Endodontist (Root Canal Specialist)', sq: 'Endodontologe (Specialiste e Kanaleve)' },
    bio: {
      en: 'Specialized in microscopic endodontics and saving complex natural teeth using advanced rotary instrumentation.',
      sq: 'Specializuar në endodontinë mikroskopike dhe shpëtimin e dhëmbëve natyralë komplekse.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/437433800_18241513221303287_7521098675127606308_n.jpg',
    specialties: ['Microscopic Endodontics', 'Retreatments', 'Apicoectomy'],
    education: {
      en: ['University of Prishtina', 'Endodontic Masterclass (Europe)'],
      sq: ['Universiteti i Prishtinës', 'Masterklas Endodontik (Evropë)']
    },
    experience: { en: '11+ Years Experience', sq: '11+ Vite Përvojë' },
    languages: ['Albanian', 'English'],
    // Added missing mandatory certifications property to fix type error
    certifications: ['Specialist in Micro-Endodontics', 'Advanced Endodontic Techniques']
  },
  {
    id: '5',
    name: 'Dr. Fjolla Mulliqi',
    role: { en: 'Orthodontist', sq: 'Ortodontologe' },
    bio: {
      en: 'Expert in smile alignment using both traditional and invisible aligner technology. Specialized in pediatric and adult functional aesthetics.',
      sq: 'Eksperte në rregullimin e buzëqeshjes duke përdorur teknologjinë tradicionale dhe atë të padukshme.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/435131804_18241513110303287_3179261311034035659_n.jpg',
    specialties: ['Clear Aligners', 'Braces', 'Functional Orthodontics'],
    education: {
      en: ['University of Prishtina', 'Specialization in Orthodontics'],
      sq: ['Universiteti i Prishtinës', 'Specializimi në Ortodonci']
    },
    experience: { en: '9+ Years Experience', sq: '9+ Vite Përvojë' },
    languages: ['Albanian', 'English'],
    // Added missing mandatory certifications property to fix type error
    certifications: ['Invisalign Certified Provider', 'Functional Aesthetics Specialist']
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
    desc: lang === 'en' ? 'A serene trek to the glacial lakes at 1,900m altitude. The pure oxygen levels here accelerate post-surgical healing.' : 'Një ecje qetësuese drejt liqeneve akullnajore në 1,900m lartësi. Nivelet e larta të oksigjenit përshpejtojnë shërimin.',
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
    description: lang === 'en' ? 'Radiographic data review by our surgical board led by Dr. Lendita.' : 'Rishikimi i të dhënave radiografike nga bordi ynë kirurgjikal i udhëhequr nga Dr. Lendita.',
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
  { id: '1', category: { en: 'Surgical Case', sq: 'Rast Kirurgjikal' }, before: 'https://picsum.photos/seed/b1/400/300', after: 'https://picsum.photos/seed/a1/400/300' },
  { id: '2', category: { en: 'Implantology', sq: 'Implantologjia' }, before: 'https://picsum.photos/seed/b2/400/300', after: 'https://picsum.photos/seed/a2/400/300' }
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

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    country: 'United Kingdom',
    text: 'The surgical expertise at Medident is world-class. I saved 60% compared to London prices and received better care than I ever imagined.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: '2',
    name: 'Hans Müller',
    country: 'Germany',
    text: 'Highly skilled surgeons in Peja are true masters. My full-arch restoration was painless and the results are perfect. Highly recommended.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=hans'
  },
  {
    id: '3',
    name: 'Elena Rossi',
    country: 'Italy',
    text: 'A clean, modern clinic with state-of-the-art technology. The team was professional and the journey through Rugova was the cherry on top.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=elena'
  }
];

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
    title: { en: 'Advanced Surgical All-on-X', sq: 'All-on-X Kirurgjikal i Avancuar' },
    description: { 
      en: 'Intensive, practical, workshop-based surgical mastery for edentulous rehabilitation led by Dr. Lendita Islami Nallbani.',
      sq: 'Mjeshtëri intensive, praktike kirurgjikale e bazuar në punëtori për rehabilitimin pa dhëmbë e udhëhequr nga Dr. Lendita Islami Nallbani.'
    },
    duration: { en: '4 Days', sq: '4 Ditë' },
    curriculum: ['Surgical Templates', 'Immediate Load', 'Advanced Clinical Protocols', 'Live Surgery'],
    keyTakeaways: {
      en: ['Master complex anatomical assessments', 'Navigate full-arch surgical templates', 'Implement immediate load protocols', 'Apply advanced clinical standards'],
      sq: ['Mjeshtëroni vlerësimet anatomike komplekse', 'Navigoni shabllonet kirurgjikale të harkut të plotë', 'Zbatoni protokolle të ngarkesës së menjëhershme', 'Zbatoni standardet klinike të avancuara']
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/unnamed.jpg',
    category: 'Hands-on',
    instructorId: '1'
  }
];
