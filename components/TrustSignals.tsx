import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Activity, 
  Plane, 
  CheckCircle, 
  Sparkles, 
  Heart, 
  ChevronRight, 
  DollarSign, 
  Award, 
  Users, 
  MessageSquare,
  BadgeAlert,
  Sliders,
  Glasses
} from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  city: string;
  treatment: string;
  stars: number;
  savings: string;
  quote: string;
  beforeImg: string;
  afterImg: string;
}

interface TrustSignalsProps {
  lang: 'en' | 'sq';
}

const TrustSignals: React.FC<TrustSignalsProps> = ({ lang }) => {
  // We keep text in English as requested for the UK target audience components, 
  // but let's make it fully responsive and visually dazzling.
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');
  const [toggleStates, setToggleStates] = useState<{ [key: number]: 'before' | 'after' }>({
    1: 'after',
    2: 'after',
    3: 'after'
  });

  const testimonials: Testimonial[] = [];

  const trustBadges = [
    {
      id: 'exp',
      title: '27 Years Experience',
      desc: 'Surgical Mastery Since 1999',
      icon: <Award className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'patients',
      title: '500+ International Patients',
      desc: 'Trusted UK & EU Dental Tourists',
      icon: <Users className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'savings',
      title: '60-70% Savings vs UK Prices',
      desc: 'Harley Street Quality, Peja Value',
      icon: <DollarSign className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'consult',
      title: 'Free Online Consultation',
      desc: 'Custom Diagnostics & Fixed Quote',
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'english',
      title: 'English Speaking Staff',
      desc: 'Seamless Flawless Communication',
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />
    }
  ];

  const journeySteps = [
    {
      step: '1',
      title: 'Free Online Consultation',
      desc: 'Connect with our head oral surgeon via WhatsApp or Zoom. Submit radiographs or photos for initial oral diagnosis.',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      step: '2',
      title: 'Receive Treatment Plan & Quote',
      desc: 'Get a comprehensive dental restoration strategy with completely transparent, fixed pricing—no hidden costs guaranteed.',
      icon: <Sliders className="w-5 h-5" />
    },
    {
      step: '3',
      title: 'Book Flights to Pristina',
      desc: 'Enjoy direct, budget-friendly 3-hour flights from London, Manchester, or Munich to Pristina International Airport.',
      icon: <Plane className="w-5 h-5" />
    },
    {
      step: '4',
      title: 'We Handle Everything On Arrival',
      desc: 'From VIP premium airport transfers to luxury local accommodation in historic Peja, our team welcomes you completely.',
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      step: '5',
      title: 'Return Home With Your New Smile',
      desc: 'Complete your surgical dental protocol under expert world-class clinical care, saving thousands while gaining total confidence.',
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  const handleToggle = (id: number, state: 'before' | 'after') => {
    setToggleStates(prev => ({
      ...prev,
      [id]: state
    }));
  };

  return (
    <section id="trust-signals" className="py-32 bg-slate-50 relative overflow-hidden scroll-mt-24">
      {/* Dynamic graphic absolute backdrops */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* GOOGLE REVIEWS STYLE HEAD WIDGET & INTRO */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-20 gap-8 border-b border-slate-200 pb-12">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-600/10 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>World-Class Medical Tourism</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none mb-3">
              Smile Reconstructions <span className="text-blue-600">You Can Trust</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl font-medium mt-1">
              Join hundreds of patients from across London, Manchester, and Birmingham who unlocked dental savings of 60-70% without compromising on world-class surgical mastery.
            </p>
          </div>

          {/* Genuine-looking Google Reviews Badge Widget */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-md shrink-0 cursor-default"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center p-2 shadow-sm border border-slate-100">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.23-.66-.35-1.36-.35-2.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black text-slate-900">4.9 / 5</span>
                <div className="flex text-yellow-400 ml-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Google Reviews
              </p>
            </div>
          </motion.div>
        </div>


        {/* TRUST BADGES ROW (Horizontal flowing grid layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-24">
          {trustBadges.map((badge, idx) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center group hover:border-blue-500 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                {badge.icon}
              </div>
              <h4 className="text-slate-950 font-display font-black text-base leading-tight tracking-tight mb-1">
                {badge.title}
              </h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                {badge.desc}
              </p>
            </motion.div>
          ))}
        </div>




        {/* UK PATIENT JOURNEY STEPS (Horizontal) */}
        <div>
          <div className="text-center mb-16">
            <span className="text-blue-600 font-extrabold text-xs uppercase tracking-widest block mb-2">Straightforward Process</span>
            <h3 className="text-4xl font-display font-black text-slate-900 tracking-tight">Your 5-Step Smile Journey</h3>
            <p className="text-slate-500 text-base max-w-xl mx-auto mt-2 font-medium">
              We coordinate every single stage for our UK patients. Leaving the UK for premium care has never been so clean and simple.
            </p>
          </div>

          <div className="relative">
            {/* Horizontal Line background for desktop steps */}
            <div className="absolute top-[38px] left-[10%] right-[10%] h-[2px] bg-blue-100 hidden lg:block -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {journeySteps.map((step, idx) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center lg:items-start text-center lg:text-left relative group hover:border-blue-500 hover:shadow-md transition-all duration-300"
                >
                  {/* Step bubble counter */}
                  <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-600/10 font-display font-black text-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-[10px] font-black w-5 h-5 rounded-full border border-blue-100 flex items-center justify-center">
                      {step.step}
                    </span>
                    {step.icon}
                  </div>

                  <h4 className="text-slate-950 font-display font-black text-base tracking-tight mb-3">
                    {step.title}
                  </h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustSignals;
