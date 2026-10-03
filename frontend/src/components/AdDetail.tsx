import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Share2, 
  ArrowRight, 
  MessageSquare, 
  Send, 
  CheckCircle,
  Building2,
  Navigation,
  Compass,
  Check,
  BookOpen,
  Home,
  Megaphone,
  Sun,
  Sunset,
  Moon,
  Building,
  ExternalLink
} from 'lucide-react';

import { Madhhab, CondolenceComment } from '../types';
import { getActiveMosqueSlots } from '../utils/ceremonyHelpers';
import { FramedPhoto } from './FramedPhoto';
import { MemorialTemplateStudioModal } from './TemplateEngine/MemorialTemplateStudioModal';
import { Sparkles, Download } from 'lucide-react';

export const AdDetail: React.FC = () => {
  const { activeAd, setCurrentView, toggleHeart, addCommentToAd, currentUser, activeMadhhabContext } = useApp();

  const isSunni = activeMadhhabContext === 'sunni';

  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.fullName || '');
  const [authorRelation, setAuthorRelation] = useState('همشهری');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // کامنت‌های مجاز و متون تسلیت استاندارد تفکیک‌شده بر اساس مذهب (بند ۲)
  const sunniTemplates = [
    {
      category: 'آیات شریفه قرآن کریم',
      text: '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ — کُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ» از درگاه خداوند متعال برای آن عزیز سفرکرده غفران الهی و علو درجات مسئلت دارم.',
    },
    {
      category: 'دعای مغفرت شرعی (شافعی)',
      text: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَکْرِمْ نُزُلَهُ. تسلیت صمیمانه به خانواده‌های داغدار و بازماندگان.',
    },
    {
      category: 'پیام تسلیت کُردی (شهر انتخابی و مناطق تحت پوشش)',
      text: 'سەرەخۆشی لە بنەماڵەی بەڕێزتان دەکەم، خوای گەورە لێی خۆش بێت و جێگەی بەهەشتی بەرین بێت و سەبوری و ئارامی بە ئێوە ببەخشێت.',
    },
    {
      category: 'همدردی همشهریان',
      text: 'ضایعه درگذشت این عزیز گرانقدر را به تمامی بازماندگان و همشهریان شریف تسلیت عرض نموده، برای شما صبر و اجر آرزومندم.',
    },
  ];

  const shiaTemplates = [
    {
      category: 'آیات شریفه و تسلیت مذهبی',
      text: '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ» عَظَّمَ اللَّهُ أُجُورَنَا وَأُجُورَكُمْ بِمُصَابِنَا. همنشین با اولیاء الهی باشند.',
    },
    {
      category: 'طلب شفاعت اهل بیت (ع)',
      text: 'خداوند روح پاک این مرحوم را با ائمه اطهار و شهدای کربلا محشور فرماید. برای بازماندگان صبر جزیل مسئلت داریم.',
    },
    {
      category: 'پیام تسلیت و یادبود',
      text: 'مصیبت وارده را به بیت معزا و داغدار تسلیت عرض نموده، غفران الهی و آرامش ابدی برای روح آن مرحوم آرزومندم.',
    },
  ];

  const templates = isSunni ? sunniTemplates : shiaTemplates;

  if (!activeAd) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-400">آگهی مورد نظر یافت نشد.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 bg-stone-800 text-stone-200 px-4 py-2 rounded-xl text-xs"
        >
          بازگشت به آگهی‌ها
        </button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = selectedTemplate 
      ? (customNote ? `${selectedTemplate} — ${customNote}` : selectedTemplate)
      : customNote;

    if (!finalContent.trim()) return;

    addCommentToAd(activeAd.id, {
      authorName: authorName.trim() || 'همشهری',
      authorRelation,
      text: finalContent,
      type: 'traditional',
      madhhab: activeMadhhabContext,
    });

    setSelectedTemplate('');
    setCustomNote('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  const burialCeremony = activeAd.ceremonies.find((c) => c.type === 'burial');
  const burial = burialCeremony;
  const mosqueCeremonies = activeAd.ceremonies.filter((c) => c.type !== 'burial' && c.type !== 'condolence_women');
  const womenCeremonies = activeAd.ceremonies.filter((c) => c.type === 'condolence_women');

  const avatarImage = activeAd.deceased.avatarUrl || '/assets/app-logo.jpg';
  const comments = activeAd.comments || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* دکمه بازگشت */}
      <button
        onClick={() => setCurrentView('home')}
        className="flex items-center gap-1.5 text-stone-400 hover:text-stone-100 text-xs mb-6 transition-colors cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به لیست آگهی‌ها</span>
      </button>

      {/* سربرگ آگهی و مشخصات متوفی */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* عکس متوفی با کادر عزا و قالب هوشمند */}
          <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-amber-600/40 bg-stone-950 flex-shrink-0 shadow-2xl relative">
            <FramedPhoto
              photoUrl={avatarImage}
              frameId={activeAd.selectedFrameId}
              templateConfig={activeAd.templateConfig}
              fullName={activeAd.deceased.fullName}
              titlePrefix={activeAd.deceased.titlePrefix}
              fatherName={activeAd.deceased.fatherName}
              showFooterName={false}
            />
            <div className="absolute top-2 right-2 bg-black/80 text-amber-400 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/40 z-20">
              مجلس فاتحه
            </div>
          </div>

          <div className="flex-1 text-center md:text-right space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-mono text-xs bg-stone-950 text-amber-400 px-3 py-1 rounded-xl border border-stone-800 font-bold">
                {activeAd.trackingCode}
              </span>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                activeAd.deceased.madhhab === 'sunni'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-blue-950 text-blue-300 border border-blue-800'
              }`}>
                {activeAd.deceased.madhhab === 'sunni' ? 'اهل سنت (امام شافعی)' : 'اهل تشیع'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              {activeAd.deceased.fullName}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-stone-300">
              <p>فرزند گرامی: <strong className="text-stone-100">{activeAd.deceased.fatherName}</strong></p>
              {activeAd.deceased.age && <span>• سن: {activeAd.deceased.age} سال</span>}
              <span>• تاریخ فوت: {activeAd.deceased.dateOfDeath}</span>
            </div>

            {burial && (
              <p className="text-xs text-stone-400 flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>محل تدفین: {burial.locationName}</span>
              </p>
            )}

            {activeAd.deceased.familyMembersNote && (
              <p className="text-xs text-stone-300 bg-stone-950 p-3 rounded-2xl border border-stone-800 leading-relaxed">
                <strong className="text-amber-400 block mb-1">بازماندگان و خاندان‌های وابسته:</strong>
                {activeAd.deceased.familyMembersNote}
              </p>
            )}

            {/* دکمه‌های تسلیت، اشتراک‌گذاری و ورود به استودیوی پوستر */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => toggleHeart(activeAd.id)}
                className="bg-stone-950 hover:bg-stone-800 border border-stone-800 px-4 py-2.5 rounded-2xl text-xs font-bold text-amber-400 flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span className="text-lg">🖤</span>
                <span>ابراز همدردی ({activeAd.heartCount})</span>
              </button>

              <button
                onClick={() => setIsStudioOpen(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-950/60"
              >
                <Sparkles className="w-4 h-4" />
                <span>طراحی و دانلود پوستر ترحیم (Mini Canva)</span>
              </button>

              <button
                onClick={handleShare}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'لینک کپی شد' : 'اشتراک‌گذاری اعلامیه'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* بنر اختصاصی دانلود پوستر ترحیم در فرمت‌های استوری، پست و چاپ A4 */}
      <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/30 border border-amber-600/50 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5 text-center sm:text-right">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl flex-shrink-0">
            📥
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-300">
              دانلود پوستر اختصاصی ترحیم {activeAd.deceased.titlePrefix || 'زنده‌یاد'} {activeAd.deceased.fullName}
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              خروجی باکیفیت و استاندارد در ۴ فرمت: استوری اینستاگرام و واتس‌اپ، پست فید، و فایل چاپی با کیفیت A4
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsStudioOpen(true)}
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/50 whitespace-nowrap transition-all"
        >
          <Download className="w-4 h-4" />
          <span>دانلود و تنظیم پوستر (۴ فرمت)</span>
        </button>
      </div>

      {/* ۱. اعلان سراسری شهر جهت تشییع و خاکسپاری متوفی */}
      {burialCeremony && (
        <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border-2 border-amber-600/40 rounded-3xl p-6 sm:p-7 shadow-2xl mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-800/40 pb-3">
            <div className="flex items-center gap-2.5 text-amber-400">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-300">
                  اعلان سراسری شهر {burialCeremony.targetCity || 'شهر انتخابی'} — تشییع و خاکسپاری
                </h3>
                <span className="text-[11px] text-stone-400">
                  اطلاعیه عمومی شهری جهت حضور و اقامه نماز میت و تدفین
                </span>
              </div>
            </div>

            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-medium">
              بدون قید ساعت قطعی (اعلان سراسری شهری)
            </span>
          </div>

          <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-stone-850 space-y-3">
            <p className="text-stone-100 text-sm sm:text-base leading-relaxed font-serif text-center sm:text-right">
              {burialCeremony.citywideAnnouncementText ||
                `«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ» به اطلاع عموم همشهریان گرامی شهر ${burialCeremony.targetCity || 'شهر انتخابی'} می‌رساند؛ پیکر مطهر ${activeAd.deceased.gender === 'female' ? 'مرحومه مغفوره' : 'مرحوم مغفور'} ${activeAd.deceased.fullName} به ${burialCeremony.cemeteryName || burialCeremony.locationName} خاکسپاری خواهد شد.`}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-850 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span className="text-stone-300">آرامستان مقصد:</span>
                <strong className="text-stone-100">{burialCeremony.cemeteryName || burialCeremony.locationName}</strong>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-stone-300">تاریخ:</span>
                <strong className="text-stone-100">{burialCeremony.date}</strong>
              </div>

              <div className="text-[11px] text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2.5 py-1 rounded-lg">
                📢 مراسم تشییع متوفی حسب عرف تعیین ساعت نمی‌شود و به آرامستان مقصد انجام می‌پذیرد.
              </div>
            </div>

            {/* نوار مسیریابی هوشمند برای مراجعین به آرامستان */}
            <div className="pt-3 border-t border-stone-850 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-stone-400 font-medium">مسیریابی مستقیم به آرامستان با GPS:</span>
              <div className="flex items-center gap-1.5">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${burialCeremony.lat || 35.5412},${burialCeremony.lng || 46.1950}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-2.5 py-1 rounded-lg border border-stone-800 text-[11px] flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                  <span>گوگل مپ</span>
                </a>
                <a
                  href={`https://waze.com/ul?ll=${burialCeremony.lat || 35.5412},${burialCeremony.lng || 46.1950}&navigate=yes`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-2.5 py-1 rounded-lg border border-stone-800 text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Navigation className="w-3 h-3 text-cyan-400" />
                  <span>Waze</span>
                </a>
                <a
                  href={`https://neshan.org/maps/@${burialCeremony.lat || 35.5412},${burialCeremony.lng || 46.1950},16z`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-2.5 py-1 rounded-lg border border-stone-800 text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Compass className="w-3 h-3 text-blue-400" />
                  <span>نشان</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ۲. برنامه و زمان‌بندی مراسمات مساجد (۳ نوبت صبح، عصر و شب برنامه‌ریزی‌شده توسط صاحب عزا) */}
      {mosqueCeremonies.length > 0 && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>برنامه و زمان‌بندی ساعات مساجد (برنامه‌ریزی‌شده در ۳ نوبت صبح، عصر و شب)</span>
            </h3>
            <span className="text-[11px] text-stone-400">تعیین و برنامه‌ریزی ساعات توسط صاحب عزا</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mosqueCeremonies.map((c) => {
              const activeSlots = getActiveMosqueSlots(c);

              return (
                <div key={c.id} className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3.5 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-stone-100 block text-sm mb-1">{c.title}</span>
                      <p className="text-stone-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{c.locationName}</span>
                      </p>
                    </div>
                    <span className="text-[11px] bg-stone-900 text-stone-400 px-2.5 py-1 rounded-lg border border-stone-850">
                      {c.date}
                    </span>
                  </div>

                  {/* نوبت‌های سه‌گانه تعیین‌شده توسط صاحب عزا */}
                  <div className="bg-stone-900/90 rounded-xl p-3 border border-stone-850 space-y-2">
                    {/* نمایش تعداد روزها و ایام انتخابی هفته */}
                    {(c.ceremonyDurationSummary || (c.selectedDaysOfWeek && c.selectedDaysOfWeek.length > 0)) && (
                      <div className="bg-amber-950/40 border border-amber-700/50 px-3 py-2 rounded-xl flex items-center justify-between text-xs text-amber-200 mb-2.5">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>مدت مجلس: {c.ceremonyDaysCount || c.selectedDaysOfWeek?.length} روز</span>
                        </span>
                        <span className="text-amber-300 font-bold bg-stone-950/80 px-2 py-0.5 rounded-lg border border-stone-800">
                          {c.selectedDaysOfWeek ? c.selectedDaysOfWeek.join(' و ') : c.ceremonyDurationSummary}
                        </span>
                      </div>
                    )}

                    <span className="text-[11px] font-bold text-amber-300 block mb-1">
                      ساعات برگزاری مراسم (برنامه‌ریزی صاحب عزا):
                    </span>

                    {activeSlots.length > 0 ? (
                      <div className="space-y-1.5">
                        {activeSlots.map((s) => (
                          <div
                            key={s.key}
                            className="flex items-center justify-between bg-stone-950/80 px-2.5 py-1.5 rounded-lg border border-stone-800"
                          >
                            <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                              {s.key === 'morning' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
                              {s.key === 'afternoon' && <Sunset className="w-3.5 h-3.5 text-orange-400" />}
                              {s.key === 'evening' && <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                              {s.key === 'legacy' && <Clock className="w-3.5 h-3.5 text-sky-400" />}
                              <span>{s.slotName}:</span>
                            </span>
                            <span className="font-mono text-amber-300 font-bold" dir="ltr">
                              {s.timeRange}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-stone-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span>ساعت: {c.startTime} الی {c.endTime || 'پایان مراسم'}</span>
                      </p>
                    )}
                    {/* نوار مسیریابی به مسجد یا تالار */}
                    <div className="pt-2 border-t border-stone-850 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-400">مسیریابی مستقیم:</span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat || 35.5245},${c.lng || 46.1751}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-2 py-0.5 rounded-lg border border-stone-800 text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
                          <span>Google</span>
                        </a>
                        <a
                          href={`https://waze.com/ul?ll=${c.lat || 35.5245},${c.lng || 46.1751}&navigate=yes`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-2 py-0.5 rounded-lg border border-stone-800 text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                          <span>Waze</span>
                        </a>
                        <a
                          href={`https://neshan.org/maps/@${c.lat || 35.5245},${c.lng || 46.1751},16z`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-2 py-0.5 rounded-lg border border-stone-800 text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <Compass className="w-2.5 h-2.5 text-blue-400" />
                          <span>نشان</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* ۳. مراسم ترحیم بانوان (منحصر به منزل متوفی — صرفاً آدرس منزل بدون تعیین ساعت) */}
      {womenCeremonies.length > 0 && (
        <div className="bg-gradient-to-r from-stone-900 via-rose-950/20 to-stone-900 border border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-950 pb-3">
            <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <Home className="w-4 h-4 text-rose-400" />
              <span>مراسم ترحیم و تعزیت بانوان (منزل متوفی)</span>
            </h3>
            <span className="text-[11px] bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-sans">
              بدون تعیین ساعت
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {womenCeremonies.map((c) => (
              <div key={c.id} className="bg-stone-950 p-5 rounded-2xl border border-rose-950/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-200 block text-sm">{c.title}</span>
                  <span className="text-[11px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded-md border border-stone-850">
                    {c.date}
                  </span>
                </div>

                <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <Home className="w-3.5 h-3.5 text-rose-400" />
                    <span>محل انعقاد مجلس:</span>
                    <strong className="text-stone-100">منزل متوفی</strong>
                  </div>

                  <div className="flex items-start gap-1.5 text-stone-200">
                    <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-400 block text-[11px] mb-0.5">آدرس منزل متوفی:</span>
                      <p className="text-xs leading-relaxed font-medium text-stone-100 bg-stone-950/90 p-2.5 rounded-lg border border-stone-850">
                        {c.deceasedHomeAddress || c.customAddress || 'شهر انتخابی، منزل متوفی'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <span className="text-rose-400 font-medium">
                    📌 بدون تعیین ساعت (مجلس در طول روز در منزل متوفی منعقد است)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat || 35.5269},${c.lng || 46.1764}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-2 py-0.5 rounded-lg border border-stone-800 text-[10px] flex items-center gap-1 transition-colors"
                      title="مسیریابی گوگل به آدرس منزل"
                    >
                      <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
                      <span>Google</span>
                    </a>
                    <a
                      href={`https://waze.com/ul?ll=${c.lat || 35.5269},${c.lng || 46.1764}&navigate=yes`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-2 py-0.5 rounded-lg border border-stone-800 text-[10px] flex items-center gap-1 transition-colors"
                      title="مسیریابی Waze به آدرس منزل"
                    >
                      <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                      <span>Waze</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* بخش ثبت پیام تسلیت با جملات مجاز و آیات شرعی تفکیک‌شده (بند ۲) */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-stone-100">ارسال پیام تسلیت و ابراز همدردی</h3>
          </div>
          <span className="text-[11px] text-stone-400">
            {isSunni ? 'متون مطابق با آداب فقه شافعی و اهل سنت' : 'متون مطابق با ادعیه و آداب اهل تشیع'}
          </span>
        </div>

        <form onSubmit={handleAddComment} className="space-y-4">
          {/* قالب‌های تسلیت مجاز */}
          <div>
            <label className="text-xs text-stone-300 block mb-2 font-medium flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>انتخاب عبارات و آیات تسلیت مجاز و شرعی:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {templates.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedTemplate(tpl.text)}
                  className={`p-3 rounded-2xl border text-right transition-all text-xs cursor-pointer ${
                    selectedTemplate === tpl.text
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="text-[10px] text-amber-500 block mb-1 font-bold">{tpl.category}</span>
                  <p className="line-clamp-2 leading-relaxed">{tpl.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* نام نویسنده و پیام تکمیلی */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-stone-300 block mb-1">نام فرستنده تسلیت</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="نام و نام خانوادگی شما"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-stone-300 block mb-1">نسبت یا عنوان</label>
              <input
                type="text"
                value={authorRelation}
                onChange={(e) => setAuthorRelation(e.target.value)}
                placeholder="مثال: همشهری، دوست، فامیل"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-stone-300 block mb-1 text-xs">متن نهایی پیام تسلیت شما</label>
            <textarea
              rows={3}
              value={selectedTemplate || customNote}
              onChange={(e) => {
                if (selectedTemplate) setSelectedTemplate(e.target.value);
                else setCustomNote(e.target.value);
              }}
              placeholder="یک عبارت تسلیت از بالا انتخاب کنید یا پیام تسلیت خود را بنویسید..."
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-2xl p-3 text-xs text-stone-100 outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {commentSuccess ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle className="w-4 h-4" /> پیام تسلیت شما با احترام ثبت و به صاحب عزا تقدیم شد.
              </span>
            ) : <span></span>}

            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ارسال پیام تسلیت</span>
            </button>
          </div>
        </form>

        {/* لیست پیام‌های تسلیت ثبت شده */}
        <div className="border-t border-stone-800 pt-6 space-y-3">
          <h4 className="text-xs font-bold text-stone-300 mb-2">
            پیام‌های تسلیت و همدردی همشهریان ({comments.length})
          </h4>

          {comments.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-4">
              هنوز پیام تسلیتی ثبت نشده است. اولین فردی باشید که با خاندان معزا ابراز همدردی می‌نماید.
            </p>
          ) : (
            <div className="space-y-2.5">
              {comments.map((cm) => (
                <div key={cm.id} className="bg-stone-950 p-4 rounded-2xl border border-stone-850 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">{cm.authorName}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{cm.createdAt}</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed">{cm.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* مدال استودیوی هوشمند قالب و پوستر ترحیم (Mini Canva) جهت دانلود و اشتراک */}
      <MemorialTemplateStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        initialPhotoUrl={avatarImage}
        initialFullName={activeAd.deceased.fullName}
        initialFatherName={activeAd.deceased.fatherName}
        initialTitlePrefix={activeAd.deceased.titlePrefix}
        initialConfig={activeAd.templateConfig}
      />
    </div>
  );
};
