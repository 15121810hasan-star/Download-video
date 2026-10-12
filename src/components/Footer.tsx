import React from 'react';
import { Language, translations } from '../translations';
import { OWNER_INFO } from '../types';
import { ShieldCheck, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Brand & Owner */}
        <div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-white font-semibold mb-1">
            <span className="font-extrabold tracking-tight">SnapHD AI</span>
            <span>·</span>
            <span>
              {currentLang === 'bn' ? 'নির্মাতা:' : 'Created by:'}{' '}
              <a
                href={OWNER_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                {OWNER_INFO.name}
              </a>
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            {t.rightsReserved} · Firebase Firestore Protected
          </div>
        </div>

        {/* Contact Links for Hasan Mahmud */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <a
            href={OWNER_INFO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Facebook Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={`mailto:${OWNER_INFO.email}`}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{OWNER_INFO.email}</span>
          </a>

          <span className="flex items-center gap-1 text-emerald-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SSL Secured</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
