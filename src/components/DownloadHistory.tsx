import React from 'react';
import { HistoryItem } from '../types';
import { Language, translations } from '../translations';
import { History, Trash2, Download, ExternalLink } from 'lucide-react';

interface DownloadHistoryProps {
  history: HistoryItem[];
  currentLang: Language;
  onClearHistory: () => void;
  onReExtract: (url: string) => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  history,
  currentLang,
  onClearHistory,
  onReExtract,
}) => {
  const t = translations[currentLang];

  if (history.length === 0) {
    return null;
  }

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">{t.recentHistory}</h3>
            <span className="text-xs text-slate-400 font-mono">({history.length})</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono hidden sm:inline">
              CLOUD SYNCED
            </span>
          </div>

          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors p-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearHistory}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col justify-between transition-colors group"
            >
              <div className="flex gap-3 items-start">
                <img
                  src={item.thumbnail || '/src/assets/images/hero_video_banner_1791796910439.jpg'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/hero_video_banner_1791796910439.jpg';
                  }}
                />
                <div className="truncate flex-1">
                  <h4 className="text-xs font-semibold text-white truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="uppercase text-indigo-400 font-bold">{item.platform}</span>
                    <span>·</span>
                    <span>{item.quality}</span>
                    <span>·</span>
                    <span className="font-mono">{formatTime(item.downloadedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => onReExtract(item.url)}
                  className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
                >
                  <Download className="w-3 h-3" />
                  <span>{t.reDownload}</span>
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white"
                  title="Open source URL"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
