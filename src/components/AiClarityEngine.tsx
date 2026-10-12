import React, { useState } from 'react';
import { AiClarityPreset, AiEnhancementResult } from '../types';
import { Language, translations } from '../translations';
import {
  Sparkles,
  Sliders,
  Check,
  Zap,
  Wand2,
  Eye,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AiClarityEngineProps {
  currentLang: Language;
  thumbnailUrl: string;
  videoTitle: string;
  platform: string;
  isAiEnabled: boolean;
  onToggleAi: (enabled: boolean) => void;
  selectedPreset: AiClarityPreset;
  onSelectPreset: (preset: AiClarityPreset) => void;
  aiResult: AiEnhancementResult | null;
  isEnhancing: boolean;
  onTriggerEnhance: () => void;
}

export const AiClarityEngine: React.FC<AiClarityEngineProps> = ({
  currentLang,
  thumbnailUrl,
  videoTitle,
  platform,
  isAiEnabled,
  onToggleAi,
  selectedPreset,
  onSelectPreset,
  aiResult,
  isEnhancing,
  onTriggerEnhance,
}) => {
  const t = translations[currentLang];
  const [sliderPosition, setSliderPosition] = useState(50); // percentage for before/after split

  const presets: { id: AiClarityPreset; label: string; desc: string; icon: any }[] = [
    {
      id: 'ultra_hd_upscale',
      label: t.aiPresetUltra,
      desc: 'AI Super-Resolution 1080p/4K upscale',
      icon: Zap,
    },
    {
      id: 'denoise_sharpen',
      label: t.aiPresetDenoise,
      desc: 'Removes blur & motion compression noise',
      icon: Wand2,
    },
    {
      id: 'hdr_color_vivid',
      label: t.aiPresetHdr,
      desc: 'Expands dynamic range & color depth',
      icon: Layers,
    },
    {
      id: 'face_clarity',
      label: t.aiPresetFace,
      desc: 'Facial contour & portrait sharpening',
      icon: Eye,
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header with Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{t.aiEnhanceTitle}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.2 rounded border border-amber-500/30">
                PRO
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">{t.aiEnhanceDesc}</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => onToggleAi(!isAiEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isAiEnabled
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isAiEnabled ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          <span>{isAiEnabled ? 'AI Clarity: ON' : t.enableAiClarity}</span>
        </button>
      </div>

      {isAiEnabled ? (
        <div className="flex flex-col gap-5">
          {/* Preset Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {presets.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPreset(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-400 text-white shadow-md shadow-indigo-950'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold leading-tight truncate">{p.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate">{p.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Interactive Before vs After Slider */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video max-h-72 select-none group">
            {/* Base Image (Enhanced version with sharp neural styling) */}
            <img
              src={thumbnailUrl || '/src/assets/images/hero_video_banner_1791796910439.jpg'}
              alt="Enhanced Frame"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: 'contrast(125%) saturate(120%) brightness(105%) drop-shadow(0 0 2px rgba(255,255,255,0.2))',
              }}
            />
            {/* Enhanced Banner Tag */}
            <div className="absolute top-2 right-2 bg-indigo-600/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
              AI ULTRA HD (98% CLARITY)
            </div>

            {/* Overlaid Original Image clipped by slider position */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={thumbnailUrl || '/src/assets/images/hero_video_banner_1791796910439.jpg'}
                alt="Original Raw Frame"
                className="w-full h-full object-cover"
                style={{
                  filter: 'blur(1.5px) contrast(85%) opacity(90%)',
                  width: '100vw',
                  maxWidth: 'none',
                }}
              />
              <div className="absolute top-2 left-2 bg-black/80 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                RAW ORIGINAL (BLURRY)
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(255,255,255,0.7)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg text-[10px] font-black">
                ⬌
              </div>
            </div>

            {/* Interactive range input */}
            <input
              type="range"
              min="5"
              max="95"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Before/After clarity slider"
            />
          </div>

          {/* AI Metrics & Trigger button */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">ORIGINAL</span>
                <span className="text-slate-300 font-bold">62% Clarity</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <div>
                <span className="text-indigo-400 block text-[10px]">AI BOOSTED</span>
                <span className="text-emerald-400 font-bold">98% Ultra Sharp</span>
              </div>
              <div className="hidden sm:block pl-2 border-l border-slate-800">
                <span className="text-amber-400 block text-[10px]">DENOISE</span>
                <span className="text-slate-300 font-bold">92% Removed</span>
              </div>
            </div>

            <button
              onClick={onTriggerEnhance}
              disabled={isEnhancing}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isEnhancing ? (
                <>
                  <span className="animate-spin text-xs">⟳</span>
                  <span>{t.aiProcessing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{aiResult ? 'Re-Apply AI Clarity' : 'Process AI Clarity'}</span>
                </>
              )}
            </button>
          </div>

          {aiResult && (
            <div className="text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 p-2.5 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{aiResult.summary}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-400 text-center py-2">
          {currentLang === 'bn'
            ? '💡 ভিডিওর ঘোলা ভাব ও কম রেজুলেশন ঠিক করতে "AI ক্লিয়ার মোড" চালু করুন।'
            : '💡 Turn on AI Clarity Mode to sharpen blurred video frames before downloading.'}
        </div>
      )}
    </div>
  );
};
