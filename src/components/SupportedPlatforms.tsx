import React from 'react';
import { Language, translations } from '../translations';
import { Video, Sparkles, Music2, ShieldCheck, Zap } from 'lucide-react';

interface SupportedPlatformsProps {
  currentLang: Language;
}

export const SupportedPlatforms: React.FC<SupportedPlatformsProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const platforms = [
    {
      name: 'TikTok Downloader',
      badge: 'No Watermark',
      desc: currentLang === 'bn'
        ? 'ওয়াটারমার্ক বা লোগো ছাড়া যেকোনো টিকটক ভিডিও সরাসরি 1080p ফুল এইচডি ও MP3 মিউজিক ডাউনলোড।'
        : 'Download HD TikTok clips without watermark plus crystal clear MP3 background audio.',
      features: ['No Watermark HD', 'Original Sound MP3', 'Cover Art', 'Lightning Fast'],
      accent: 'border-cyan-500/40 from-cyan-950/20 to-slate-900',
      tagColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800',
    },
    {
      name: 'Facebook Video & Reels',
      badge: 'Full HD 1080p',
      desc: currentLang === 'bn'
        ? 'ফেসবুকের যেকোনো পাবলিক ভিডিও, রিলস (Reels), এবং ওয়াচ (Watch) ভিডিও সর্বোচ্চ কোয়ালিটিতে সেভ করুন।'
        : 'Save public Facebook videos, Reels, and Watch streams in maximum 1080p bitrates.',
      features: ['FB Reels & Shorts', 'Watch Video HD', 'Private-safe proxy', 'Direct MP4 save'],
      accent: 'border-blue-500/40 from-blue-950/20 to-slate-900',
      tagColor: 'text-blue-400 bg-blue-950/60 border-blue-800',
    },
    {
      name: 'YouTube Shorts & Video',
      badge: '4K / 1080p / MP3',
      desc: currentLang === 'bn'
        ? 'ইউটিউবের শর্টস, দীর্ঘ ভিডিও এবং গান সরাসরি MP4 ভিডিও বা 320kbps MP3 অডিওতে ডাউনলোড।'
        : 'Download YouTube shorts, long clips, and audio in 1080p, 720p, and 320kbps MP3 format.',
      features: ['YouTube Shorts', '1080p 60FPS Video', '320kbps High MP3', 'HD Thumbnail'],
      accent: 'border-rose-500/40 from-rose-950/20 to-slate-900',
      tagColor: 'text-rose-400 bg-rose-950/60 border-rose-800',
    },
    {
      name: 'Instagram Reels & Stories',
      badge: 'Original HD',
      desc: currentLang === 'bn'
        ? 'ইনস্টাগ্রামের রিলস ভিডিও ও স্টোরি কোনো কোয়ালিটি লস ছাড়াই এক ক্লিকে ডাউনলোড করুন।'
        : 'Save Instagram Reels, posts, and IGTV videos in pristine original resolution.',
      features: ['Instagram Reels', 'Audio Extraction', 'High Resolution', 'No Login Required'],
      accent: 'border-fuchsia-500/40 from-fuchsia-950/20 to-slate-900',
      tagColor: 'text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-800',
    },
  ];

  return (
    <section id="platforms" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          {t.platformsTitle}
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          {t.platformsSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {platforms.map((p) => (
          <div
            key={p.name}
            className={`bg-gradient-to-br ${p.accent} border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-400" />
                  <span>{p.name}</span>
                </h3>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${p.tagColor}`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{p.desc}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
              {p.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
