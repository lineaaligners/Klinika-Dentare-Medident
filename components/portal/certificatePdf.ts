// Builds the Medident Academy certificate as a real PDF in the browser.
// Loaded on demand (jsPDF + fonts are only fetched when a doctor downloads one).
import type { Certificate } from './types';

const DIRECTOR = 'Dr. Lendita Islami Nallbani';
const FONT_BASE = '/fonts/certificate';

const INK = '#0f172a';
const MUTED = '#64748b';
const FAINT = '#94a3b8';
const BLUE = '#2563eb';

async function fontBase64(file: string): Promise<string> {
  const buf = await fetch(`${FONT_BASE}/${file}`).then((r) => {
    if (!r.ok) throw new Error(`Font ${file} not found`);
    return r.arrayBuffer();
  });
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

const withoutTitle = (name: string) => name.replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, '').trim();

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export interface CertificateFonts {
  inter: string; // base64 TTF
  interBold: string;
  playfair: string;
  vibes: string;
}

/** Draws the certificate into a new jsPDF document (pure: no network, no DOM). */
export function drawCertificate(JsPDF: any, qrcode: any, fonts: CertificateFonts, cert: Certificate, verifyUrl: string): any {
  const doc = new JsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.addFileToVFS('Inter-Regular.ttf', fonts.inter);
  doc.addFont('Inter-Regular.ttf', 'Inter', 'normal');
  doc.addFileToVFS('Inter-SemiBold.ttf', fonts.interBold);
  doc.addFont('Inter-SemiBold.ttf', 'Inter', 'bold');
  doc.addFileToVFS('PlayfairDisplay-Bold.ttf', fonts.playfair);
  doc.addFont('PlayfairDisplay-Bold.ttf', 'Playfair', 'bold');
  doc.addFileToVFS('GreatVibes-Regular.ttf', fonts.vibes);
  doc.addFont('GreatVibes-Regular.ttf', 'GreatVibes', 'normal');
  doc.setProperties({
    title: `Medident Academy — Certificate ${cert.code}`,
    subject: cert.course_title_en,
    author: 'Medident Academy',
    creator: 'Medident Academy Doctor Portal',
  });

  const W = 297;
  const H = 210;
  const cx = W / 2;

  // Frame: outer ink border + inner blue hairline + corner accents.
  doc.setDrawColor(INK);
  doc.setLineWidth(0.8);
  doc.rect(8, 8, W - 16, H - 16);
  doc.setDrawColor(BLUE);
  doc.setLineWidth(0.25);
  doc.rect(12, 12, W - 24, H - 24);
  doc.setFillColor(BLUE);
  for (const [x, y] of [[12, 12], [W - 12, 12], [12, H - 12], [W - 12, H - 12]]) {
    doc.rect(x - 1.5, y - 1.5, 3, 3, 'F');
  }

  const text = (
    str: string,
    y: number,
    opts: { font: string; style: string; size: number; color: string; spacing?: number; x?: number; align?: 'center' | 'left' | 'right' },
  ) => {
    doc.setFont(opts.font, opts.style);
    doc.setFontSize(opts.size);
    doc.setTextColor(opts.color);
    doc.setCharSpace(opts.spacing ?? 0);
    doc.text(str, opts.x ?? cx, y, { align: opts.align ?? 'center' });
    doc.setCharSpace(0);
  };

  // Wordmark.
  doc.setFont('Inter', 'bold');
  doc.setFontSize(17);
  doc.setCharSpace(0.4);
  const left = 'MEDIDENT';
  const dot = '.';
  const right = 'ACADEMY';
  const total = doc.getTextWidth(left + dot + right);
  let x = cx - total / 2;
  doc.setTextColor(INK);
  doc.text(left, x, 30);
  x += doc.getTextWidth(left);
  doc.setTextColor(BLUE);
  doc.text(dot, x, 30);
  x += doc.getTextWidth(dot);
  doc.setTextColor(INK);
  doc.text(right, x, 30);
  doc.setCharSpace(0);
  text('KLINIKA DENTARE MEDIDENT  ·  PEJË, KOSOVO  ·  SINCE 1999', 36, { font: 'Inter', style: 'normal', size: 6.5, color: FAINT, spacing: 0.8 });

  // Title.
  text('CERTIFICATE OF COMPLETION', 52, { font: 'Inter', style: 'bold', size: 13, color: BLUE, spacing: 1.6 });
  text('CERTIFIKATË PËRFUNDIMI', 58, { font: 'Inter', style: 'normal', size: 8, color: MUTED, spacing: 1.2 });

  // Recipient.
  text('This certifies that  ·  Vërtetohet se', 72, { font: 'Inter', style: 'normal', size: 9.5, color: MUTED });
  let nameSize = 34;
  doc.setFont('Playfair', 'bold');
  doc.setFontSize(nameSize);
  while (doc.getTextWidth(cert.doctor_name) > 230 && nameSize > 18) {
    nameSize -= 1;
    doc.setFontSize(nameSize);
  }
  text(cert.doctor_name, 89, { font: 'Playfair', style: 'bold', size: nameSize, color: INK });
  doc.setDrawColor(FAINT);
  doc.setLineWidth(0.3);
  doc.line(cx - 45, 95, cx + 45, 95);

  // Course.
  text('has successfully completed the course  ·  ka përfunduar me sukses kursin', 104, { font: 'Inter', style: 'normal', size: 9.5, color: MUTED });
  let courseSize = 17;
  doc.setFont('Inter', 'bold');
  doc.setFontSize(courseSize);
  while (doc.getTextWidth(cert.course_title_en) > 240 && courseSize > 11) {
    courseSize -= 0.5;
    doc.setFontSize(courseSize);
  }
  text(cert.course_title_en, 115, { font: 'Inter', style: 'bold', size: courseSize, color: INK });
  if (cert.course_title_sq && cert.course_title_sq.trim() !== cert.course_title_en.trim()) {
    text(cert.course_title_sq, 122, { font: 'Inter', style: 'normal', size: 10.5, color: MUTED });
  }
  text(
    `Issued ${formatDate(cert.issued_at, 'en-GB')}  ·  Lëshuar më ${formatDate(cert.issued_at, 'sq-AL')}`,
    131,
    { font: 'Inter', style: 'normal', size: 8.5, color: MUTED },
  );
  const cpd = Number(cert.cpd_hours);
  if (Number.isFinite(cpd) && cpd > 0) {
    const en = cpd.toLocaleString('en-GB', { maximumFractionDigits: 1 });
    const sq = cpd.toLocaleString('sq-AL', { maximumFractionDigits: 1 });
    text(`${en} CPD ${cpd === 1 ? 'hour' : 'hours'}  ·  ${sq} orë CPD`, 137, { font: 'Inter', style: 'bold', size: 8.5, color: BLUE });
  }

  // Signatures.
  const instructor = (cert.instructor_name || '').trim();
  const sameAsDirector = !instructor || withoutTitle(instructor).toLowerCase() === withoutTitle(DIRECTOR).toLowerCase();
  const signature = (name: string, roleEn: string, roleSq: string, sx: number) => {
    text(withoutTitle(name), 160, { font: 'GreatVibes', style: 'normal', size: 24, color: INK, x: sx });
    doc.setDrawColor(INK);
    doc.setLineWidth(0.3);
    doc.line(sx - 32, 164, sx + 32, 164);
    text(name, 169.5, { font: 'Inter', style: 'bold', size: 8.5, color: INK, x: sx });
    text(`${roleEn}  ·  ${roleSq}`, 174, { font: 'Inter', style: 'normal', size: 7, color: MUTED, x: sx });
  };
  if (sameAsDirector) {
    signature(DIRECTOR, 'Course instructor & Academy Director', 'Instruktore & Drejtoreshë e Akademisë', cx);
  } else {
    signature(instructor, 'Course instructor', 'Instruktor i kursit', cx - 62);
    signature(DIRECTOR, 'Academy Director', 'Drejtoreshë e Akademisë', cx + 62);
  }

  // Verification: code + link (left) and QR code (right).
  const shortUrl = verifyUrl.replace(/^https?:\/\//, '');
  text(`Certificate ID  ·  ID e certifikatës:  ${cert.code}`, 186, { font: 'Inter', style: 'bold', size: 7.5, color: INK, x: 22, align: 'left' });
  text(`Verify at  ·  Verifiko në:  ${shortUrl}`, 191, { font: 'Inter', style: 'normal', size: 7, color: MUTED, x: 22, align: 'left' });

  const qr = qrcode(0, 'M');
  qr.addData(verifyUrl);
  qr.make();
  const n = qr.getModuleCount();
  const size = 22;
  const cell = size / n;
  const qx = W - 22 - size;
  const qy = H - 22 - size + 4;
  doc.setFillColor(INK);
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (!qr.isDark(r, c)) {
        c++;
        continue;
      }
      const startC = c;
      while (c < n && qr.isDark(r, c)) c++;
      doc.rect(qx + startC * cell, qy + r * cell, (c - startC) * cell + 0.01, cell + 0.01, 'F');
    }
  }

  return doc;
}

/** Browser: loads jsPDF, the QR generator and the fonts, then downloads the PDF. */
export async function downloadCertificatePdf(cert: Certificate, verifyUrl: string): Promise<void> {
  const [{ jsPDF }, qrModule, inter, interBold, playfair, vibes] = await Promise.all([
    import('jspdf'),
    import('qrcode-generator'),
    fontBase64('Inter-Regular.ttf'),
    fontBase64('Inter-SemiBold.ttf'),
    fontBase64('PlayfairDisplay-Bold.ttf'),
    fontBase64('GreatVibes-Regular.ttf'),
  ]);
  const qrcode: any = (qrModule as any).default || qrModule;
  const doc = drawCertificate(jsPDF, qrcode, { inter, interBold, playfair, vibes }, cert, verifyUrl);
  doc.save(`Medident-Academy-Certificate-${cert.code}.pdf`);
}
