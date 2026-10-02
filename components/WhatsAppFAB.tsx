import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WA_NUMBER = '38349772307';

/** WhatsApp icon SVG (official green brand icon) */
const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/**
 * Global floating WhatsApp button â visible on every page except portal/verify.
 * Shows a small tooltip on first render, dismissable.
 */
const WhatsAppFAB: React.FC = () => {
  const [tipDismissed, setTipDismissed] = useState(() => {
    try { return localStorage.getItem('wa_tip_dismissed') === '1'; } catch { return false; }
  });
  const [showTip, setShowTip] = useState(!tipDismissed);

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTip(false);
    try { localStorage.setItem('wa_tip_dismissed', '1'); } catch {}
  };

  const waUrl = `https://wa.me/${WA_NUMBER}?text=Guten%20Tag%2C%20ich%20m%C3%B6chte%20einen%20Termin%20bei%20Medident%20anfragen.`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[90] flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="relative bg-white border border-slate-200 rounded-2xl shadow-xl px-4 py-3 max-w-[220px]"
          >
            <button
              onClick={dismiss}
              className="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
              aria-label="Close"
            >
              <X size={10} />
            </button>
            <p className="text-xs font-black text-slate-900 mb-0.5">Fragen? Wir antworten.</p>
            <p className="text-[10px] text-slate-500 font-medium">WhatsApp Â· Antwort innerhalb 24 h</p>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-5 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
            <div className="absolute -bottom-2.5 right-[18px] w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-slate-200 -z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp kontaktieren"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 280, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd59] text-white rounded-full shadow-xl shadow-green-500/30 flex items-center justify-center transition-colors"
        onClick={() => setShowTip(false)}
      >
        <WhatsAppIcon size={26} />
      </motion.a>
    </div>
  );
};

export default WhatsAppFAB;
