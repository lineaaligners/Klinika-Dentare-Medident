import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { fetchPublicTestimonials, Testimonial } from '../services/academyPublic';

const initials = (name: string) =>
  name
    .replace(/^(prof\.?\s+)?(dr\.?\s+)/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

/**
 * "What doctors say" on the public Academy page: feedback the doctor allowed to
 * be quoted and the academy chose to show (Admin → Overview). Renders nothing
 * until there is at least one, and only loads once the Academy page is opened.
 */
const AcademyTestimonials: React.FC<{ lang: 'en' | 'sq'; active: boolean }> = ({ lang, active }) => {
  const [items, setItems] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    if (!active || items !== null) return;
    let alive = true;
    fetchPublicTestimonials().then((list) => alive && setItems(list));
    return () => {
      alive = false;
    };
  }, [active, items]);

  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24 md:mb-40">
      <div className="text-center mb-14">
        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">
          {lang === 'en' ? 'From doctors who took the courses' : 'Nga mjekët që i ndoqën kurset'}
        </p>
        <h3 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
          {lang === 'en' ? (
            <>
              What doctors
              <br />
              <span className="text-blue-600">say about it.</span>
            </>
          ) : (
            <>
              Çfarë thonë
              <br />
              <span className="text-blue-600">mjekët.</span>
            </>
          )}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.slice(0, 6).map((t, i) => {
          const course = lang === 'sq' ? t.course_title_sq || t.course_title_en : t.course_title_en || t.course_title_sq;
          return (
            <motion.figure
              key={`${t.name}-${t.date}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="min-w-0 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="flex gap-0.5 mb-5" role="img" aria-label={`${t.rating}/5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={15}
                    className={n <= t.rating ? 'text-amber-400' : 'text-slate-200'}
                    fill="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-slate-700 font-medium leading-relaxed flex-1 whitespace-pre-line break-words">“{t.comment}”</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 text-sm font-black flex items-center justify-center flex-shrink-0">
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-slate-900 truncate">{t.name}</span>
                  <span className="block text-[10px] font-black uppercase tracking-widest leading-relaxed text-slate-400 mt-0.5">
                    {[t.city, course].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </section>
  );
};

export default AcademyTestimonials;
