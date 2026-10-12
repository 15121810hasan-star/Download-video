import React from 'react';
import { Language, translations } from '../translations';
import { Copy, ClipboardCheck, ArrowDownToLine } from 'lucide-react';

interface HowToGuideProps {
  currentLang: Language;
}

export const HowToGuide: React.FC<HowToGuideProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const steps = [
    {
      num: '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: Copy,
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
    },
    {
      num: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: ClipboardCheck,
      color: 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30',
    },
    {
      num: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: ArrowDownToLine,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <section id="how-to" className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          {currentLang === 'bn' ? 'মাত্র ৩টি সহজ ধাপে ভিডিও ডাউনলোড করুন' : 'Download HD Videos in 3 Easy Steps'}
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          {currentLang === 'bn'
            ? 'কোনো জটিলতা ছাড়াই মোবাইল বা কম্পিউটার থেকে সরাসরি ভিডিও গ্যালারিতে সেভ করুন।'
            : 'Fast, secure, and hassle-free video downloading straight to your storage gallery.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} border flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-700">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                {currentLang === 'bn' ? '১০০% নিরাপদ ও দ্রুত' : '100% Safe & Instant'}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
