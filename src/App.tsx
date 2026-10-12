/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HeroDownloader } from './components/HeroDownloader';
import { VideoResultCard } from './components/VideoResultCard';
import { BatchDownloader } from './components/BatchDownloader';
import { DownloadHistory } from './components/DownloadHistory';
import { CreatorProfile } from './components/CreatorProfile';
import { HowToGuide } from './components/HowToGuide';
import { SupportedPlatforms } from './components/SupportedPlatforms';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { VideoMetadata, HistoryItem, UserProfile } from './types';
import { Language, translations } from './translations';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('bn');
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [extractedData, setExtractedData] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(profile);

        // Record user profile in Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(
            userDocRef,
            {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Could not sync user profile to firestore', err);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore downloads if user is logged in, else use localStorage
  useEffect(() => {
    if (!user) {
      // Load fallback from localStorage for guest users
      try {
        const saved = localStorage.getItem('snaphd_history');
        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch (e) {
        console.warn('Failed to parse local history', e);
      }
      return;
    }

    // Authenticated user: subscribe to Firestore downloads collection
    const downloadsPath = `users/${user.uid}/downloads`;
    try {
      const q = query(collection(db, 'users', user.uid, 'downloads'), orderBy('downloadedAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: HistoryItem[] = [];
          snapshot.forEach((d) => {
            const data = d.data();
            items.push({
              id: d.id,
              url: data.url,
              title: data.title,
              platform: data.platform,
              thumbnail: data.thumbnail || '',
              quality: data.quality || 'HD',
              downloadedAt: data.downloadedAt?.toMillis ? data.downloadedAt.toMillis() : Date.now(),
              isAiEnhanced: data.isAiEnhanced,
              aiPreset: data.aiPreset,
            });
          });
          setHistory(items);
        },
        (snapshotError) => {
          handleFirestoreError(snapshotError, OperationType.LIST, downloadsPath);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, downloadsPath);
    }
  }, [user]);

  const handleToggleLang = () => {
    setCurrentLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (e) {
      console.warn('Sign out failed', e);
    }
  };

  const handleSaveToHistory = async (item: HistoryItem) => {
    // 1. If user is logged in, save to Cloud Firestore database
    if (user) {
      const recordId = `dl_${Date.now()}`;
      const path = `users/${user.uid}/downloads/${recordId}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'downloads', recordId), {
          id: recordId,
          userId: user.uid,
          url: item.url.slice(0, 2048),
          title: item.title.slice(0, 300),
          platform: item.platform,
          thumbnail: (item.thumbnail || '').slice(0, 2048),
          quality: item.quality.slice(0, 64),
          isAiEnhanced: Boolean(item.isAiEnhanced),
          aiPreset: item.aiPreset || 'none',
          downloadedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore write error, falling back to local storage', err);
      }
    }

    // 2. Always maintain local history for instant responsive feedback
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id && h.url !== item.url);
      const updated = [item, ...filtered].slice(0, 20);
      try {
        localStorage.setItem('snaphd_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save to localStorage', e);
      }
      return updated;
    });
  };

  const handleClearHistory = async () => {
    if (user) {
      // Clear all items in Firestore for this user
      for (const item of history) {
        try {
          await deleteDoc(doc(db, 'users', user.uid, 'downloads', item.id));
        } catch (e) {
          console.warn('Delete doc error', e);
        }
      }
    }
    setHistory([]);
    try {
      localStorage.removeItem('snaphd_history');
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }
  };

  const handleExtract = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setExtractedData(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.error ||
            (currentLang === 'bn'
              ? translations.bn.errorFetchFailed
              : translations.en.errorFetchFailed)
        );
      }

      setExtractedData(json.data);

      setTimeout(() => {
        resultCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Extract error:', err);
      setError(
        err.message ||
          (currentLang === 'bn'
            ? translations.bn.errorFetchFailed
            : translations.en.errorFetchFailed)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar with Auth & Language */}
      <Header
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'single' ? (
          <>
            {/* Hero & Search Form */}
            <HeroDownloader
              currentLang={currentLang}
              onExtract={handleExtract}
              isLoading={isLoading}
              error={error}
            />

            {/* Extracted Video Result Card with AI Clarity Engine */}
            {extractedData && (
              <div ref={resultCardRef} className="max-w-4xl mx-auto px-4 sm:px-6 mb-12 scroll-mt-24">
                <VideoResultCard
                  data={extractedData}
                  currentLang={currentLang}
                  onSaveToHistory={handleSaveToHistory}
                />
              </div>
            )}

            {/* Download History (Cloud Synced with Firebase) */}
            <DownloadHistory
              history={history}
              currentLang={currentLang}
              onClearHistory={handleClearHistory}
              onReExtract={handleExtract}
            />

            {/* Creator Profile for Hasan Mahmud */}
            <CreatorProfile currentLang={currentLang} />

            {/* Step-by-Step Visual Guide */}
            <HowToGuide currentLang={currentLang} />

            {/* Supported Platforms (Facebook, TikTok, YouTube, Instagram) */}
            <SupportedPlatforms currentLang={currentLang} />

            {/* FAQs */}
            <FaqSection currentLang={currentLang} />
          </>
        ) : (
          /* Batch Multi-link Downloader Mode */
          <div className="py-8">
            <BatchDownloader
              currentLang={currentLang}
              onSaveToHistory={handleSaveToHistory}
            />
            <CreatorProfile currentLang={currentLang} />
            <HowToGuide currentLang={currentLang} />
          </div>
        )}
      </main>

      {/* Quiet Footer with Creator contact & SSL */}
      <Footer currentLang={currentLang} />

      {/* Auth Modal for Login/Logout */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}
