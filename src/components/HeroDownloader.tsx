import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { Platform } from '../types';
import {
  Clipboard,
  X,
  Search,
  Video,
  Sparkles,
  AlertCircle,
  PlaySquare,
  Share2,
} from 'lucide-react';

interface HeroDownloaderProps {
  currentLang: Language;
  onExtract: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const HeroDownloader: React.FC<HeroDownloaderProps> = ({
  currentLang,
  onExtract,
  isLoading,
  error,
}) => {
  const t = translations[currentLang];
  const [url, setUrl] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Detect platform in real-time
  const getDetectedPlatform = (input: string): Platform => {
    const lower = input.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('tiktok.com')) return 'tiktok';
    if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.com')) return 'facebook';
    if (lower.includes('instagram.com')) return 'instagram';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
    return 'other';
  };

  const detected = url.trim() ? getDetectedPlatform(url) : null;

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setCopiedNotification(true);
          setTimeout(() => setCopiedNotification(false), 2000);
        }
      }
    } catch (err) {
      console.warn('Clipboard read failed or permission denied', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onExtract(url.trim());
  };

  const handleSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    onExtract(sampleUrl);
  };

  return (
    <div className="relative pt-8 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-[300px] h-[250px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle pill-less hero kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wide mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance mb-4">
          {t.heroTitle}{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
            {t.heroTitleHighlight}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Main Input Form */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-5">
          <div className="relative flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-900/90 border-2 border-indigo-500/40 focus-within:border-indigo-400 rounded-2xl shadow-2xl backdrop-blur-md transition-all">
            {/* Input with detected platform badge */}
            <div className="relative flex-1 w-full flex items-center pl-3 pr-2">
              <div className="text-slate-400 shrink-0 mr-2">
                {detected === 'youtube' ? (
                  <span className="text-rose-500 font-bold text-xs uppercase px-1.5 py-0.5 bg-rose-500/10 rounded border border-rose-500/30">
                    YouTube
                  </span>
                ) : detected === 'tiktok' ? (
                  <span className="text-cyan-400 font-bold text-xs uppercase px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/30">
                    TikTok
                  </span>
                ) : detected === 'facebook' ? (
                  <span className="text-blue-400 font-bold text-xs uppercase px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/30">
                    Facebook
                  </span>
                ) : detected === 'instagram' ? (
                  <span className="text-fuchsia-400 font-bold text-xs uppercase px-1.5 py-0.5 bg-fuchsia-500/10 rounded border border-fuchsia-500/30">
                    Instagram
                  </span>
                ) : (
                  <Video className="w-5 h-5 text-indigo-400" />
                )}
              </div>

              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t.inputPlaceholder}
                required
                className="w-full py-2.5 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />

              {/* Paste & Clear Controls */}
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {url && (
                  <button
                    type="button"
                    onClick={() => setUrl('')}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title={t.clearBtn}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
                  title="Clipboard থেকে পেস্ট করুন"
                >
                  <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xs:inline">{t.pasteBtn}</span>
                </button>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.processingBtn}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t.downloadBtn}</span>
                </>
              )}
            </button>
          </div>

          {copiedNotification && (
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-amber-400 font-medium">
              ✓ Link pasted from clipboard!
            </div>
          )}
        </form>

        {/* Sample Links for Instant Testing */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-400">{t.trySamples}</span>
          <button
            type="button"
            onClick={() => handleSample('https://www.tiktok.com/@tiktok/video/7106594312292453678')}
            className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1"
          >
            <PlaySquare className="w-3 h-3 text-cyan-400" />
            <span>{t.sampleTikTok}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSample('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
            className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1"
          >
            <Share2 className="w-3 h-3 text-rose-400" />
            <span>{t.sampleYouTube}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSample('https://www.facebook.com/watch/?v=10153231379946729')}
            className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1"
          >
            <Video className="w-3 h-3 text-blue-400" />
            <span>{t.sampleFacebook}</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="max-w-xl mx-auto mt-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block text-white mb-0.5">
                {currentLang === 'bn' ? 'ডাউনলোড ত্রুটি:' : 'Extraction Error:'}
              </strong>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
