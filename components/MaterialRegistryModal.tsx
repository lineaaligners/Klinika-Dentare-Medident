
import React, { useState } from 'react';
import { X, ShieldCheck, Zap, Award, Globe, Check, Info, ArrowRight, BarChart3, Microscope, Landmark, Monitor, Printer } from 'lucide-react';

interface MaterialRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'sq';
}

const MaterialRegistryModal: React.FC<MaterialRegistryModalProps> = ({ isOpen, onClose, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<'Implants' | 'Ceramics & Zirconia' | 'Digital Tech'>('Implants');

  if (!isOpen) return null;

  const materials = {
    Implants: [
      { 
        name: 'Astra Tech (Dentsply Sirona)', 
        origin: 'Sweden / USA', 
        success: '99.4%', 
        warranty: 'Lifetime', 
        features: ['OsseoSpeed® Surface', 'Microthread® Neck', 'Conical Seal Design™', 'Bone Maintenance'] 
      },
      { 
        name: 'Osstem Implant (TSIII)', 
        origin: 'South Korea', 
        success: '98.9%', 
        warranty: 'Lifetime', 
        features: ['SA Surface Technology', 'High Primary Stability', 'Grade 4 Titanium', 'Fast Osseointegration'] 
      }
    ],
    'Ceramics & Zirconia': [
      { 
        name: 'Deprag Zirconia', 
        origin: 'Germany', 
        success: '99.6%', 
        warranty: '15 Years', 
        features: ['Multilayer Aesthetic Blocks', 'High Flexural Strength', 'Super-translucency', 'Excellent Biocompatibility'] 
      },
      { 
        name: 'Ivoclar Vivadent e.max®', 
        origin: 'Liechtenstein', 
        success: '97.8%', 
        warranty: '10 Years', 
        features: ['Lithium Disilicate Ceramic', 'Market-leading Aesthetics', 'High Fracture Toughness', 'Minimally Invasive'] 
      }
    ],
    'Digital Tech': [
      { 
        name: 'Dentsply Sirona (CAD/CAM)', 
        origin: 'Germany', 
        success: 'Institutional', 
        warranty: 'Standard', 
        features: ['Primescan Scanning', 'CEREC Primemill', 'Absolute Precision', 'Same-day Restorations'] 
      },
      { 
        name: 'SprintRay 3D Printing', 
        origin: 'USA', 
        success: 'Institutional', 
        warranty: 'Standard', 
        features: ['Surgical Guide Printing', 'Night Guard Fabrication', 'Biocompatible Resins', 'High-speed Production'] 
      },
      { 
        name: 'Scheu Dental (Pressure Moulding)', 
        origin: 'Germany', 
        success: 'Institutional', 
        warranty: 'Standard', 
        features: ['BIOSTAR® Technology', 'Orthodontic Precision', 'Durable Retention', 'Certified Clear Aligners'] 
      }
    ]
  };

  const comparisonData = [
    { metric: 'Digital Scanning', medident: 'Sirona Primescan (HD)', local: 'Analog Impressions', impact: 'Zero Gag Reflex / Perfect Fit' },
    { metric: 'Prosthetic Milling', medident: 'Deprag / Ivoclar e.max', local: 'Non-branded Zirconia', impact: 'Natural Light Reflection' },
    { metric: '3D Surgical Guides', medident: 'SprintRay Precision', local: 'Free-hand Placement', impact: '100% Predictable Surgery' },
    { metric: 'Moulding Tech', medident: 'Scheu Dental (DE)', local: 'Standard Vacuum', impact: 'Institutional Durability' }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 md:p-10 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-full max-h-[85vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative border border-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Microscope size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-slate-900 tracking-tight leading-none mb-1">Clinical Material Registry</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory: Sirona • SprintRay • Scheu • Deprag • Ivoclar</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left: Materials List */}
            <div className="lg:col-span-7">
              <div className="mb-12">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6">Institutional Inventory Selection</h4>
                <div className="flex flex-wrap gap-3 mb-10">
                  {(['Implants', 'Ceramics & Zirconia', 'Digital Tech'] as const).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-500'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {materials[selectedCategory].map((m, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 hover:border-blue-500 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h5 className="text-xl font-display font-black text-slate-900 mb-1">{m.name}</h5>
                          <p className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <Globe size={12} className="mr-2" /> {m.origin}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Metric</p>
                          <p className="text-2xl font-display font-black text-slate-900">{m.success}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {m.features.map((f, fi) => (
                          <div key={fi} className="flex items-center space-x-2 text-[10px] font-bold text-slate-600">
                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Warranty</span>
                         <span className="text-xs font-black text-slate-900 uppercase">{m.warranty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-blue-50 border border-blue-100 rounded-3xl flex items-start space-x-4">
                <Info size={24} className="text-blue-600 shrink-0 mt-1" />
                <div>
                  <h6 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">Digital Infrastructure Statement</h6>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Medident utilizes a fully integrated digital workflow. From <strong>Sirona Primescan</strong> intraoral data to <strong>SprintRay</strong> surgical guides and <strong>Deprag</strong> zirconia milling, our material choice is selected for institutional longevity and biological integration.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Comparison Table */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white">
                <h4 className="text-xl font-display font-black tracking-tight mb-8 flex items-center">
                  <BarChart3 size={24} className="mr-3 text-blue-500" />
                  Technology Comparison
                </h4>
                
                <div className="space-y-8">
                  {comparisonData.map((row, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-6 last:border-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">{row.metric}</p>
                      <div className="grid grid-cols-2 gap-8 mb-4">
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Medident Center</p>
                          <p className="text-sm font-black text-white flex items-center">
                            <Check size={14} className="mr-2 text-green-500" /> {row.medident}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Standard Dental Lab</p>
                          <p className="text-sm font-bold text-white/50">{row.local}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-blue-100/40 font-medium italic">Clinical Advantage: {row.impact}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verifiable Material Passports</p>
                  <Award size={16} className="text-blue-500" />
                </div>
              </div>

              <div className="mt-10 text-center">
                <div className="inline-flex items-center space-x-3 text-slate-400">
                  <Monitor size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Full Digital Integration Portfolio</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 border-t border-slate-100 text-center bg-white">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">MEDIDENT INSTITUTIONAL ARCHIVE • PEJA • KOSOVO</p>
        </div>
      </div>
    </div>
  );
};

export default MaterialRegistryModal;
