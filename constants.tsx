
import React from 'react';
import { Shield, Sparkles, Plane, Hotel, Activity, Award } from 'lucide-react';
import { Service, Testimonial, BeforeAfter, Doctor, BlogPost, Course } from './types';

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
      en: 'Senior specialist in Oral Surgery with a distinguished 27-year legacy. Trained in top-tier Turkish university hospitals, bringing advanced surgical protocols to Peja.',
      sq: 'Specialiste e lartë në Kirurgjinë Orale me një trashëgimi 27-vjeçare. E trajnuar në spitalet më të mira universitare turke.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/519508741_18258447043303287_5432944367248736037_n.jpg',
    specialties: ['Oral Surgery', 'Advanced Implantology', 'Bone Augmentation'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina', 'Specialization in Oral Surgery', 'Advanced Surgical Fellowship (Istanbul, Turkey)'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës', 'Specializimi në Kirurgjinë Orale', 'Trajnim i Avancuar Kirurgjikal (Stamboll, Turqi)']
    },
    experience: { en: '27+ Years Clinical Practice', sq: '27+ Vite Praktikë Klinike' },
    languages: ['Albanian', 'English', 'German', 'Turkish'],
    certifications: ['ISO 9001 Clinical Auditor', 'ITI Member', 'Expert in Zygomatic Implants'],
    research: {
      en: ['Comparative analysis of immediate load vs traditional protocols in edentulous patients.', 'Bone augmentation techniques in the atrophic posterior maxilla: A 10-year longitudinal study.', 'Clinical evaluation of Turkish surgical protocols in Balkan patient demographics.'],
      sq: ['Analiza krahasimore e ngarkesës së menjëhershme kundrejt protokolleve tradicionale.', 'Teknikat e shtimit të kockave në maksilën e pasme atrofike: Studim 10-vjeçar.', 'Vlerësimi klinik i protokolleve kirurgjikale turke në demografinë e Ballkanit.']
    },
    links: [
      { label: 'ResearchGate Profile', url: '#' },
      { label: 'PubMed Bibliography', url: '#' }
    ]
  },
  {
    id: '2',
    name: 'Dr. Faton Loci',
    role: { en: 'Restorative & CAD/CAM Specialist', sq: 'Specialist i Restaurimit & CAD/CAM' },
    bio: {
      en: 'Leading expert in digital dentistry and aesthetic design. Specializes in intraoral scanning protocols and monolithic restorations.',
      sq: 'Ekspert udhëheqës në stomatologjinë digjitale dhe dizajnin estetik. Specializohet në protokollet e skanimit intraoral.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/520120059_18258447091303287_3697667781056904147_n.jpg',
    specialties: ['Aesthetic Dentistry', 'CAD/CAM Prosthetics', 'Digital Smile Design'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina', 'Advanced Training in Digital Dentistry (Germany)'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës', 'Trajnim i Avancuar në Stomatologjinë Digjitale (Gjermani)']
    },
    experience: { en: '15+ Years Clinical Practice', sq: '15+ Vite Praktikë Klinike' },
    languages: ['Albanian', 'English'],
    certifications: ['Certified Exocad Designer', 'Advanced Aesthetic Composite Specialist'],
    research: {
      en: ['Digital workflow optimization for monolithic zirconia rehabilitations.', 'Accuracy comparison of intraoral scanners in full-arch digital impressions.', 'Color stability of modern CAD/CAM ceramic systems: A clinical review.'],
      sq: ['Optimizimi i rrjedhës digjitale për rehabilitimet monolitike të zirkonit.', 'Krahasimi i saktësisë së skanerëve intraoralë në përshtypjet digjitale.', 'Stabiliteti i ngjyrës i sistemeve moderne qeramike CAD/CAM.']
    },
    links: [
      { label: 'Academic Portfolio', url: '#' },
      { label: 'LinkedIn Profile', url: '#' }
    ]
  },
  {
    id: '6',
    name: 'Dr. Arjeta Muhaxheri Morina',
    role: { en: 'Clinical Director & Manager', sq: 'Drejtoreshë Klinike & Menaxhere' },
    bio: {
      en: 'Coordinates the clinical board and leads the institutional management department, ensuring seamless patient journeys and operational excellence.',
      sq: 'Koordinon bordin klinik dhe udhëheq departamentin e menaxhimit institucional, duke siguruar rrugëtim të qetë të pacientit.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/520877630_18258447793303287_6370335904948863904_n.jpg',
    specialties: ['Orthodontics', 'Clinical Management', 'Patient Coordination'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina', 'Specialization in Orthodontics', 'Master of Healthcare Management'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës', 'Specializimi në Ortodonci', 'Master në Menaxhim Shëndetësor']
    },
    experience: { en: '14+ Years Clinical & Administrative Practice', sq: '14+ Vite Praktikë Klinike dhe Administrative' },
    languages: ['Albanian', 'English', 'German'],
    certifications: ['Invisalign Gold Provider', 'Health Management Specialist', 'ISO Clinical Coordinator'],
    research: {
      en: ['Patient journey optimization in high-volume surgical dental tourism.', 'Efficacy of digital monitoring in orthodontic clear aligner therapy.', 'Institutional management of ISO 9001 standards in dental clinical environments.'],
      sq: ['Optimizimi i rrugëtimit të pacientit në turizmin dentar kirurgjikal.', 'Efikasiteti i monitorimit digjital në terapinë ortodontike me aligners.', 'Menaxhimi institucional i standardeve ISO 9001 në klinikat dentare.']
    },
    links: [
      { label: 'Management Insights', url: '#' }
    ]
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
      en: 'Institutional report on surgical integration... Full research following Turkish clinical protocols brought by Chief Surgeon Dr. Lendita.',
      sq: 'Raport institucional mbi integrimin kirurgjikal... Kërkimi i plotë sipas protokolleve klinike turke të sjella nga Kryekirurgja Dr. Lendita.'
    },
    authorId: '1',
    date: 'Oct 24, 2024',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
    category: { en: 'Surgical Protocols', sq: 'Protokollet Kirurgjikale' },
    readTime: { en: '6 min read', sq: '6 min lexim' }
  }
];

export const ACADEMY_COURSES: Course[] = [
  {
    id: 'c1',
    title: { en: 'Advanced Surgical All-on-X', sq: 'All-on-X Kirurgjikal i Avancuar' },
    description: { 
      en: 'Comprehensive surgical mastery for edentulous rehabilitation led by our Turkish-trained Chief Surgeon. Focusing on complex anatomical challenges.',
      sq: 'Mjeshtëri gjithëpërfshirëse kirurgjikale për rehabilitimin pa dhëmbë e udhëhequr nga kryekirurgja jonë e trajnuar në Turqi.'
    },
    duration: { en: '4 Days', sq: '4 Ditë' },
    curriculum: ['Surgical Templates', 'Immediate Load', 'Turkish Clinical Protocols', 'Live Surgery'],
    keyTakeaways: {
      en: ['Master complex anatomical assessments', 'Navigate full-arch surgical templates', 'Implement immediate load protocols', 'Apply Turkish clinical standards'],
      sq: ['Mjeshtëroni vlerësimet anatomike komplekse', 'Navigoni shabllonet kirurgjikale të harkut të plotë', 'Zbatoni protokolle të ngarkesës së menjëhershme', 'Zbatoni standardet klinike turke']
    },
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
    category: 'Surgical'
  },
  {
    id: 'c2',
    title: { en: 'All-on-4 / All-on-6 Dental Implants', sq: 'Implantet Dentare All-on-4 / All-on-6' },
    description: { 
      en: 'Master the surgical nuances of full-arch dental implantology. This track focuses on advanced bone management and immediate loading protocols.',
      sq: 'Mjeshtëroni nuancat kirurgjikale të implantologjisë dentare të harkut të plotë. Ky modul fokusohet në menaxhimin e avancuar të kockave.'
    },
    duration: { en: '3 Days', sq: '3 Ditë' },
    curriculum: ['Surgical Planning', 'Immediate Loading Protocols', 'Prosthetic Integration', 'Complication Management'],
    keyTakeaways: {
      en: ['Optimize implant placement for All-on-4', 'Manage high-complexity bone cases', 'Integrate digital prosthetic workflows', 'Minimize surgical complications'],
      sq: ['Optimizo vendosjen e implanteve për All-on-4', 'Menaxho rastet e kockave me kompleksitet të lartë', 'Integro rrjedhat e punës protetike digjitale', 'Minimizo komplikimet kirurgjikale']
    },
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop',
    category: 'Surgical'
  },
  {
    id: 'c3',
    title: { en: 'Advanced Sinus Lift & Bone Grafting', sq: 'Sinus Lift dhe Transplant i Avancuar i Kockës' },
    description: { 
      en: 'In-depth training on maxillary sinus floor elevation and vertical bone augmentation techniques for implant site optimization.',
      sq: 'Trajnim i thelluar mbi ngritjen e sinusit maksilar dhe teknikat e rritjes vertikale të kockës.'
    },
    duration: { en: '2 Days', sq: '2 Ditë' },
    curriculum: ['Lateral Window Technique', 'Crestal Approach', 'Autogenous vs Synthetic Grafts', 'Anatomy & Complications'],
    keyTakeaways: {
      en: ['Perform advanced lateral window sinus lifts', 'Apply crestal approach techniques safely', 'Compare graft materials for vertical bone', 'Understand maxillary sinus anatomy'],
      sq: ['Kryeni ngritje të avancuara të sinusit me dritare laterale', 'Zbatoni teknikat e qasjes krestale në mënyrë të sigurt', 'Krahasoni materialet e transplantit për kockën vertikale', 'Kuptoni anatominë e sinusit maksilar']
    },
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
    category: 'Surgical'
  },
  {
    id: 'c4',
    title: { en: 'Digital Smile Design & CAD/CAM', sq: 'Dizajni Digjital i Buzëqeshjes & CAD/CAM' },
    description: { 
      en: 'Integrating intraoral scanning and CAD/CAM workflows to ensure 100% predictable aesthetic outcomes and perfect fit.',
      sq: 'Integrimi i skanimit intraoral dhe rrjedhës CAD/CAM për të siguruar rezultate estetike të parashikueshme.'
    },
    duration: { en: '3 Days', sq: '3 Ditë' },
    curriculum: ['Intraoral Scanning', 'Exocad Basics', '3D Printing Protocols', 'Milling Strategies'],
    keyTakeaways: {
      en: ['Master high-precision intraoral scanning', 'Design aesthetics using Exocad software', 'Implement 3D printing in clinical practice', 'Optimize milling for monolithic crowns'],
      sq: ['Mjeshtëroni skanimin intraoral me precizitet të lartë', 'Dizajnoni estetikën duke përdorur softuerin Exocad', 'Zbatoni printimin 3D në praktikën klinike', 'Optimizo mullirin për kurora monolitike']
    },
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
    category: 'Digital'
  },
  {
    id: 'c5',
    title: { en: 'Full Mouth Aesthetic Rehabilitation', sq: 'Rehabilitimi Estetik i Plotë' },
    description: { 
      en: 'Advanced prosthetic solutions focusing on high-translucency ceramics and functional occlusion in complex full-mouth cases.',
      sq: 'Zgjidhje protetike të avancuara të fokusuara në qeramikën me translucencë të lartë në raste komplekse.'
    },
    duration: { en: '4 Days', sq: '4 Ditë' },
    curriculum: ['Vertical Dimension of Occlusion', 'E-Max Layering Techniques', 'Functional Wax-up', 'Bonding Protocols'],
    keyTakeaways: {
      en: ['Reconstruct vertical dimension of occlusion', 'Apply advanced E-Max layering techniques', 'Develop functional and aesthetic wax-ups', 'Execute high-bond porcelain cementation'],
      sq: ['Rikonstruktoni dimensionin vertikal të okluzionit', 'Zbatoni teknika të avancuara të layering E-Max', 'Zhvilloni wax-ups funksionale dhe estetike', 'Ekzekutoni cementimin e porcelanit me lidhje të lartë']
    },
    image: 'https://images.unsplash.com/photo-1460672985063-6764ac8b9c74?q=80&w=800&auto=format&fit=crop',
    category: 'Prosthetic'
  }
];
