import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  Smartphone, 
  Download, 
  Globe2, 
  Sparkles, 
  MapPin, 
  BookOpen, 
  ShieldCheck, 
  Heart, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  Building2, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

export const GlobalLandingWebsite: React.FC = () => {
  const { setAppDisplayMode, setCurrentView, approvedAds } = useApp();
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const handleDownload = (storeName: string) => {
    setDownloadSuccessToast(`درخواست دانلود از «${storeName}» با موفقیت ثبت شد. لینک دانلود مستقیم برای شما فعال گردید.`);
    setTimeout(() => setDownloadSuccessToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* پیام بازخورد دانلود */}
      {downloadSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* هدر وب‌سایت رسمی amvatgram.com */}
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 overflow-hidden shadow-lg shadow-amber-950/40 flex-shrink-0 flex items-center justify-center">
              <img src="/assets/app-logo.jpg" alt="Amvatgram Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-stone-100 tracking-tight">امواتگرام</span>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  amvatgram.com
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                سامانه بین‌المللی و جامع اطلاع‌رسانی ترحیم، مجالس و خدمات معنوی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setAppDisplayMode('app');
                setCurrentView('home');
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>ورود به اپلیکیشن موبایل (Web App)</span>
            </button>
          </div>
        </div>
      </header>

      {/* بخش قهرمان (Hero Section) */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-stone-800/80 bg-gradient-to-b from-stone-900/60 to-stone-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* متن و لینک‌های دانلود */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 bg-amber-950/50 border border-amber-800/60 px-3.5 py-1.5 rounded-full text-xs text-amber-300 font-bold">
                <Globe2 className="w-4 h-4" />
                <span>پلتفرم جهانی اطلاع‌رسانی ترحیم با پشتیبانی چندزبانه</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-stone-100 leading-tight">
                سامانه هوشمند و جهانی <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                  اطلاع‌رسانی ترحیم و یادبود
                </span>
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                امواتگرام بستری امن، معنوی و بین‌المللی است برای آگاهی از مجالس ترحیم، مکان‌یابی دقیق مساجد و آرامستان‌ها، طراحی هوشمند پوستر یادبود، قرائت صوتی قرآن و ادعیه، و ابراز همدردی در سراسر جهان.
              </p>

              {/* باکس دکمه‌های رسمی دانلود اپلیکیشن موبایل (بند ۶ خواسته کاربر) */}
              <div className="pt-4 space-y-3">
                <span className="text-xs text-stone-400 font-bold block">
                  دانلود مستقیم و نصب رایگان نسخه موبایل:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto lg:mx-0">
                  {/* Google Play */}
                  <button
                    type="button"
                    onClick={() => handleDownload('گوگل پلی (Google Play)')}
                    className="p-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-md group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-stone-950 flex items-center justify-center text-lg">
                      ▶️
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-stone-400 block">دریافت از</span>
                      <strong className="text-xs text-stone-200 group-hover:text-amber-300">Google Play</strong>
                    </div>
                  </button>

                  {/* App Store */}
                  <button
                    type="button"
                    onClick={() => handleDownload('اپ استور اپل (App Store)')}
                    className="p-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-md group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-stone-950 flex items-center justify-center text-lg">
                      🍏
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-stone-400 block">دانلود از</span>
                      <strong className="text-xs text-stone-200 group-hover:text-amber-300">App Store</strong>
                    </div>
                  </button>

                  {/* Cafe Bazaar */}
                  <button
                    type="button"
                    onClick={() => handleDownload('کافه بازار (Bazaar)')}
                    className="p-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-md group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-stone-950 flex items-center justify-center text-lg">
                      🛍️
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-stone-400 block">دریافت از</span>
                      <strong className="text-xs text-stone-200 group-hover:text-amber-300">کافه بازار</strong>
                    </div>
                  </button>

                  {/* Direct APK */}
                  <button
                    type="button"
                    onClick={() => handleDownload('دانلود مستقیم فایل نصبی APK')}
                    className="p-3 bg-stone-900 hover:bg-stone-850 border border-amber-600/40 hover:border-amber-500 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-md group cursor-pointer bg-gradient-to-b from-amber-950/20 to-transparent"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-amber-400 font-bold block">دانلود مستقیم</span>
                      <strong className="text-xs text-stone-100">فایل APK اندروید</strong>
                    </div>
                  </button>
                </div>
              </div>

              {/* آمار اجمالی */}
              <div className="pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-400">
                <div>
                  <strong className="text-base sm:text-lg font-black text-stone-100 font-mono block">۵۰+</strong>
                  <span>شهر بزرگ تحت پوشش</span>
                </div>
                <div className="w-px h-8 bg-stone-800 hidden sm:block" />
                <div>
                  <strong className="text-base sm:text-lg font-black text-stone-100 font-mono block">۱۰۰٪</strong>
                  <span>مکان‌یابی دقیق GPS مساجد</span>
                </div>
                <div className="w-px h-8 bg-stone-800 hidden sm:block" />
                <div>
                  <strong className="text-base sm:text-lg font-black text-stone-100 font-mono block">۵ زبانه</strong>
                  <span>فارسی، کوردی، English، Türkçe، العربية</span>
                </div>
              </div>
            </div>

            {/* موک‌آپ گوشی موبایل و محیط شبکه اجتماعی */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-72 sm:w-80 rounded-[44px] border-[6px] border-stone-800 bg-stone-950 shadow-2xl overflow-hidden p-2 relative">
                {/* شیار ناچ موبایل */}
                <div className="w-24 h-4 bg-stone-800 rounded-full mx-auto mb-2" />
                
                {/* صفحه شبیه‌سازی‌شده اپلیکیشن */}
                <div className="space-y-3 bg-stone-900 rounded-[32px] p-3 text-xs overflow-hidden">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-black text-amber-400 text-xs">امواتگرام موبایل</span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-bold">زنده</span>
                  </div>

                  {/* استوری درگذشتگان امروز */}
                  <div className="h-28 rounded-2xl overflow-hidden relative border border-stone-800">
                    <img src={approvedAds[0]?.deceased.avatarUrl || '/assets/app-logo.jpg'} alt="متوفی" className="w-full h-full object-cover filter grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    <span className="absolute bottom-2 right-2 font-bold text-[10px] text-amber-300">
                      {approvedAds[0]?.deceased.fullName || 'شادروان ...'}
                    </span>
                  </div>

                  {/* نمونه کارت آگهی */}
                  <div className="bg-stone-950 p-2.5 rounded-2xl border border-stone-800 space-y-1.5">
                    <span className="text-[9px] text-stone-500 font-mono">AMG-9401</span>
                    <p className="font-bold text-stone-100 text-xs truncate">مرحوم حاج محمد صالح امینی</p>
                    <p className="text-[10px] text-stone-400">مجلس فاتحه در مسجد جامع مرکزی</p>
                    <div className="flex items-center justify-between text-[9px] pt-1 border-t border-stone-850 text-stone-400">
                      <span>مسیریابی آنلاین GPS</span>
                      <span className="text-amber-400">🖤 ۸۹ تسلیت</span>
                    </div>
                  </div>

                  {/* نوار زیرین اپ */}
                  <div className="bg-stone-950 p-2 rounded-xl flex items-center justify-around text-[9px] text-stone-400 border border-stone-800">
                    <span className="text-amber-400 font-bold">🏠 خانه</span>
                    <span>🔍 جستجو</span>
                    <span>➕ ثبت آگهی</span>
                    <span>👤 پروفایل</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ویژگی‌های کلیدی سامانه */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
              چرا امواتگرام انتخاب نخست خانواده‌هاست؟
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              امکانات کامل جهت کاستن از دغدغه‌های بازماندگان در روزهای سخت سوگواری
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                🗺️
              </div>
              <h3 className="text-base font-bold text-stone-100">مکان‌یابی و نقشه ماهواره‌ای مساجد</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                ثبت دقیق موقعیت جغرافیایی آرامستان، مسجد و تالار مجالس با GPS و اتصال مستقیم به Google Maps ،Waze و نشان جهت سهولت در مسیریابی عزاداران.
              </p>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-6 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-xl">
                🎨
              </div>
              <h3 className="text-base font-bold text-stone-100">استودیوی هوشمند پوستر (Mini Canva)</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                تنظیم عکس، برش هوشمند، اعمال روبان مشکی و قاب‌های فاخر مذهبی، و دانلود باکیفیت در ۴ فرمت استوری، پست و پوستر چاپی A4 در چند ثانیه.
              </p>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-6 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                📖
              </div>
              <h3 className="text-base font-bold text-stone-100">قرآن صوتی و ادعیه اهل قبور</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                تلاوت صوتی سوره‌های مبارکه یس، رحمن، واقعه و ملک با صدای قاریان برجسته جهان اسلام، همراه با ادعیه شرعی تشییع و فاتحه‌خوانی.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* پاورقی رسمی وب‌سایت */}
      <footer className="bg-stone-900 border-t border-stone-800 py-10 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
              <span className="font-bold text-stone-200">امواتگرام</span>
              <span className="font-mono text-amber-400 font-bold">amvatgram.com</span>
            </div>
            <p className="text-[11px] text-stone-500 text-center md:text-right">
              تمامی حقوق برای سامانه بین‌المللی اطلاع‌رسانی ترحیم و یادبود محفوظ است © 2026
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => {
                setAppDisplayMode('app');
                setCurrentView('home');
              }}
              className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
            >
              نسخه وب‌اپلیکیشن (PWA)
            </button>
            <span>•</span>
            <span className="text-stone-500">پشتیبانی: support@amvatgram.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
