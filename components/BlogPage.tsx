
import React, { useState } from 'react';
import { BLOG_POSTS, DOCTORS } from '../constants';
import { BlogPost } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  ChevronRight, 
  BookOpen, 
  Search, 
  Filter, 
  FileText,
  UserCheck,
  Tag,
  Share2
} from 'lucide-react';

interface BlogPageProps {
  onBack: () => void;
  lang: 'en' | 'sq';
}

const BlogPage: React.FC<BlogPageProps> = ({ onBack, lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = Array.from(new Set(BLOG_POSTS.map(post => post.category[lang])));

  const filteredPosts = BLOG_POSTS.filter(post => 
    post.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category[lang].toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activePost) {
    const author = DOCTORS.find(d => d.id === activePost.authorId);
    return (
      <div className="min-h-screen bg-white animate-in fade-in duration-500">
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <button 
              onClick={() => setActivePost(null)}
              className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest">{lang === 'en' ? 'Return to Feed' : 'Kthehu te Blogu'}</span>
            </button>
            <span className="text-lg font-display font-black tracking-tighter text-slate-900">
              MEDIDENT<span className="text-blue-600">.</span>READ
            </span>
            <div className="hidden md:flex items-center space-x-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <span>PRN-01 • ARTICLE</span>
            </div>
          </div>
        </header>

        <main className="pt-32 pb-32">
          <article className="max-w-4xl mx-auto px-6">
            <div className="mb-12 text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-8">
                {activePost.category[lang]}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
                {activePost.title[lang]}
              </h1>
              <div className="flex items-center justify-center space-x-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center space-x-2"><Calendar size={12} /> <span>{activePost.date}</span></span>
                <span className="flex items-center space-x-2"><Clock size={12} /> <span>{activePost.readTime[lang]}</span></span>
              </div>
            </div>

            <div className="aspect-video rounded-3xl overflow-hidden mb-16 shadow-2xl">
              <img src={activePost.image} className="w-full h-full object-cover" alt={activePost.title[lang]} />
            </div>

            <div className="grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl font-medium text-slate-600 leading-relaxed mb-12 border-l-4 border-blue-600 pl-8 italic">
                    {activePost.excerpt[lang]}
                  </p>
                  <div className="text-slate-700 leading-loose space-y-8 font-medium">
                    {activePost.content[lang]}
                    {/* Simulated extended content for readable look */}

                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="sticky top-40 space-y-12">
                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">{lang === 'en' ? 'Author' : 'Autori'}</h4>
                    <div className="flex items-center space-x-4 mb-6">
                      <img src={author?.image} className="w-14 h-14 rounded-xl object-cover object-top" alt={author?.name} />
                      <div>
                        <p className="text-xs font-black text-slate-900 leading-none mb-1.5">{author?.name}</p>
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{author?.role[lang]}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      {author?.bio[lang]}
                    </p>
                    <div className="mt-8 pt-8 border-t border-slate-100">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">© 2026 MEDIDENT CLINICAL BOARD</p>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center space-x-3 bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                    <Share2 size={16} />
                    <span>{lang === 'en' ? 'Share Insight' : 'Shpërndaje'}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-500">
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-widest">{lang === 'en' ? 'Return to Clinic' : 'Kthehu në Klinikë'}</span>
          </button>
          <span className="text-lg font-display font-black tracking-tighter text-slate-900">
            MEDIDENT<span className="text-blue-600">.</span>BLOG
          </span>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TERMINAL: PRN-ARCHIVE</span>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 border-b border-slate-100 pb-12">
            <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              {lang === 'en' ? 'Clinical Archive.' : 'Arkiva Klinike.'}
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl">
              {lang === 'en' ? 'Verified research, surgical outcomes, and diagnostic protocols.' : 'Kërkime të verifikuara, rezultate kirurgjikale dhe protokolle diagnostikuese.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-20">
              {filteredPosts.map((post, idx) => {
                const author = DOCTORS.find(d => d.id === post.authorId);
                return (
                  <article key={post.id} className="group border-b border-slate-50 pb-20 last:border-0">
                    <div className="grid md:grid-cols-2 gap-10 items-start">
                      <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-sm bg-slate-100 cursor-pointer" onClick={() => setActivePost(post)}>
                        <img src={post.image} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={post.title[lang]} />
                      </div>
                      <div className="flex flex-col h-full">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded w-fit mb-4">{post.category[lang]}</span>
                        <h2 className="text-2xl font-display font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setActivePost(post)}>
                          {post.title[lang]}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-3">{post.excerpt[lang]}</p>
                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
                          <div className="flex items-center space-x-3">
                            <img src={author?.image} className="w-6 h-6 rounded-full grayscale" alt={author?.name} />
                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{author?.name}</span>
                          </div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{post.readTime[lang]}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center"><Search size={14} className="mr-2 text-blue-600" /> {lang === 'en' ? 'Search' : 'Kërko'}</h4>
                <input type="text" placeholder="..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-blue-600" />
              </div>
              <div className="p-8">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center"><Tag size={14} className="mr-2 text-blue-600" /> {lang === 'en' ? 'Taxonomy' : 'Taksonomia'}</h4>
                <div className="space-y-4">
                  {categories.map((cat, i) => (
                    <button key={i} onClick={() => setSearchQuery(cat)} className="w-full flex justify-between text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest">
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
