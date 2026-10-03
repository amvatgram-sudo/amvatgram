import React from 'react';
import { MemorialTemplate, MemorialTemplateConfig, MemorialAspectRatio } from '../../types';
import { MEMORIAL_TEMPLATES } from '../../data/memorialTemplates';
import { Bird, Flame, Flower2, Sparkles, BookOpen } from 'lucide-react';

interface TemplateCanvasRendererProps {
  template: MemorialTemplate;
  config: MemorialTemplateConfig;
  photoUrl: string;
  fullName: string;
  titlePrefix?: string;
  fatherName?: string;
  aspectRatio: MemorialAspectRatio;
  interactive?: boolean;
  className?: string;
}

export const TemplateCanvasRenderer: React.FC<TemplateCanvasRendererProps> = ({
  template,
  config,
  photoUrl,
  fullName,
  titlePrefix = 'زنده‌یاد',
  fatherName,
  aspectRatio,
  interactive = false,
  className = '',
}) => {
  // نسبت ابعاد
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'story':
        return 'aspect-[9/16] max-w-[360px]';
      case 'portrait':
        return 'aspect-[4/5] max-w-[400px]';
      case 'a4':
        return 'aspect-[1/1.414] max-w-[380px]';
      case 'square':
      default:
        return 'aspect-square max-w-[440px]';
    }
  };

  // شکل کادر عکس متوفی
  const getPhotoShapeClass = () => {
    switch (config.photoShape) {
      case 'circle':
        return 'rounded-full aspect-square';
      case 'oval':
        return 'rounded-[50%/60%] aspect-[3/4]';
      case 'arch':
        return 'rounded-t-full rounded-b-2xl aspect-[3/4]';
      case 'rounded-rect':
      default:
        return 'rounded-3xl aspect-[4/5]';
    }
  };

  // اعمال فیلترهای روشنایی، کنتراست، سیاه‌وسفید و سپیا
  const imageFilterStyle: React.CSSProperties = {
    filter: `
      brightness(${config.brightness}%) 
      contrast(${config.contrast}%) 
      ${config.grayscale ? 'grayscale(100%)' : ''} 
      ${config.sepia ? 'sepia(70%)' : ''}
    `.trim(),
    transform: `
      scale(${config.zoom}) 
      translate(${config.panX}px, ${config.panY}px) 
      rotate(${config.rotate}deg)
    `,
    transformOrigin: 'center center',
  };

  // فونت انتخابی
  const getFontFamilyClass = () => {
    switch (config.fontFamily) {
      case 'nastaliq':
        return 'font-serif italic';
      case 'thuluth':
        return 'font-serif tracking-wider';
      case 'serif':
        return 'font-serif';
      case 'vazir':
      default:
        return 'font-sans';
    }
  };

  const hasDecoration = (type: string) => config.activeDecorations?.includes(type as any);

  return (
    <div
      className={`relative w-full mx-auto overflow-hidden bg-gradient-to-b ${template.bgGradient} ${template.borderStyle} ${getAspectClass()} ${className} shadow-2xl flex flex-col justify-between p-4 sm:p-6 transition-all select-none`}
    >
      {/* بافت پس‌زمینه */}
      <div className={`absolute inset-0 opacity-15 pointer-events-none ${template.bgTextureClass}`}></div>

      {/* حاشیه ظریف داخلی */}
      <div className="absolute inset-2 sm:inset-3 border border-stone-600/30 rounded-2xl pointer-events-none"></div>

      {/* ۱. کتیبه بالایی و روبان عزا */}
      <div className="relative z-10 text-center space-y-1 pt-1">
        {/* روبان سیاه عزا در گوشه تصویر */}
        {hasDecoration('ribbon') && (
          <div className="absolute -top-4 -right-4 w-20 h-20 overflow-hidden pointer-events-none z-30">
            <div className="bg-black text-amber-400 text-[9px] font-bold py-1 w-28 text-center -rotate-45 -translate-x-7 translate-y-4 shadow-xl border-y border-stone-800">
              عـزا
            </div>
          </div>
        )}

        {/* کتیبه هو الباقی یا آیه شریفه */}
        {hasDecoration('bismillah') && (
          <div className="inline-block bg-stone-950/70 border border-amber-600/40 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
            <span className="text-[11px] sm:text-xs font-serif text-amber-300 font-bold tracking-wide">
              {template.quranicHeader}
            </span>
          </div>
        )}

        {hasDecoration('islamic_star') && (
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-serif pt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>هـُـوَ الْبـَـاقـِـی</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* ۲. قاب و عکس اصلی متوفی با تنظیمات Zoom, Pan و فیلتر */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-3 sm:my-4">
        {/* کبوتر معنوی پرواز در بالای عکس */}
        {hasDecoration('dove') && (
          <div className="absolute -top-3 left-6 sm:left-10 text-stone-200/90 drop-shadow-lg pointer-events-none z-20 flex items-center gap-1">
            <Bird className="w-6 h-6 animate-pulse text-stone-100" />
            <span className="text-[10px] font-serif text-stone-300">پرواز ابدی</span>
          </div>
        )}

        {/* شمع‌های فروزان در طرفین */}
        {hasDecoration('candle') && (
          <>
            <div className="absolute left-2 sm:left-4 bottom-6 text-amber-400 drop-shadow-lg pointer-events-none z-20 flex flex-col items-center">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <div className="w-1.5 h-6 bg-stone-200 rounded-sm shadow-inner"></div>
            </div>
            <div className="absolute right-2 sm:right-4 bottom-6 text-amber-400 drop-shadow-lg pointer-events-none z-20 flex flex-col items-center">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <div className="w-1.5 h-6 bg-stone-200 rounded-sm shadow-inner"></div>
            </div>
          </>
        )}

        {/* گل رز ترحیم در گوشه کادر عکس */}
        {hasDecoration('rose') && (
          <div className="absolute -bottom-2 -left-1 text-rose-500 drop-shadow-xl pointer-events-none z-20 flex items-center">
            <Flower2 className="w-7 h-7 text-rose-600 fill-rose-950" />
          </div>
        )}

        {/* کادر عکس اصلی */}
        <div
          className={`relative overflow-hidden w-44 sm:w-56 border-4 border-amber-600/60 shadow-2xl bg-stone-950 ${getPhotoShapeClass()} ring-2 ring-amber-500/30 group`}
        >
          {config.blurBackground && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-md opacity-40 scale-125"
              style={{ backgroundImage: `url(${photoUrl || '/assets/app-logo.jpg'})` }}
            ></div>
          )}

          <img
            src={photoUrl || '/assets/app-logo.jpg'}
            alt={fullName}
            style={imageFilterStyle}
            className="w-full h-full object-cover transition-all duration-200 relative z-10"
          />

          {/* افکت محو سایه نرم لبه‌های عکس */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none z-10"></div>
        </div>
      </div>

      {/* ۳. بخش نام، پدر و متن ترحیم */}
      <div className={`relative z-10 text-center space-y-1.5 pb-2 ${getFontFamilyClass()}`}>
        {/* پیشوند احترامی (زنده‌یاد، مرحومه بانو...) */}
        <span className="text-amber-400 text-xs sm:text-sm font-bold block drop-shadow">
          {config.customPrefix || titlePrefix}
        </span>

        {/* نام و نام خانوادگی */}
        <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-lg tracking-tight">
          {fullName || 'نام متوفی'}
        </h2>

        {/* نام پدر */}
        {fatherName && (
          <p className="text-stone-300 text-xs sm:text-sm font-medium drop-shadow">
            فرزند گرامی: <strong className="text-amber-200 font-bold">{fatherName}</strong>
          </p>
        )}

        {/* پیام و بیت تسلیت */}
        <div className="pt-1.5 border-t border-stone-800/80 max-w-xs mx-auto">
          <p className={`text-xs ${template.quoteColor} font-serif leading-relaxed line-clamp-2`}>
            {config.customQuote || template.defaultQuote}
          </p>
        </div>

        {/* نماد اصالت امواتگرام */}
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-stone-500 pt-1">
          <span>امـواتگـرام</span>
          <span>•</span>
          <span>سامانه رسمی ترحیم</span>
        </div>
      </div>
    </div>
  );
};
