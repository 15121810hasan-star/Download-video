import React from 'react';
import { OWNER_INFO } from '../types';
import { Language, translations } from '../translations';
import { Mail, ShieldCheck, Sparkles, CheckCircle, ExternalLink } from 'lucide-react';

interface CreatorProfileProps {
  currentLang: Language;
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section id="creator" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
          {/* Avatar representation with verified badge */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-1 shadow-xl shadow-indigo-600/30">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-white">
                <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-amber-300 bg-clip-text text-transparent">
                  HM
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">FOUNDER</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-md border-2 border-slate-950">
              <CheckCircle className="w-4 h-4 fill-white text-blue-600" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.contactCreator}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {OWNER_INFO.name}
            </h3>
            <p className="text-sm font-medium text-indigo-300 mb-3">
              {t.devRole} · SnapHD Universal Downloader
            </p>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl mb-5">
              {currentLang === 'bn'
                ? 'হাই! আমি হাসান মাহমুদ। এই সাইটটি আমি তৈরি করেছি যাতে যেকেউ সহজে ফেসবুক, টিকটক ও ইউটিউব থেকে কোনো বিজ্ঞাপন ও ওয়াটারমার্ক ছাড়া ক্রিস্টাল-ক্লিয়ার HD ভিডিও ডাউনলোড করতে পারে। যেকোনো প্রশ্ন বা মতামতের জন্য সরাসরি আমার সাথে যোগাযোগ করতে পারেন।'
                : 'Hello! I am Hasan Mahmud. I created SnapHD to make high-definition video downloading from Facebook, TikTok, and YouTube fast, watermark-free, and powered by AI neural clarity.'}
            </p>

            {/* Verified Contacts & Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href={OWNER_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>{t.connectFb}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href={`mailto:${OWNER_INFO.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all hover:scale-105"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{OWNER_INFO.email}</span>
              </a>

              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Publisher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
