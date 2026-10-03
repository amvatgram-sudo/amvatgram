import React from 'react';
import { PosterFrame, MEMORIAL_FRAMES } from '../data/memorialFrames';
import { MEMORIAL_TEMPLATES } from '../data/memorialTemplates';
import { MemorialTemplateConfig, MemorialAspectRatio } from '../types';
import { TemplateCanvasRenderer } from './TemplateEngine/TemplateCanvasRenderer';
import { Sparkles, Crown, Flame, Bird, Flower2 } from 'lucide-react';

interface FramedPhotoProps {
  photoUrl: string;
  frameId?: string;
  templateConfig?: MemorialTemplateConfig;
  fullName?: string;
  titlePrefix?: string;
  fatherName?: string;
  showFooterName?: boolean;
  aspectRatio?: MemorialAspectRatio;
  className?: string;
}

export const FramedPhoto: React.FC<FramedPhotoProps> = ({
  photoUrl,
  frameId = 'frame-free-classic',
  templateConfig,
  fullName,
  titlePrefix,
  fatherName,
  showFooterName = true,
  aspectRatio = 'square',
  className = '',
}) => {
  // اگر آگهی دارای تنظیمات قالب تمپلیت انجین (Mini Canva) باشد، از رندرر هوشمند قالب استفاده می‌شود
  if (templateConfig) {
    const template = MEMORIAL_TEMPLATES.find((t) => t.id === templateConfig.templateId) || MEMORIAL_TEMPLATES[0];
    return (
      <TemplateCanvasRenderer
        template={template}
        config={templateConfig}
        photoUrl={photoUrl}
        fullName={fullName || ''}
        titlePrefix={titlePrefix}
        fatherName={fatherName}
        aspectRatio={aspectRatio}
        className={className}
      />
    );
  }

  // بررسی تطابق با قالب‌های ۸ گانه تمپلیت انجین
  const matchedTemplate = MEMORIAL_TEMPLATES.find((t) => t.id === frameId);
  if (matchedTemplate) {
    const defaultCfg: MemorialTemplateConfig = {
      templateId: matchedTemplate.id,
      zoom: 1,
      panX: 0,
      panY: 0,
      rotate: 0,
      brightness: 100,
      contrast: 100,
      grayscale: true,
      sepia: false,
      blurBackground: true,
      photoShape: matchedTemplate.defaultShape,
      activeDecorations: matchedTemplate.defaultDecorations,
      customQuote: matchedTemplate.defaultQuote,
      customPrefix: titlePrefix,
      fontFamily: 'serif',
      aspectRatio,
    };

    return (
      <TemplateCanvasRenderer
        template={matchedTemplate}
        config={defaultCfg}
        photoUrl={photoUrl}
        fullName={fullName || ''}
        titlePrefix={titlePrefix}
        fatherName={fatherName}
        aspectRatio={aspectRatio}
        className={className}
      />
    );
  }

  // در غیر این صورت، حالت کلاسیک فریم‌ها
  const frame = MEMORIAL_FRAMES.find((f) => f.id === frameId) || MEMORIAL_FRAMES[0];

  return (
    <div className={`relative aspect-square w-full bg-stone-950 overflow-hidden rounded-2xl group ${frame.borderStyle} ${className}`}>
      {/* ۱. عکس اصلی متوفی */}
      <img
        src={photoUrl || '/assets/app-logo.jpg'}
        alt={fullName || 'متوفی'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* ۲. پوشش گرادینت هنری و سایه قالب */}
      <div className={`absolute inset-0 bg-gradient-to-t ${frame.overlayGradient} pointer-events-none`}></div>

      {/* ۳. نماد گوشه‌ای بر اساس قالب انتخاب شده */}
      {frame.cornerOrnament === 'ribbon_black' && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="bg-black text-amber-400 text-[9px] font-bold py-1 w-28 text-center -rotate-45 -translate-x-7 translate-y-3 shadow-lg border-y border-stone-700">
            عـزا
          </div>
        </div>
      )}

      {frame.cornerOrnament === 'islamic_gold' && (
        <div className="absolute top-2 right-2 bg-stone-950/90 text-amber-300 border border-amber-500/60 p-1.5 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1 text-[10px] font-serif">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>هو الباقی</span>
        </div>
      )}

      {frame.cornerOrnament === 'candleglow' && (
        <div className="absolute top-2 right-2 bg-stone-950/90 text-amber-400 border border-amber-600/50 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>یاد جاودان</span>
        </div>
      )}

      {frame.cornerOrnament === 'flower_lily' && (
        <div className="absolute top-2 right-2 bg-stone-950/90 text-rose-300 border border-rose-500/50 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold">
          <Flower2 className="w-3.5 h-3.5 text-rose-400" />
          <span>مادر مهربان</span>
        </div>
      )}

      {frame.cornerOrnament === 'dove_peace' && (
        <div className="absolute top-2 right-2 bg-stone-950/90 text-sky-300 border border-sky-500/50 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold">
          <Bird className="w-3.5 h-3.5 text-sky-400" />
          <span>پرواز ابدی</span>
        </div>
      )}

      {/* ۴. نشان رتبه تجاری قالب در صورت VIP بودن */}
      {frame.tier === 'luxury' && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-600 to-amber-400 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded-md shadow-md flex items-center gap-0.5">
          <Crown className="w-3 h-3" />
          <span>VIP</span>
        </div>
      )}

      {/* ۵. زیرنویس و شعار عزا در بالای متن */}
      <div className="absolute bottom-11 right-3 left-3 pointer-events-none">
        <span className="text-[10px] text-amber-400/90 font-serif drop-shadow block truncate">
          {frame.bannerSubtitle}
        </span>
      </div>

      {/* ۶. نام و عنوان در انتهای تصویر */}
      {showFooterName && fullName && (
        <div className="absolute bottom-2.5 right-3 left-3 pointer-events-none">
          {titlePrefix && (
            <span className="text-amber-400 text-[11px] font-serif block -mb-0.5 drop-shadow">
              {titlePrefix}
            </span>
          )}
          <h3 className="text-base sm:text-lg font-black text-white drop-shadow-md truncate">
            {fullName}
          </h3>
        </div>
      )}
    </div>
  );
};
