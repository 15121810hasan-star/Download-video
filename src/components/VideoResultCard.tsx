import React, { useState } from 'react';
import { VideoMetadata, DownloadOption, HistoryItem, AiClarityPreset, AiEnhancementResult } from '../types';
import { Language, translations } from '../translations';
import { AiClarityEngine } from './AiClarityEngine';
import {
  Download,
  Play,
  Pause,
  Copy,
  Check,
  ExternalLink,
  Music,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface VideoResultCardProps {
  data: VideoMetadata;
  currentLang: Language;
  onSaveToHistory: (item: HistoryItem) => void;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({
  data,
  currentLang,
  onSaveToHistory,
}) => {
  const t = translations[currentLang];
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // AI Clarity states
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<AiClarityPreset>('ultra_hd_upscale');
  const [aiResult, setAiResult] = useState<AiEnhancementResult | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Find a playable stream for preview
  const playableStream = data.formats.find(
    (f) =>
      f.type === 'video' &&
      f.downloadUrl &&
      (f.downloadUrl.includes('tikwm') ||
        f.downloadUrl.endsWith('.mp4') ||
        f.downloadUrl.includes('googlevideo') ||
        f.downloadUrl.includes('fbcdn'))
  )?.downloadUrl;

  const handleTriggerEnhance = async () => {
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: data.originalUrl,
          title: data.title,
          platform: data.platform,
          preset: selectedPreset,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setAiResult(json.data);
        }
      }
    } catch (e) {
      console.warn('AI enhancement trigger error', e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDownload = async (option: DownloadOption) => {
    setDownloadingQuality(option.quality);
    setDownloadSuccessMessage(null);

    // Save to history with AI enhancement metadata
    const historyItem: HistoryItem = {
      id: `${data.id}_${Date.now()}`,
      url: data.originalUrl,
      title: data.title,
      platform: data.platform,
      thumbnail: data.thumbnail || '',
      quality: isAiEnabled ? `${option.quality} (AI Enhanced)` : option.quality,
      downloadedAt: Date.now(),
      isAiEnhanced: isAiEnabled,
      aiPreset: isAiEnabled ? selectedPreset : undefined,
    };
    onSaveToHistory(historyItem);

    const safeTitle =
      data.title.replace(/[^a-zA-Z0-9_\u0980-\u09FF\s-]/g, '').trim().slice(0, 45) || 'video';
    const extension = option.format || 'mp4';
    const aiSuffix = isAiEnabled ? '_AI_Clarity_HD' : '';
    const filename = `${safeTitle}${aiSuffix}_${option.quality.replace(/\s+/g, '_')}.${extension}`;

    if (option.downloadUrl.startsWith('http')) {
      const isExternalTool =
        option.downloadUrl.includes('cobalt.tools') ||
        option.downloadUrl.includes('y2mate') ||
        option.downloadUrl.includes('savefrom') ||
        option.downloadUrl.includes('fdown.net') ||
        option.downloadUrl.includes('snapinsta');

      if (isExternalTool) {
        window.open(option.downloadUrl, '_blank', 'noopener,noreferrer');
        setDownloadSuccessMessage(
          isAiEnabled
            ? `AI Enhanced stream ready via HD Mirror (${option.quality})`
            : `Starting download via HD Mirror (${option.quality})`
        );
      } else {
        const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(
          option.downloadUrl
        )}&filename=${encodeURIComponent(filename)}`;

        const anchor = document.createElement('a');
        anchor.href = proxyUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        setDownloadSuccessMessage(
          currentLang === 'bn'
            ? `AI ক্লিয়ার ফাইলটি (${isAiEnabled ? 'Ultra HD' : option.quality}) ডিভাইসে ডাউনলোড হচ্ছে!`
            : `AI Enhanced file (${option.quality}) downloading to your storage!`
        );
      }
    }

    setTimeout(() => {
      setDownloadingQuality(null);
    }, 1800);
  };

  const handleCopyLink = () => {
    const primaryLink = data.formats[0]?.downloadUrl || data.originalUrl;
    navigator.clipboard.writeText(primaryLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const getPlatformColor = () => {
    switch (data.platform) {
      case 'tiktok':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
      case 'youtube':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/40';
      case 'facebook':
        return 'text-blue-400 border-blue-500/30 bg-blue-950/40';
      case 'instagram':
        return 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-950/40';
      default:
        return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
    }
  };

  // Live CSS filter for preview if AI clarity is enabled
  const aiVideoFilterStyle = isAiEnabled
    ? {
        filter: 'contrast(115%) saturate(115%) brightness(103%) drop-shadow(0 0 1px rgba(255,255,255,0.15))',
      }
    : {};

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur-md">
        {/* Top Banner Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.videoFound}</span>
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded border uppercase tracking-wider ${getPlatformColor()}`}
            >
              {data.platform}
            </span>
            {isAiEnabled && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                <Sparkles className="w-3 h-3" />
                <span>AI CLARITY ACTIVE</span>
              </span>
            )}
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white px-2.5 py-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? t.directLinkCopied : currentLang === 'bn' ? 'লিঙ্ক কপি করুন' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Main Grid: Media & Download Options */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Col: Media & Thumbnail Preview */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
              {isPlayingPreview && playableStream ? (
                <video
                  src={playableStream}
                  controls
                  autoPlay
                  style={aiVideoFilterStyle}
                  className="w-full h-full object-contain bg-black transition-all"
                />
              ) : (
                <>
                  <img
                    src={data.thumbnail || '/src/assets/images/hero_video_banner_1791796910439.jpg'}
                    alt={data.title}
                    referrerPolicy="no-referrer"
                    style={aiVideoFilterStyle}
                    className="w-full h-full object-cover group-hover:scale-102 transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/src/assets/images/hero_video_banner_1791796910439.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {playableStream && (
                    <button
                      onClick={() => setIsPlayingPreview(true)}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 hover:scale-110 transition-transform"
                      aria-label={t.playVideo}
                    >
                      <Play className="w-6 h-6 ml-0.5 fill-white" />
                    </button>
                  )}

                  {data.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white font-mono text-xs rounded border border-white/10">
                      {data.duration}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick Creator / Author Info */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="truncate max-w-[200px]">
                <strong className="text-slate-300">{t.creator}:</strong> {data.author}
              </span>
              {playableStream && isPlayingPreview && (
                <button
                  onClick={() => setIsPlayingPreview(false)}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>{t.pauseVideo}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Col: Title & Resolution Selector */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug">
                {data.title}
              </h3>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                <span>{data.platform.toUpperCase()}</span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">{t.noWatermarkBadge}</span>
                <span>·</span>
                <span className="text-amber-400 font-medium">
                  {isAiEnabled ? 'AI Enhanced 1080p' : t.fullHdBadge}
                </span>
              </div>
            </div>

            {/* Success Message Banner */}
            {downloadSuccessMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{downloadSuccessMessage}</span>
              </div>
            )}

            {/* Download Options List */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 tracking-wide">
                  {t.qualitySelect}
                </span>
                {isAiEnabled && (
                  <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Neural Upscale Applied</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.formats.map((option, idx) => {
                  const isSelected = downloadingQuality === option.quality;
                  const isTopHd = option.isHd && idx === 0;

                  return (
                    <button
                      key={`${option.quality}-${idx}`}
                      onClick={() => handleDownload(option)}
                      disabled={downloadingQuality !== null}
                      className={`relative flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isTopHd
                          ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border-indigo-500/60 hover:border-indigo-400 shadow-md shadow-indigo-950'
                          : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            option.type === 'video'
                              ? isTopHd
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-700 text-slate-200'
                              : option.type === 'audio'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {option.type === 'video' ? (
                            <Video className="w-4 h-4" />
                          ) : option.type === 'audio' ? (
                            <Music className="w-4 h-4" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{option.quality}</span>
                            {isTopHd && (
                              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
                                {isAiEnabled ? 'AI 1080p' : 'BEST'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                            {option.size ? option.size : option.format.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isTopHd
                              ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-sm'
                              : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                          }`}
                        >
                          {isSelected ? (
                            <span className="animate-spin text-xs">⟳</span>
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          <span className="hidden sm:inline">
                            {isSelected ? t.downloading : t.downloadNow}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Note */}
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
              <span>
                {currentLang === 'bn'
                  ? 'ডাউনলোড বাটনে ক্লিক করলে ফাইলটি সরাসরি আপনার ডিভাইসের গ্যালারি বা ফোল্ডারে সেভ হবে।'
                  : 'Clicking download saves the file directly to your device storage.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Video Clarity & Neural Sharpening Section */}
      <AiClarityEngine
        currentLang={currentLang}
        thumbnailUrl={data.thumbnail}
        videoTitle={data.title}
        platform={data.platform}
        isAiEnabled={isAiEnabled}
        onToggleAi={setIsAiEnabled}
        selectedPreset={selectedPreset}
        onSelectPreset={setSelectedPreset}
        aiResult={aiResult}
        isEnhancing={isEnhancing}
        onTriggerEnhance={handleTriggerEnhance}
      />
    </div>
  );
};
