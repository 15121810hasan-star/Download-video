import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { UserProfile, OWNER_INFO } from '../types';
import { Globe, Sparkles, User, LogIn, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onToggleLang: () => void;
  activeTab: 'single' | 'batch';
  setActiveTab: (tab: 'single' | 'batch') => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onToggleLang,
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onSignOut,
}) => {
  const t = translations[currentLang];
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0 group"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </span>
          <span>SnapHD</span>
          <span className="text-[11px] font-mono tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
            AI ULTRA
          </span>
        </a>

        {/* Zone 2: Concise Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('single')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'single' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'batch' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            {t.navBatch}
          </button>
          <a
            href="#how-to"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {t.navHowTo}
          </a>
          <a
            href="#platforms"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {t.navPlatforms}
          </a>
          <a
            href="#creator"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Hasan Mahmud</span>
          </a>
        </nav>

        {/* Zone 3: Primary Action: Auth + Language */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 transition-all text-xs font-semibold text-white"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-6 h-6 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p className="text-xs font-bold text-white truncate">
                      {user.displayName || 'SnapHD User'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{t.cloudSynced}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.logoutBtn}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.loginBtn}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800 transition-all"
            title="বাংলা / English"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentLang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
