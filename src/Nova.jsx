import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Nova() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ar');

  // تحديد اتجاه الصفحة بناءً على التبويب النشط
  const isRtl = activeTab !== 'en';

  return (
    <div 
      className="min-h-screen bg-[#0d0714] text-[#f1edf5] font-sans flex flex-col justify-between selection:bg-[#a78bfa] selection:text-black"
      dir={isRtl ? "rtl" : "ltr"}
    >
      
      {/* 1. Navbar */}
      <nav className="w-full px-8 py-5 flex justify-between items-center bg-[#0d0714]">
        <Link 
          to="/" 
          className="text-[#a78bfa] hover:text-[#c4b5fd] text-sm font-medium transition duration-200 flex items-center gap-1"
        >
          <span>{isRtl ? '→' : '←'}</span> {t('Home')}
        </Link>
        
        <div className="text-2xl font-black tracking-wider text-[#cbd5e1]" dir="ltr">
          An Owl<span className="text-[#a78bfa] font-light"> of Dawn</span>
        </div>
      </nav>

      {/* 2. Main Content */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-grow flex flex-col items-center">
        
        {/* Navigation Tabs Bar */}
        <div className="w-full bg-[#130a1e] border border-[#231435] rounded-xl p-2 mb-8 grid grid-cols-3 gap-2">
          
          <button
            onClick={() => setActiveTab('ar')}
            className={`py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'ar'
                ? 'bg-[#a78bfa] text-[#0d0714] shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-[#1a0f2b]'
            }`}
          >
            <span></span> النسخة العربية
          </button>

          <button
            onClick={() => setActiveTab('en')}
            className={`py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'en'
                ? 'bg-[#a78bfa] text-[#0d0714] shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-[#1a0f2b]'
            }`}
          >
            <span></span> English Version
          </button>

          <button
            onClick={() => setActiveTab('physical')}
            className={`py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'physical'
                ? 'bg-[#a78bfa] text-[#0d0714] shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-[#1a0f2b]'
            }`}
          >
            <span></span> النسخة المطبوعة
          </button>

        </div>

        {/* Dynamic Card Area */}
        <div className="w-full bg-[#130a1e]/80 border border-[#231435] rounded-2xl p-8 shadow-2xl min-h-[260px] flex flex-col justify-between">
          
          {/* Header section inside the card */}
          <div className="flex justify-between items-center mb-6 border-b border-[#231435] pb-4">
            <span className="text-sm font-mono text-[#cbd5e1] bg-[#cbd5e1]/10 px-3 py-1 rounded border border-[#cbd5e1]/20">
             {isRtl ? 'الفصل 1' :'Chapter 1'} 
            </span>
            <span className="text-xs text-gray-400 bg-[#0d0714] px-3 py-1 rounded border border-[#231435]">
              {isRtl ? '30 صفحة' : '30 Pages'}
            </span>
          </div>

          {/* Dynamic Content based on Active Tab */}
          {activeTab === 'ar' && (
            <div className="flex flex-col items-start gap-4 text-right">
              <h1 className="text-3xl font-extrabold text-white">
                {t('ولادة حكاية')} - النسخة العربية
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                استمتع بقراءة الفصل الأول من مانجا عائلة الأندلس باللغة العربية عبر الموقع الرقمي.
              </p>
              <Link 
                to="/Book1arb"
                className="mt-4 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#0d0714] font-bold px-6 py-3 rounded-xl transition duration-200 inline-flex items-center gap-2"
              >
                ابدأ القراءة الآن <span>←</span>
              </Link>
            </div>
          )}

          {activeTab === 'en' && (
            <div className="flex flex-col items-start gap-4 text-left">
              <h1 className="text-3xl font-extrabold text-white">
                The Birth of a Tale - English Version
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Read the first chapter of AL Andalos Family in English using our interactive web reader.
              </p>
              <Link 
                to="/Book1eng"
                className="mt-4 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#0d0714] font-bold px-6 py-3 rounded-xl transition duration-200 inline-flex items-center gap-2"
              >
                Start Reading <span>→</span>
              </Link>
            </div>
          )}

          {activeTab === 'physical' && (
            <div className="flex flex-col items-start gap-4 text-right">
              <h1 className="text-3xl font-extrabold text-white">
                النسخة الورقية المطبوعة
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                احصل على نسختك الورقية المطبوعة بجودة عالية وشحن مباشر إلى عنوانك.
              </p>
              <a 
                href='mailto:roa65521@gmail.com'
                className="mt-4 bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] hover:opacity-95 text-black font-bold px-8 py-3 rounded-xl transition duration-200 shadow-lg"
              >
              غير متاحة حاليا 
              </a>
            </div>
          )}

        </div>

      </main>

      {/* 3. Footer */}
      <footer className="w-full py-6 text-center text-xs text-gray-500 bg-[#0d0714] border-t border-[#1a0f2b]" dir="ltr">
        © 2026 An Owl of Dawn. All Rights Reserved
      </footer>

    </div>
  );
}

export default Nova;