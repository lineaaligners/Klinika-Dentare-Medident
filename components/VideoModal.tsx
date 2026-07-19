import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Play } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <X size={20} />
            </button>

            {/* Clinic photo with overlay */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src="/photos/clinic-hero.jpg"
                alt="Klinika Dentare Medident"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mb-6">
                  <Play size={32} className="text-white fill-white ml-1" />
                </div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Klinika Dentare Medident</p>
                <h3 className="text-3xl md:text-4xl font-display font-black text-white tracking-tighter mb-2">
                  Pejë, Kosovë
                </h3>
                <p className="text-white/60 font-medium text-sm">Since 1999 · 13,000+ patients</p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Want to see more?</p>
                <p className="text-xl font-display font-black text-slate-900 tracking-tight">
                  Visit us on Instagram — <span className="text-blue-600">@medidentks</span>
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a
                  href="https://www.instagram.com/medidentks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Instagram
                </a>
                <a
                  href="https://wa.me/38349772307"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <MessageSquare size={14} />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
