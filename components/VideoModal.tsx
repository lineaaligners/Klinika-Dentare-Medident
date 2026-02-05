
import React from 'react';
import { X, ShieldCheck, Activity } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 md:p-10 animate-in fade-in duration-500">
      {/* Header Info - Non-intrusive */}
      <div className="absolute top-8 left-10 hidden md:flex items-center space-x-4 z-[120]">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
          <Activity size={20} />
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 leading-none mb-1.5">Live Practice Observation</h3>
          <p className="text-xl font-display font-black text-white tracking-tight leading-none">Clinical Standards & Protocols</p>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-4 bg-white/5 hover:bg-white/20 text-white rounded-full transition-all z-[120] border border-white/10"
      >
        <X size={24} />
      </button>
      
      <div className="w-full max-w-6xl aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.15)] relative border border-white/10 bg-black">
        <video 
          className="w-full h-full object-cover"
          controls
          autoPlay
          muted
          loop
          playsInline
          poster="https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/freepik__recreate-the-locations-more-modern-bright-natural-__5205.jpeg"
        >
          <source src="https://i.imgur.com/MwS5YXy.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Clinical Overlay Label */}
        <div className="absolute bottom-8 right-8 flex items-center space-x-3 bg-slate-950/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg pointer-events-none">
          <ShieldCheck size={14} className="text-blue-500" />
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Verified Surgical Environment PRN-01</span>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
