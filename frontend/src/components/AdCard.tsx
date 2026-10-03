import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { 
  Heart, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  MessageSquare,
  Send,
  Check,
  ChevronDown,
  ChevronUp,
  Megaphone,
  Home
} from 'lucide-react';
import { GriefAd } from '../types';
import { getTranslation } from '../utils/i18n';
import { getMosqueSlotsSummary } from '../utils/ceremonyHelpers';
import { FramedPhoto } from './FramedPhoto';

export const AdCard: React.FC<{ ad: GriefAd }> = ({ ad }) => {
  const { 
    setActiveAd, 
    setCurrentView, 
    toggleHeart, 
    addCommentToAd, 
    activeMadhhabContext, 
    currentUser,
    language 
  } = useApp();

  const isSunni = activeMadhhabContext === 'sunni';
  const isLtr = language === 'en' || language === 'tr';
  const burial = ad.ceremonies.find((c) => c.type === 'burial');
  const menCeremony = ad.ceremonies.find((c) => c.type === 'condolence_men');
  const womenCeremony = ad.ceremonies.find((c) => c.type === 'condolence_women');

  // استیت‌های کامنت‌گذاری مستقیم و سریع در زیر پست
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  const comments = ad.comments || [];
  const avatarImage = ad.deceased.avatarUrl || '/assets/app-logo.jpg';

  // گزینه‌های آماده تسلیت بر اساس زبان انتخابی کاربر
  const getCondolenceChips = () => {
    switch (language) {
      case 'ku':
        return [
          '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ»',
          'سەرەخۆشی لە بنەماڵەی بەڕێزتان دەکەم',
          'خوای گەورە لێی خۆش بێت و جێگای بەهەشت بێت',
          'خوای گەورە ئارامیتان پێ ببەخشێت',
          'هاوبەشی خەمتانین',
        ];
      case 'en':
        return [
          '“Indeed, to Allah we belong and to Him we return”',
          'May Allah grant patience and solace to the family',
          'May Allah forgive them and grant them Jannatul Firdaus',
          'Our heartfelt condolences and prayers with your family',
        ];
      case 'ar':
        return [
          '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ»',
          '«عَظَّمَ اللَّهُ أَجْرَكُمْ وَأَحْسَنَ عَزَاءَكُمْ وَغَفَرَ لِمَيِّتِكُمْ»',
          '«اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ»',
          '«رَحِمَهُ اللَّهُ وَأَسْكَنَهُ فَسِيحَ جَنَّاتِهِ»',
        ];
      case 'tr':
        return [
          '“İnnâ lillâhi ve innâ ileyhi râciûn”',
          'Başınız sağ olsun, Allah sabır ihsan eylesin',
          'Mekânı cennet, makamı âli olsun',
          'Allah rahmet eylesin, nur içinde yatsın',
        ];
      case 'fa':
      default:
        return isSunni ? [
          '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ»',
          'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ',
          'سەرەخۆشی لە بنەماڵەی بەڕێزتان دەکەم',
          'خداوند به بازماندگان صبر و اجر عنایت فرماید',
          'تسلیت صمیمانه به خاندان معزا',
        ] : [
          '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ»',
          'عَظَّمَ اللَّهُ أُجُورَكُمْ',
          'روحشان با ائمه اطهار (ع) محشور باد',
          'تسلیت صمیمانه به بیت معزا',
          'خداوند رحمتشان کند',
        ];
    }
  };

  const chips = getCondolenceChips();

  const handleQuickSend = (textToSend?: string) => {
    const text = textToSend || commentText;
    if (!text.trim()) return;

    addCommentToAd(ad.id, {
      authorName: currentUser?.fullName || (language === 'ku' ? 'هاوشاری' : language === 'en' ? 'Visitor' : 'همشهری'),
      authorRelation: getTranslation('condolence', language),
      text: text.trim(),
      type: 'traditional',
      madhhab: activeMadhhabContext,
    });

    setCommentText('');
    setShowSuccessBadge(true);
    setTimeout(() => setShowSuccessBadge(false), 2500);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 hover:border-amber-600/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black flex flex-col justify-between group">
      <div>
        {/* ۱. بخش بالایی کارت: کد پیگیری و تاریخ فوت */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-stone-900 text-amber-400 px-2.5 py-0.5 rounded-lg border border-stone-800 font-bold">
              {ad.trackingCode}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              ad.deceased.madhhab === 'sunni'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                : 'bg-blue-950 text-blue-400 border border-blue-800/60'
            }`}>
              {getTranslation(ad.deceased.madhhab === 'sunni' ? 'sunniTitle' : 'shiaTitle', language)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-400">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>{getTranslation('dateOfDeath', language)} {ad.deceased.dateOfDeath}</span>
          </div>
        </div>

        {/* ۲. تصویر بزرگ و متناسب متوفی با سیستم قالب هوشمند */}
        <div 
          onClick={() => {
            setActiveAd(ad);
            setCurrentView('detail');
          }}
          className="relative aspect-square w-full bg-stone-950 overflow-hidden cursor-pointer group-hover:opacity-95 transition-opacity"
        >
          <FramedPhoto
            photoUrl={avatarImage}
            frameId={ad.selectedFrameId}
            templateConfig={ad.templateConfig}
            fullName={ad.deceased.fullName}
            titlePrefix={ad.deceased.titlePrefix}
            fatherName={ad.deceased.fatherName}
            showFooterName={true}
          />

          <div className="absolute top-3 right-3 bg-stone-950/90 text-amber-400 text-xs px-3 py-1 rounded-xl font-bold border border-amber-600/40 backdrop-blur-md flex items-center gap-1 shadow-lg z-20 pointer-events-none">
            <span>🖤</span>
            <span>{getTranslation('fatihaMeeting', language)}</span>
          </div>
        </div>

        {/* ۳. مشخصات متوفی در زیر تصویر */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-300">
            <p>
              {getTranslation('fatherName', language)} <strong className="text-stone-100">{ad.deceased.fatherName}</strong>
            </p>
            {ad.deceased.age && (
              <span className="text-stone-400 font-mono">
                {ad.deceased.age} {getTranslation('yearsOld', language)}
              </span>
            )}
          </div>

          {ad.deceased.familyMembersNote && (
            <p className="text-xs text-stone-400 line-clamp-1 bg-stone-950 p-2 rounded-xl border border-stone-850">
              {ad.deceased.familyMembersNote}
            </p>
          )}

          {/* آرامستان، مسجد و مجلس بانوان */}
          <div className="bg-stone-950/80 rounded-2xl p-3 border border-stone-800 text-xs space-y-2">
            {burial && (
              <div className="flex items-center gap-2 text-stone-300">
                <Megaphone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
                <span className="text-amber-400 font-medium">اعلان سراسری:</span>
                <span className="font-medium truncate text-stone-200">
                  خاکسپاری در {burial.cemeteryName || burial.locationName}
                </span>
              </div>
            )}

            {menCeremony && (
              <div className="space-y-1">
                {(menCeremony.ceremonyDurationSummary || (menCeremony.selectedDaysOfWeek && menCeremony.selectedDaysOfWeek.length > 0)) && (
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-800/50">
                    <Calendar className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span className="truncate">
                      {menCeremony.ceremonyDurationSummary || `${menCeremony.ceremonyDaysCount || menCeremony.selectedDaysOfWeek?.length} روز (${menCeremony.selectedDaysOfWeek?.join(' و ')})`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-stone-300">
                  <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span className="text-stone-400 truncate">{menCeremony.locationName}:</span>
                  <span className="font-medium truncate text-amber-300 font-mono text-[11px]">
                    {getMosqueSlotsSummary(menCeremony)}
                  </span>
                </div>
              </div>
            )}

            {womenCeremony && (
              <div className="flex items-center gap-2 text-stone-300">
                <Home className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span className="text-rose-400 font-medium">{womenCeremony.title || 'مجلس بانوان'}:</span>
                <span className="font-medium truncate text-stone-300">
                  منزل متوفی (بدون قید ساعت)
                </span>
              </div>
            )}
          </div>

          {/* دکمه‌های تسلیت قلبی و جزئیات */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleHeart(ad.id);
              }}
              className="flex items-center gap-2 text-xs text-stone-300 hover:text-white transition-colors bg-stone-950 hover:bg-stone-850 border border-stone-800 px-3.5 py-1.5 rounded-xl cursor-pointer"
            >
              <span className="text-base animate-pulse">🖤</span>
              <span className="font-mono font-bold text-amber-400">{ad.heartCount}</span>
              <span className="text-[11px] text-stone-400">{getTranslation('condolence', language)}</span>
            </button>

            <button
              onClick={() => {
                setActiveAd(ad);
                setCurrentView('detail');
              }}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-400 cursor-pointer transition-colors"
            >
              <span>{getTranslation('viewDetails', language)}</span>
              {isLtr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ۴. سیستم کامنت‌گذاری مستقیم در زیر هر پست */}
        <div className="p-4 pt-2 border-t border-stone-800/80 bg-stone-950/40 space-y-2.5">
          {/* چیپ‌های آماده برای تسلیت با ۱ کلیک */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSend(chip)}
                className="whitespace-nowrap bg-stone-900 hover:bg-amber-600/20 hover:border-amber-500/50 text-stone-300 hover:text-amber-200 border border-stone-800 px-2.5 py-1 rounded-full transition-all cursor-pointer text-[10px]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* تکست‌باکس ارسال سریع پیام تسلیت */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder={getTranslation('postCondolencePlaceholder', language)}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickSend()}
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => handleQuickSend()}
              disabled={!commentText.trim()}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
            >
              <Send className={`w-3.5 h-3.5 ${isLtr ? '' : 'rotate-180'}`} />
              <span className="hidden sm:inline">{getTranslation('send', language)}</span>
            </button>
          </div>

          {/* پیام ثبت موفق */}
          {showSuccessBadge && (
            <div className="bg-emerald-950/90 border border-emerald-800/70 text-emerald-300 text-[11px] p-2 rounded-xl flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{getTranslation('registeredSuccess', language)}</span>
            </div>
          )}

          {/* نمایش آخرین پیام‌های تسلیت ثبت‌شده */}
          {comments.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-amber-500" />
                  <span>{comments.length} {getTranslation('condolence', language)}</span>
                </span>

                {comments.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{showAllComments ? getTranslation('hideComments', language) : getTranslation('viewAllComments', language)}</span>
                    {showAllComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {/* لیست نظرات */}
              <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800 pr-1">
                {(showAllComments ? comments : comments.slice(0, 2)).map((c) => (
                  <div key={c.id} className="bg-stone-900/80 border border-stone-850 p-2 rounded-xl text-[11px]">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-stone-200">{c.authorName}</strong>
                      <span className="text-[10px] text-stone-500">{c.authorRelation}</span>
                    </div>
                    <p className="text-stone-300 leading-relaxed font-light">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
