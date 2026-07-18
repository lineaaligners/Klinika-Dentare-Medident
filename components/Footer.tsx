
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Download, Newspaper, Microscope } from 'lucide-react';

interface FooterProps {
  onOpenGuide?: () => void;
  onOpenMaterials?: () => void;
  onBlogClick?: () => void;
  lang: 'en' | 'sq';
}

const Footer: React.FC<FooterProps> = ({ onOpenGuide, onOpenMaterials, onBlogClick, lang }) => {
  return (
    <footer className="bg-slate-50 pt-24 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <span className="text-3xl font-display font-black tracking-tighter text-slate-900 mb-6 block">
              MEDIDENT<span className="text-blue-600">.</span>
            </span>
            <p className="text-slate-500 leading-relaxed mb-8 font-medium">
              A legacy of 27 years in elite dentistry. We bridge the gap between world-class medical expertise and luxury travel.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white p-2 rounded-lg text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-white p-2 rounded-lg text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-white p-2 rounded-lg text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase tracking-[0.2em] text-[10px]">Services</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><a href="#services" className="hover:text-blue-600 transition-colors">Veneers & Laminates</a></li>
              <li><a href="#services" className="hover:text-blue-600 transition-colors">Dental Implants</a></li>
              <li><a href="#services" className="hover:text-blue-600 transition-colors">Digital Smile Design</a></li>
              <li><a href="#services" className="hover:text-blue-600 transition-colors">Teeth Whitening</a></li>
              <li><a href="#services" className="hover:text-blue-600 transition-colors">Root Canal Therapy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase tracking-[0.2em] text-[10px]">Patient Care</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><a href="#gallery" className="hover:text-blue-600 transition-colors">Before & After</a></li>
              <li><a href="#tourism" className="hover:text-blue-600 transition-colors">Your Journey</a></li>
              <li><button onClick={onBlogClick} className="hover:text-blue-600 transition-colors flex items-center space-x-2 text-left">
                <Newspaper size={14} />
                <span>Clinical Blog</span>
              </button></li>
              <li><button onClick={onOpenMaterials} className="hover:text-blue-600 transition-colors flex items-center space-x-2 text-left text-blue-600">
                <Microscope size={14} />
                <span>Material Comparison Registry</span>
              </button></li>
              <li><button onClick={onOpenGuide} className="hover:text-blue-600 transition-colors flex items-center space-x-2 text-left">
                <Download size={14} />
                <span>Download Travel Guide</span>
              </button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase tracking-[0.2em] text-[10px]">The Clinic</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><a href="#doctors" className="hover:text-blue-600 transition-colors">Our Academy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Technologies</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-blue-600 transition-colors">Contact Support</a></li>
              <li className="flex items-center text-blue-600 font-black">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                OPEN TODAY
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <p>© 2026 Medident Clinic. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
