
import React from 'react';
import { GALLERY } from '../constants';
import { Eye, Microscope } from 'lucide-react';

interface GalleryProps {
  lang: 'en' | 'sq';
}

const Gallery: React.FC<GalleryProps> = ({ lang }) => {
  return (
    <section id="gallery" className="py-32 bg-slate-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest mb-6">
              <Microscope size={14} />
              <span>Clinical Blog</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 tracking-tight">
              Clinical Outcomes & <br /><span className="text-blue-600">Transformations.</span>
            </h3>
          </div>
          <div className="max-w-md">
            <p className="text-slate-500 text-base font-medium leading-relaxed mb-6">
              A peer-reviewed archive of reconstructive dentistry and aesthetic rehabilitations. All cases displayed represent actual patient results verified by our clinical board.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {GALLERY.map((item) => (
            <div key={item.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-500 transition-all shadow-sm">
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                {/* Before Image */}
                <div className="absolute inset-0 z-0">
                  <img src={item.before} alt="Before" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
                  <div className="absolute top-6 left-6 bg-slate-900/80 text-white text-[8px] px-3 py-1 rounded font-black tracking-widest uppercase">Clinical: Pre-Op</div>
                </div>
                
                {/* After Image Overlay */}
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <img src={item.after} alt="After" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6 bg-blue-600 text-white text-[8px] px-3 py-1 rounded font-black tracking-widest uppercase shadow-lg">Clinical: Post-Op</div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <a href="#contact" className="w-full bg-slate-900 text-white py-3.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-blue-600 transition-all">
                    <Eye size={14} />
                    <span>View Clinical Case</span>
                  </a>
                </div>
              </div>
              
              <div className="p-8">
                {/* Fixed Record access */}
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">{item.category[lang]}</p>
                <h4 className="text-xl font-display font-black text-slate-900 mb-4 tracking-tight leading-none">Patient Case #{item.id}142</h4>
                <div className="flex items-center text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                  <span>Prosthetic Restoration • 8-Day Protocol</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <a href="#contact" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg">
            Access Full Results Archive
          </a>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
