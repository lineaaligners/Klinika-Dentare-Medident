import React, { useState } from 'react';
import { Certificate, Lang } from './types';
import { certificateVerifyUrl, linkedInAddUrl } from '../../services/portalApi';
import { Download, Loader2, Link2, Check, BadgePlus } from 'lucide-react';

const t = {
  en: {
    download: 'Download PDF',
    copy: 'Copy verification link',
    copied: 'Link copied',
    linkedin: 'Add to LinkedIn',
    failed: 'Could not create the PDF. Please try again.',
  },
  sq: {
    download: 'Shkarko PDF',
    copy: 'Kopjo linkun e verifikimit',
    copied: 'Linku u kopjua',
    linkedin: 'Shto në LinkedIn',
    failed: 'PDF nuk u krijua. Provoni përsëri.',
  },
};

/** "Download PDF", "Copy verification link" and "Add to LinkedIn" for one certificate. */
const CertificateActions: React.FC<{ lang: Lang; cert: Certificate; compact?: boolean }> = ({ lang, cert, compact }) => {
  const s = t[lang];
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const download = async () => {
    setBusy(true);
    setError('');
    try {
      const { downloadCertificatePdf } = await import('./certificatePdf');
      await downloadCertificatePdf(cert, certificateVerifyUrl(cert.code));
    } catch (e) {
      console.error(e);
      setError(s.failed);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    const url = certificateVerifyUrl(cert.code);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('', url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={download}
          disabled={busy}
          className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />} {s.download}
        </button>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
            copied ? 'bg-green-50 text-green-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          {copied ? <Check size={13} /> : <Link2 size={13} />} {compact ? '' : copied ? s.copied : s.copy}
        </button>
        <a
          href={linkedInAddUrl(cert)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <BadgePlus size={13} /> {compact ? '' : s.linkedin}
        </a>
      </div>
      {error && <p className="text-xs font-bold text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default CertificateActions;
