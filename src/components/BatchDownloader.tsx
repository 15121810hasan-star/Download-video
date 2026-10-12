import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { Layers, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { VideoMetadata, HistoryItem } from '../types';

interface BatchDownloaderProps {
  currentLang: Language;
  onSaveToHistory: (item: HistoryItem) => void;
}

export const BatchDownloader: React.FC<BatchDownloaderProps> = ({
  currentLang,
  onSaveToHistory,
}) => {
  const t = translations[currentLang];
  const [linksText, setLinksText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<VideoMetadata[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProcessBatch = async () => {
    setError(null);
    const urls = linksText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('http'));

    if (urls.length === 0) {
      setError(
        currentLang === 'bn'
          ? 'অনুগ্রহ করে প্রতি লাইনে একটি করে সঠিক ভিডিও লিঙ্ক লিখুন।'
          : 'Please enter at least one valid video URL per line.'
      );
      return;
    }

    setIsProcessing(true);
    const extractedList: VideoMetadata[] = [];

    for (const singleUrl of urls.slice(0, 10)) {
      try {
        const res = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: singleUrl }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            extractedList.push(json.data);
          }
        }
      } catch (err) {
        console.warn('Batch item extract error', err);
      }
    }

    setResults(extractedList);
    setIsProcessing(false);

    if (extractedList.length === 0) {
      setError(
        currentLang === 'bn'
          ? 'কোনো ভিডিও থেকে তথ্য পাওয়া যায়নি। লিঙ্কগুলো পাবলিক কিনা যাচাই করুন।'
          : 'Could not extract videos from provided URLs. Verify links are public.'
      );
    }
  };

  const handleQuickDownload = (item: VideoMetadata) => {
    const primaryFormat = item.formats[0];
    if (!primaryFormat) return;

    onSaveToHistory({
      id: `${item.id}_${Date.now()}`,
      url: item.originalUrl,
      title: item.title,
      platform: item.platform,
      thumbnail: item.thumbnail || '',
      quality: primaryFormat.quality,
      downloadedAt: Date.now(),
    });

    const filename = `${item.title.slice(0, 30)}_${primaryFormat.quality}.mp4`.replace(/[^a-zA-Z0-9_.-]/g, '_');
    
    if (primaryFormat.downloadUrl.startsWith('http') && !primaryFormat.downloadUrl.includes('cobalt') && !primaryFormat.downloadUrl.includes('y2mate')) {
      const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(primaryFormat.downloadUrl)}&filename=${encodeURIComponent(filename)}`;
      const anchor = document.createElement('a');
      anchor.href = proxyUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else {
      window.open(primaryFormat.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t.batchTitle}</h2>
            <p className="text-xs text-slate-400">{t.batchDesc}</p>
          </div>
        </div>

        <div className="mt-4">
          <textarea
            rows={5}
            value={linksText}
            onChange={(e) => setLinksText(e.target.value)}
            placeholder={t.batchPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none transition-colors"
          />

          {error && (
            <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-between items-center mt-3">
            <span className="text-[11px] text-slate-400">
              {currentLang === 'bn' ? 'সর্বোচ্চ ১০টি লিঙ্ক একসাথে সাপোর্ট করে' : 'Up to 10 links supported per batch'}
            </span>
            <button
              onClick={handleProcessBatch}
              disabled={isProcessing || !linksText.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/30"
            >
              {isProcessing && <span className="animate-spin text-xs">⟳</span>}
              <span>{isProcessing ? t.processingBtn : t.batchBtn}</span>
            </button>
          </div>
        </div>

        {/* Results grid */}
        {results.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {currentLang === 'bn' ? `${results.length}টি ভিডিও পাওয়া গেছে:` : `Found ${results.length} Videos:`}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.map((vid, i) => (
                <div
                  key={`${vid.id}_${i}`}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={vid.thumbnail || '/src/assets/images/hero_video_banner_1791796910439.jpg'}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">{vid.title}</div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider">{vid.platform}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickDownload(vid)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shrink-0"
                    title={t.downloadNow}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
