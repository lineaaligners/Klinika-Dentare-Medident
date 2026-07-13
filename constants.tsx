
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

// Staff order: Dr. Lendita, Dr. Faton, Dr. Muharrem, then the rest.
// NOTE: Upload the 3 new photos (Muharrem, Fjolla, Arbresha) to the same
// Supabase "medident1" bucket with the filenames referenced below.
export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Lendita Islami Nallbani',
    role: { en: 'Chief Oral Surgeon', sq: 'Kryekirurge Orale' },
    bio: {
      en: 'Specialist in Oral Surgery and Implantology with 27 years of clinical practice. Leads the surgical board at Medident, founded in 1999.',
      sq: 'Specialiste e Kirurgjisë Orale dhe Implantologe me 27 vite praktikë klinike. Udhëheq bordin kirurgjikal të Medident, themeluar në vitin 1999.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/519508741_18258447043303287_5432944367248736037_n.jpg',
    specialties: ['Oral Surgery', 'Implantology', 'Bone Augmentation'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina', 'Specialization in Oral Surgery'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës', 'Specializimi në Kirurgjinë Orale']
    },
    experience: { en: '27+ Years Clinical Practice', sq: '27+ Vite Praktikë Klinike' },
    languages: ['Albanian', 'English', 'German'],
    certifications: ['Specialist in Oral Surgery', 'Implantology']
  },
  {
    id: '2',
    name: 'Dr. Faton Loci',
    role: { en: 'Implantologist', sq: 'Implantolog' },
    bio: {
      en: 'Implantologist with 15+ years of experience and advanced implantology training.',
      sq: 'Implantolog me 15+ vite përvojë dhe trajnim të avancuar në implantologji.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/520120059_18258447091303287_3697667781056904147_n.jpg',
    specialties: ['Implantology', 'Restorative Dentistry'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina', 'Advanced Implantology Training'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës', 'Trajnim i Avancuar në Implantologji']
    },
    experience: { en: '15+ Years Clinical Practice', sq: '15+ Vite Praktikë Klinike' },
    languages: ['Albanian', 'English'],
    certifications: ['Advanced Implantology Training']
  },
  {
    id: '3',
    name: 'Dr. Muharrem Thaqi',
    role: { en: 'Dentist', sq: 'Stomatolog' },
    bio: {
      en: 'General dentist at Medident, focused on restorative dentistry and everyday patient care.',
      sq: 'Stomatolog në Medident, i fokusuar në stomatologjinë restauruese dhe kujdesin e përditshëm ndaj pacientëve.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/520224741_18258447415303287_7439654276461004636_n.jpg',
    specialties: ['General Dentistry', 'Restorative Dentistry'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës']
    },
    experience: { en: 'Clinical Practice at Medident', sq: 'Praktikë Klinike në Medident' },
    languages: ['Albanian', 'English'],
    certifications: ['Doctor of Dental Medicine']
  },
  {
    id: '4',
    name: 'Dr. Fjolla Kelmendi',
    role: { en: 'Dentist', sq: 'Stomatologe' },
    bio: {
      en: 'General dentist at Medident, dedicated to preventive care and patient comfort.',
      sq: 'Stomatologe në Medident, e përkushtuar ndaj kujdesit parandalues dhe komoditetit të pacientëve.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/520249730_18258447649303287_7074860732315032093_n.jpg',
    specialties: ['General Dentistry', 'Preventive Care'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës']
    },
    experience: { en: 'Clinical Practice at Medident', sq: 'Praktikë Klinike në Medident' },
    languages: ['Albanian', 'English'],
    certifications: ['Doctor of Dental Medicine']
  },
  {
    id: '5',
    name: 'Dr. Arbresha Nila',
    role: { en: 'Dentist', sq: 'Stomatologe' },
    bio: {
      en: 'General dentist at Medident, focused on aesthetic and restorative treatments.',
      sq: 'Stomatologe në Medident, e fokusuar në trajtimet estetike dhe restauruese.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/518903917_18258447679303287_8056766841269486250_n.jpg',
    specialties: ['General Dentistry', 'Aesthetic Dentistry'],
    education: {
      en: ['Faculty of Medicine, University of Prishtina'],
      sq: ['Fakulteti i Mjekësisë, Universiteti i Prishtinës']
    },
    experience: { en: 'Clinical Practice at Medident', sq: 'Praktikë Klinike në Medident' },
    languages: ['Albanian', 'English'],
    certifications: ['Doctor of Dental Medicine']
  },
  {
    id: '6',
    name: 'Arjeta Muhaxheri Morina',
    role: { en: 'Clinic Manager', sq: 'Menaxhere' },
    bio: {
      en: 'Manages clinic operations and coordinates every patient journey at Medident, from first contact to follow-up.',
      sq: 'Menaxhon operacionet e klinikës dhe koordinon rrugëtimin e çdo pacienti në Medident, nga kontakti i parë deri te kontrollet pas trajtimit.'
    },
    image: 'https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/520877630_18258447793303287_6370335904948863904_n.jpg',
    specialties: ['Clinic Operations', 'Patient Coordination'],
    education: {
      en: ['Clinic Management, Medident'],
      sq: ['Menaxhimi i Klinikës, Medident']
    },
    experience: { en: 'Clinic Management at Medident', sq: 'Menaxhimi i Klinikës në Medident' },
    languages: ['Albanian', 'English'],
    certifications: ['Patient Care Coordination']
  }
];

export const TOURISM_STEPS = (lang: 'en' | 'sq') => [
  {
    title: lang === 'en' ? 'Case Review' : 'Vlerësimi i Rastit',
    description: lang === 'en' ? 'Your X-rays are reviewed by our surgical team led by Dr. Lendita.' : 'Radiografitë tuaja rishikohen nga ekipi ynë kirurgjikal i udhëhequr nga Dr. Lendita.',
    icon: <Sparkles className="w-8 h-8 text-blue-600" />
  },
  {
    title: lang === 'en' ? 'Airport Pickup' : 'Pritja në Aeroport',
    description: lang === 'en' ? 'Private transfer from Prishtina Airport (PRN) to Peja.' : 'Transfer privat nga Aeroporti i Prishtinës (PRN) në Pejë.',
    icon: <Plane className="w-8 h-8 text-blue-600" />
  },
  {
    title: lang === 'en' ? 'Hotel & Stay' : 'Hoteli & Qëndrimi',
    description: lang === 'en' ? 'Comfortable partner hotels in the heart of Peja.' : 'Hotele partnere komode në zemër të Pejës.',
    icon: <Hotel className="w-8 h-8 text-blue-600" />
  },
  {
    title: lang === 'en' ? 'Your Treatment' : 'Trajtimi Juaj',
    description: lang === 'en' ? 'Specialized surgery in a modern, sterile clinical environment.' : 'Kirurgji e specializuar në një mjedis klinik modern dhe steril.',
    icon: <Shield className="w-8 h-8 text-blue-600" />
  }
];

// TODO: Replace with real before/after cases (with patient consent) or hide this section.
export const GALLERY: BeforeAfter[] = [
  { id: '1', category: { en: 'Surgical Case', sq: 'Rast Kirurgjikal' }, before: 'https://picsum.photos/seed/b1/400/300', after: 'https://picsum.photos/seed/a1/400/300' },
  { id: '2', category: { en: 'Implantology', sq: 'Implantologjia' }, before: 'https://picsum.photos/seed/b2/400/300', after: 'https://picsum.photos/seed/a2/400/300' }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: { en: 'What to Expect From Dental Implant Treatment', sq: 'Çfarë të Prisni nga Trajtimi me Implante Dentare' },
    excerpt: { en: 'A practical overview of the implant journey at Medident, from first scan to final crown.', sq: 'Një përmbledhje praktike e rrugëtimit me implante në Medident, nga skanimi i parë deri te kurora finale.' },
    content: { 
      en: 'Dental implants are the modern standard for replacing missing teeth. At Medident, every case starts with a clinical assessment and X-ray review by our surgical team, led by our Chief Oral Surgeon Dr. Lendita. From there, we plan your treatment, place the implant in a sterile surgical environment, and complete the restoration with a custom crown.',
      sq: 'Implantet dentare janë standardi modern për zëvendësimin e dhëmbëve që mungojnë. Në Medident, çdo rast fillon me një vlerësim klinik dhe rishikim të radiografive nga ekipi ynë kirurgjikal, i udhëhequr nga Kryekirurgja jonë Orale Dr. Lendita. Më pas, planifikojmë trajtimin tuaj, vendosim implantin në një mjedis kirurgjikal steril dhe përfundojmë restaurimin me një kurorë të personalizuar.'
    },
    authorId: '1',
    date: 'Oct 24, 2024',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
    category: { en: 'Implantology', sq: 'Implantologjia' },
    readTime: { en: '6 min read', sq: '6 min lexim' }
  }
];

export const ACADEMY_COURSES: Course[] = [
  {
    id: 'c1',
    title: { en: 'Advanced Surgical All-on-X', sq: 'All-on-X Kirurgjikal i Avancuar' },
    description: { 
      en: 'Comprehensive surgical mastery for edentulous rehabilitation led by our Chief Oral Surgeon. Focusing on complex anatomical challenges.',
      sq: 'Mjeshtëri gjithëpërfshirëse kirurgjikale për rehabilitimin pa dhëmbë e udhëhequr nga Kryekirurgja jonë Orale.'
    },
    duration: { en: '4 Days', sq: '4 Ditë' },
    curriculum: ['Surgical Templates', 'Immediate Load', 'Digital Planning', 'Live Surgery'],
    keyTakeaways: {
      en: ['Master complex anatomical assessments', 'Navigate full-arch surgical templates', 'Implement immediate load protocols', 'Apply evidence-based surgical standards'],
      sq: ['Mjeshtëroni vlerësimet anatomike komplekse', 'Navigoni shabllonet kirurgjikale të harkut të plotë', 'Zbatoni protokolle të ngarkesës së menjëhershme', 'Zbatoni standarde kirurgjikale të bazuara në evidencë']
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
      en: 'Integrating intraoral scanning and CAD/CAM workflows to ensure predictable aesthetic outcomes and perfect fit.',
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
