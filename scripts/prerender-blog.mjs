// Runs after `vite build`. Writes a static HTML page for every blog post
// (dist/blog/<id>/index.html) and for the blog index (dist/blog/index.html).
// Each page has its own title, description, Open Graph image and the full
// article text, so Google, AI search and link previews (WhatsApp, Facebook)
// see the real article. The React app still loads on top and takes over.
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const SITE = 'https://medident-ks.com';
const root = process.cwd();
const dist = path.join(root, 'dist');
const tmp = path.join(dist, '.prerender-constants.mjs');

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (u) => (/^https?:\/\//.test(u) ? u : SITE + (u.startsWith('/') ? u : '/' + u));
const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; };
const pick = (rec, lang) => (rec && (rec[lang] || rec.en)) || '';

async function main() {
  const shellPath = path.join(dist, 'index.html');
  if (!fs.existsSync(shellPath)) { console.warn('[prerender-blog] dist/index.html missing, skipping'); return; }

  const { build } = await import('esbuild');
  await build({
    entryPoints: [path.join(root, 'constants.tsx')],
    bundle: true, platform: 'node', format: 'esm', outfile: tmp,
    jsx: 'automatic', logLevel: 'silent',
  });
  const { BLOG_POSTS, DOCTORS } = await import(pathToFileURL(tmp).href);
  fs.rmSync(tmp, { force: true });

  const shell = fs.readFileSync(shellPath, 'utf8');

  const page = ({ url, title, desc, image, ld, body, type = 'article' }) => {
    let h = shell;
    const setMeta = (re, tag) => { h = re.test(h) ? h.replace(re, tag) : h.replace('</head>', `    ${tag}\n  </head>`); };
    h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    setMeta(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}" />`);
    setMeta(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
    setMeta(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`);
    setMeta(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
    setMeta(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`);
    setMeta(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}" />`);
    setMeta(/<meta property="og:image" [^>]*>/, `<meta property="og:image" content="${image}" />`);
    setMeta(/<meta property="og:locale" [^>]*>/, `<meta property="og:locale" content="sq_AL" />`);
    setMeta(/<meta property="og:locale:alternate"[^>]*>/, `<meta property="og:locale:alternate" content="en_US" />`);
    setMeta(/<meta name="twitter:url"[^>]*>/, `<meta name="twitter:url" content="${url}" />`);
    setMeta(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}" />`);
    setMeta(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(desc)}" />`);
    setMeta(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${image}" />`);
    // Drop homepage-only tags that would be wrong on an article.
    h = h.replace(/\s*<meta property="og:(image:width|image:height|image:alt|video[^"]*)"[^>]*>/g, '');
    if (ld) h = h.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`);
    h = h.replace(/<div id="root">[\s\S]*?<\/div>\s*(?=<script|<\/body>)/, `<div id="root">${body}</div>\n    `);
    return h;
  };

  const wrap = (inner) => `<div style="max-width:780px;margin:0 auto;padding:32px 18px;font-family:system-ui,sans-serif;color:#1b2a3a;line-height:1.7"><p><a href="/">Klinika Dentare Medident</a> › <a href="/blog">Blog</a></p>${inner}</div>`;
  const paras = (t) => String(t || '').split('\n\n').map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');

  let count = 0;
  for (const post of BLOG_POSTS) {
    const author = DOCTORS.find(d => d.id === post.authorId);
    const url = `${SITE}/blog/${post.id}`;
    const titleSq = pick(post.title, 'sq');
    const descSq = clip(pick(post.excerpt, 'sq'), 200);
    const image = abs(post.image);
    const authorName = author?.name || 'Klinika Dentare Medident';
    const ld = {
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: titleSq, alternativeHeadline: post.title.en,
      description: descSq, image, datePublished: new Date(post.date).toString() !== 'Invalid Date' ? new Date(post.date).toISOString().slice(0, 10) : undefined,
      inLanguage: ['sq', 'en'], url, mainEntityOfPage: url,
      author: { '@type': 'Person', name: authorName },
      publisher: { '@type': 'Organization', name: 'Klinika Dentare Medident', url: SITE },
    };
    const body = wrap(
      `<article lang="sq"><h1>${esc(titleSq)}</h1><p><b>${esc(authorName)}</b> · ${esc(post.date)}</p><img src="${image}" alt="${esc(titleSq)}" style="width:100%;border-radius:12px"><p><em>${esc(pick(post.excerpt, 'sq'))}</em></p>${paras(pick(post.content, 'sq'))}</article>` +
      `<hr><article lang="en"><h2>${esc(post.title.en)}</h2><p><em>${esc(post.excerpt.en)}</em></p>${paras(post.content.en)}</article>`
    );
    const out = path.join(dist, 'blog', post.id);
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'index.html'), page({ url, title: `${titleSq} | Medident Blog`, desc: descSq, image, ld, body }));
    count++;
  }

  const list = BLOG_POSTS.map(p => `<li><a href="/blog/${p.id}">${esc(pick(p.title, 'sq'))}</a><br><small>${esc(clip(pick(p.excerpt, 'sq'), 160))}</small></li>`).join('');
  fs.mkdirSync(path.join(dist, 'blog'), { recursive: true });
  fs.writeFileSync(path.join(dist, 'blog', 'index.html'), page({
    url: `${SITE}/blog`, title: 'Blogu i Medident — histori nga klinika në Pejë', type: 'website',
    desc: 'Artikuj nga Dr. Lendita Islami Nallbani, Dr. Faton Loci dhe ekipi i Klinikës Dentare Medident në Pejë: implante, plan 3D, alignerë dhe 25 vite histori.',
    image: abs(BLOG_POSTS[0]?.image || '/photos/clinic-hero.jpg'),
    body: wrap(`<h1>Blogu i Medident</h1><ul>${list}</ul>`),
  }));
  console.log(`[prerender-blog] wrote ${count} posts + blog index`);
}

main().catch(e => { console.warn('[prerender-blog] skipped:', e.message); });
