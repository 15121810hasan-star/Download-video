import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  currentLang: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: currentLang === 'bn'
        ? 'টিকটক ভিডিও কি সত্যি ওয়াটারমার্ক বা লোগো ছাড়া ডাউনলোড হবে?'
        : 'Does TikTok video download really remove the watermark?',
      a: currentLang === 'bn'
        ? 'হ্যাঁ, আমাদের সিস্টেম টিকটকের অরিজিনাল ক্লিন ভিডিও স্ট্রিম সরাসরি কোনো ওয়াটারমার্ক ছাড়াই এক্সট্র্যাক্ট করে 1080p ফুল এইচডি তে প্রদান করে।'
        : 'Yes, SnapHD extracts the original clean direct video stream from TikTok servers without adding any watermark or logos.',
    },
    {
      q: currentLang === 'bn'
        ? 'ফেসবুক ও ইউটিউব ভিডিও কি সরাসরি ফোনে সেভ হবে?'
        : 'Will Facebook and YouTube videos save directly to phone gallery?',
      a: currentLang === 'bn'
        ? 'হ্যাঁ! ডাউনলোড বাটনে ক্লিক করলে ফাইলটি সাথে সাথে আপনার অ্যান্ড্রয়েড বা আইফোনের ডাউনলোড ফোল্ডারে MP4 ফরম্যাটে জমা হয়ে যাবে।'
        : 'Yes, clicking the download button immediately saves standard MP4 or MP3 files to your phone or computer storage folder.',
    },
    {
      q: currentLang === 'bn'
        ? 'এটি কি সম্পূর্ণ ফ্রি এবং কোনো রেজিস্ট্রেশন প্রয়োজন আছে?'
        : 'Is this service completely free and does it require an account?',
      a: currentLang === 'bn'
        ? 'একদম ফ্রি! কোনো অ্যাকাউন্ট বা পাসওয়ার্ড দিতে হবে না। আপনি আনলিমিটেড ভিডিও ডাউনলোড করতে পারবেন।'
        : 'SnapHD is 100% free with no registration, no login, and unlimited downloads forever.',
    },
    {
      q: currentLang === 'bn'
        ? 'ভিডিওর অডিও বা গান কি আলাদাভাবে MP3 হিসেবে নামানো যাবে?'
        : 'Can I extract and download only the MP3 background audio/music?',
      a: currentLang === 'bn'
        ? 'হ্যাঁ, যেকোনো ভিডিওর কোয়ালিটি অপশন থেকে "Audio Track (MP3)" সিলেক্ট করলেই শুধুমাত্র অরিজিনাল অডিও ফাইলটি ডাউনলোড হবে।'
        : 'Yes, simply select the MP3 Audio option in the download qualities list to save only the original high-bitrate soundtrack.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-400" />
          <span>{t.faqTitle}</span>
        </h2>
        <p className="text-sm text-slate-400">
          {t.faqSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
