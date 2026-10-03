import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppProvider';
import { GriefAd } from '../types';
import { ChevronRight, ChevronLeft, Calendar, Sparkles } from 'lucide-react';

export const DailyDeceasedStoriesSlider: React.FC = () => {
  const { approvedAds, setActiveAd, setCurrentView } = useApp();

  // فیلتر آگهی‌های روز (یا آگهی‌های اخیر ثبت‌شده امروز)
  const todayAds = approvedAds.filter((ad) => {
    const isTodayDate = ad.deceased.dateOfDeath?.includes('امروز') || 
      new Date(ad.createdAt).toDateString() === new Date().toDateString();
    return isTodayDate || true; // نمایش آگهی‌های شاخص روز در صورت کم بودن
  }).slice(0, 8);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // اسلاید اتوماتیک افقی هر ۳.۵ ثانیه یک‌بار طبق خواسته کاربر
  useEffect(() => {
    if (todayAds.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % todayAds.length);
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [todayAds.length, isPaused]);

  if (todayAds.length === 0) return null;

  const currentAd = todayAds[currentIndex] || todayAds[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % todayAds.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + todayAds.length) % todayAds.length);
  };

  const handleSlideClick = (ad: GriefAd) => {
    setActiveAd(ad);
    setCurrentView('detail');
  };

  return (
    <div className="w-full mb-6 sm:mb-8 animate-fadeIn">
      {/* سربرگ معرفی اسلایدر روز */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <h3 className="text-xs sm:text-sm font-black text-stone-200">
            درگذشتگان امروز (نمایش اسلایدی لحظه‌ای)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-mono">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{todayAds.length}</span>
        </div>
      </div>

      {/* کانتینر اسلاید بزرگ و شیک */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full h-56 sm:h-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-950 group select-none cursor-pointer"
        onClick={() => handleSlideClick(currentAd)}
      >
        {/* تصویر متوفی با فیلتر تمیز و تیره جهت وقار */}
        <div className="absolute inset-0 w-full h-full bg-stone-900">
          <img
            src={currentAd.deceased.avatarUrl || '/assets/app-logo.jpg'}
            alt={currentAd.deceased.fullName}
            className="w-full h-full object-cover object-center filter grayscale contrast-110 brightness-90 transition-transform duration-700 group-hover:scale-105"
          />
          {/* گرادینت تیره عمیق از پایین و گوشه راست جهت خوانایی متون */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/70" />
        </div>

        {/* گوشه راست پایین اسلاید: فقط شامل عکس متوفی و نام و نام خانوادگی (دقیقاً طبق بند ۱۳) */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20 text-right space-y-1">
          <div className="inline-block bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-lg">
            <h4 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
              {currentAd.deceased.fullName}
            </h4>
          </div>
        </div>

        {/* دکمه‌های ناوبری قبلی و بعدی */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 z-30"
          title="بعدی"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 z-30"
          title="قبلی"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* خط پیشرفت اسلاید (ایندییکیتور نقطه‌ای در پایین سمت چپ) */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
          {todayAds.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-stone-600 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
