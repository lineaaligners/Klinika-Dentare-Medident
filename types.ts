
export interface Service {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  text: string;
  rating: number;
  image: string;
}

export interface BeforeAfter {
  id: string;
  category: Record<string, string>;
  before: string;
  after: string;
  labelBefore?: string;
  labelAfter?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: Record<string, string>;
  bio: Record<string, string>;
  image: string;
  specialties: string[];
  education: Record<string, string[]>;
  experience: Record<string, string>;
  languages: string[];
  certifications: string[];
  research?: Record<string, string[]>;
  links?: { label: string; url: string }[];
}

export interface BlogPost {
  id: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  authorId: string;
  date: string;
  image: string;
  category: Record<string, string>;
  readTime: Record<string, string>;
}

export interface Course {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  duration: Record<string, string>;
  curriculum: string[];
  keyTakeaways: Record<string, string[]>;
  image: string;
  category: 'Hands-on' | 'Online' | '1-on-1';
  instructorId: string;
}

export interface FAQ {
  id: string;
  question: Record<string, string>;
  answer: Record<string, string>;
  category: 'clinical' | 'logistics' | 'finance';
}

export interface Technology {
  id: string;
  name: string;
  description: Record<string, string>;
  icon: string;
  image: string;
}
