import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Award, Globe } from 'lucide-react';

const TrustBar: React.FC<{ lang: 'en' | 'sq' }> = ({ lang }) => {
  const logos = [
    { name: 'ISO 9001', icon: <ShieldCheck className="w-5 h-5 text-blue-500" /> },
    { name: 'ITI Member', icon: <Award className="w-5 h-5 text-blue-500" /> },
    { name: 'Global Patents', icon: <Globe className="w-5 h-5 text-blue-500" /> },
    { name: 'Clinical Board', icon: <Star className="w-5 h-5 text-blue-500" /> }
  ];

  return (
    <div className="py-12 bg-white border-y border-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Google Reviews Widget Mock */}
          <div className="flex items-center gap-6 bg-slate-50 px-8 py-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex -space-x-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-10 h-10 p-2 bg-white rounded-full shadow-sm"  referrerPolicy="no-referrer"/>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-900">
                4.9/5 <span className="text-slate-400 ml-2">Google Reviews</span>
              </p>
            </div>
          </div>

          {/* Logo Reel */}
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-500">
            {logos.map((logo) => (
              <div key={logo.name} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-default">
                {logo.icon}
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
