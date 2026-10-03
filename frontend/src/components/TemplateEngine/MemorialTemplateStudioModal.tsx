import React, { useState, useRef } from 'react';
import { 
  MemorialTemplate, 
  MemorialTemplateConfig, 
  TemplatePhotoShape, 
  TemplateDecorationType, 
  MemorialAspectRatio 
} from '../../types';
import { MEMORIAL_TEMPLATES } from '../../data/memorialTemplates';
import { TemplateCanvasRenderer } from './TemplateCanvasRenderer';
import { 
  Palette, 
  Sliders, 
  Sparkles, 
  Type, 
  Download, 
  Share2, 
  Check, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  RotateCw, 
  SunMedium, 
  Contrast, 
  X, 
  Copy, 
  Eye, 
  Layers, 
  Smartphone, 
  Square, 
  FileText, 
  Printer,
  ChevronRight,
  Maximize2,
  Send
} from 'lucide-react';

interface MemorialTemplateStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhotoUrl?: string;
  initialFullName?: string;
  initialFatherName?: string;
  initialTitlePrefix?: string;
  initialConfig?: Partial<MemorialTemplateConfig>;
  onApplyConfig?: (config: MemorialTemplateConfig, photoUrl: string) => void;
}

export const MemorialTemplateStudioModal: React.FC<MemorialTemplateStudioModalProps> = ({
  isOpen,
  onClose,
  initialPhotoUrl = '/assets/app-logo.jpg',
  initialFullName = 'محمد احمدی',
  initialFatherName = 'عثمان',
  initialTitlePrefix = 'زنده‌یاد',
  initialConfig,
  onApplyConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'photo' | 'stickers' | 'typography' | 'export'>('templates');
  
  // قالب انتخابی
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialConfig?.templateId || 'classic-black'
  );

  // عکس متوفی
  const [photoUrl, setPhotoUrl] = useState<string>(initialPhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // مشخصات متنی
  const [fullName, setFullName] = useState(initialFullName);
  const [fatherName, setFatherName] = useState(initialFatherName);
  const [titlePrefix, setTitlePrefix] = useState(initialTitlePrefix);
  const [customQuote, setCustomQuote] = useState(initialConfig?.customQuote || '');

  // نسبت ابعاد خروجی (مربع، پست، استوری، چاپ A4)
  const [aspectRatio, setAspectRatio] = useState<MemorialAspectRatio>(
    initialConfig?.aspectRatio || 'square'
  );

  // تنظیمات ادیتور هوشمند عکس
  const [zoom, setZoom] = useState<number>(initialConfig?.zoom || 1);
  const [panX, setPanX] = useState<number>(initialConfig?.panX || 0);
  const [panY, setPanY] = useState<number>(initialConfig?.panY || 0);
  const [rotate, setRotate] = useState<number>(initialConfig?.rotate || 0);
  const [brightness, setBrightness] = useState<number>(initialConfig?.brightness || 100);
  const [contrast, setContrast] = useState<number>(initialConfig?.contrast || 100);
  const [grayscale, setGrayscale] = useState<boolean>(initialConfig?.grayscale ?? true);
  const [sepia, setSepia] = useState<boolean>(initialConfig?.sepia ?? false);
  const [blurBackground, setBlurBackground] = useState<boolean>(initialConfig?.blurBackground ?? true);
  const [photoShape, setPhotoShape] = useState<TemplatePhotoShape>(
    initialConfig?.photoShape || 'rounded-rect'
  );

  // فونت
  const [fontFamily, setFontFamily] = useState<'vazir' | 'nastaliq' | 'serif' | 'thuluth'>(
    initialConfig?.fontFamily || 'serif'
  );

  // استیکرها و نشان‌های معنوی فعال
  const [activeDecorations, setActiveDecorations] = useState<TemplateDecorationType[]>(
    initialConfig?.activeDecorations || ['bismillah', 'ribbon', 'dove']
  );

  // وضعیت دانلود و کپی
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const currentTemplate = MEMORIAL_TEMPLATES.find((t) => t.id === selectedTemplateId) || MEMORIAL_TEMPLATES[0];

  const fullConfig: MemorialTemplateConfig = {
    templateId: selectedTemplateId,
    zoom,
    panX,
    panY,
    rotate,
    brightness,
    contrast,
    grayscale,
    sepia,
    blurBackground,
    photoShape,
    activeDecorations,
    customQuote: customQuote || currentTemplate.defaultQuote,
    customPrefix: titlePrefix,
    fontFamily,
    aspectRatio,
  };

  // آپلود عکس متوفی از دستگاه
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // تاگل کردن استیکرها
  const toggleDecoration = (type: TemplateDecorationType) => {
    if (activeDecorations.includes(type)) {
      setActiveDecorations(activeDecorations.filter((d) => d !== type));
    } else {
      setActiveDecorations([...activeDecorations, type]);
    }
  };

  // اعمال تغییر قالب
  const handleSelectTemplate = (template: MemorialTemplate) => {
    setSelectedTemplateId(template.id);
    setPhotoShape(template.defaultShape);
    setActiveDecorations(template.defaultDecorations);
    if (!customQuote) {
      setCustomQuote(template.defaultQuote);
    }
  };

  // ذخیره و اعمال نهایی
  const handleApply = () => {
    if (onApplyConfig) {
      onApplyConfig(fullConfig, photoUrl);
    }
    onClose();
  };

  // ایجاد و دانلود تصویر با Canvas
  const handleDownloadPoster = () => {
    setIsExporting(true);

    try {
      // ایجاد ابعاد استاندارد بر اساس فرمت
      let width = 1080;
      let height = 1080;
      if (aspectRatio === 'story') {
        height = 1920;
      } else if (aspectRatio === 'portrait') {
        height = 1350;
      } else if (aspectRatio === 'a4') {
        width = 1240;
        height = 1754; // A4 150DPI
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // ۱. پس‌زمینه گرادینت
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (currentTemplate.category === 'nature') {
        bgGrad.addColorStop(0, '#0c1a14');
        bgGrad.addColorStop(0.5, '#064e3b');
        bgGrad.addColorStop(1, '#021a10');
      } else if (currentTemplate.category === 'religious') {
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(0.5, '#1e293b');
        bgGrad.addColorStop(1, '#090d16');
      } else if (currentTemplate.category === 'minimal') {
        bgGrad.addColorStop(0, '#1c1917');
        bgGrad.addColorStop(0.5, '#292524');
        bgGrad.addColorStop(1, '#1c1917');
      } else {
        bgGrad.addColorStop(0, '#0a0a0a');
        bgGrad.addColorStop(0.5, '#171717');
        bgGrad.addColorStop(1, '#050505');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ۲. حاشیه زرین
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.strokeRect(45, 45, width - 90, height - 90);

      // ۳. کتیبه بالایی
      ctx.textAlign = 'center';
      ctx.direction = 'rtl';

      if (activeDecorations.includes('bismillah')) {
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 36px Vazirmatn, Tahoma, sans-serif';
        ctx.fillText(currentTemplate.quranicHeader, width / 2, 120);
      }

      // ۴. بارگذاری و ترسیم عکس متوفی با برش گرد/بیضی
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = photoUrl;

      img.onload = () => {
        const photoSize = width * 0.48;
        const photoX = width / 2;
        const photoY = height * 0.44;

        ctx.save();
        ctx.beginPath();
        if (photoShape === 'circle') {
          ctx.arc(photoX, photoY, photoSize / 2, 0, Math.PI * 2);
        } else if (photoShape === 'arch') {
          ctx.arc(photoX, photoY - 40, photoSize / 2, Math.PI, 0);
          ctx.lineTo(photoX + photoSize / 2, photoY + photoSize / 2);
          ctx.lineTo(photoX - photoSize / 2, photoY + photoSize / 2);
          ctx.closePath();
        } else {
          // Rounded rect
          const rx = photoX - photoSize / 2;
          const ry = photoY - photoSize / 2;
          const r = 40;
          ctx.moveTo(rx + r, ry);
          ctx.lineTo(rx + photoSize - r, ry);
          ctx.quadraticCurveTo(rx + photoSize, ry, rx + photoSize, ry + r);
          ctx.lineTo(rx + photoSize, ry + photoSize - r);
          ctx.quadraticCurveTo(rx + photoSize, ry + photoSize, rx + photoSize - r, ry + photoSize);
          ctx.lineTo(rx + r, ry + photoSize);
          ctx.quadraticCurveTo(rx, ry + photoSize, rx, ry + photoSize - r);
          ctx.lineTo(rx, ry + r);
          ctx.quadraticCurveTo(rx, ry, rx + r, ry);
          ctx.closePath();
        }
        ctx.clip();

        // اعمال فیلتر سیاه‌وسفید در صورت فعال بودن
        if (grayscale) {
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%)`;
        } else {
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        }

        ctx.drawImage(
          img,
          photoX - (photoSize * zoom) / 2 + panX * 2,
          photoY - (photoSize * zoom) / 2 + panY * 2,
          photoSize * zoom,
          photoSize * zoom
        );
        ctx.restore();

        // حاشیه دور عکس
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 8;
        ctx.stroke();

        // ۵. متون و تایپوگرافی
        ctx.filter = 'none';

        // پیشوند
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 36px Vazirmatn, Tahoma';
        ctx.fillText(titlePrefix, width / 2, height * 0.72);

        // نام کامل
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 58px Vazirmatn, Tahoma';
        ctx.fillText(fullName, width / 2, height * 0.78);

        // نام پدر
        if (fatherName) {
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 32px Vazirmatn, Tahoma';
          ctx.fillText(`فرزند گرامی: ${fatherName}`, width / 2, height * 0.83);
        }

        // متن تسلیت
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '28px Vazirmatn, Tahoma';
        ctx.fillText(customQuote || currentTemplate.defaultQuote, width / 2, height * 0.89);

        // لوگوی رسمی امواتگرام
        ctx.fillStyle = '#78716c';
        ctx.font = '20px Vazirmatn, Tahoma';
        ctx.fillText('سامانه رسمی اطلاع‌رسانی ترحیم امـواتگـرام', width / 2, height - 55);

        // ایجاد لینک دانلود
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `amvatgram-memorial-${fullName.replace(/\s+/g, '-')}-${aspectRatio}.png`;
        link.href = dataUrl;
        link.click();

        setIsExporting(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      };

      img.onerror = () => {
        setIsExporting(false);
        alert('خطا در بارگذاری تصویر جهت ایجاد پوستر');
      };
    } catch (err) {
      console.error(err);
      setIsExporting(false);
    }
  };

  // اشتراک‌گذاری در شبکه‌های اجتماعی
  const handleShareToWhatsApp = () => {
    const text = `پوستر آگهی ترحیم ${titlePrefix} ${fullName}\nسامانه رسمی امواتگرام: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareToTelegram = () => {
    const text = `پوستر آگهی ترحیم ${titlePrefix} ${fullName}\nامواتگرام`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col my-auto max-h-[95vh] overflow-hidden">
        
        {/* هدر مدال استودیو */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-100 flex items-center gap-2">
                <span>استودیوی هوشمند قالب و پوستر ترحیم</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-sans">
                  Mini Canva
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                شخصی‌سازی تصویر، انتخاب از ۸ قالب فاخر و تولید پوستر در ۴ فرمت استاندارد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApply}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>اعمال و ذخیره</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-100 p-2 rounded-xl bg-stone-800 hover:bg-stone-750 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* بدنه استودیو در دو ستون: پیش‌نمایش زنده + جعبه‌ابزار */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* ستون چپ: پیش‌نمایش زنده و سوییچر ابعاد (Viewports) */}
          <div className="lg:col-span-6 bg-stone-950 p-4 sm:p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-l border-stone-800 space-y-4">
            
            {/* انتخاب نسبت ابعاد خروجی (مربع، عمودی، استوری، چاپ) */}
            <div className="w-full flex items-center justify-between gap-1.5 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800 overflow-x-auto">
              {[
                { id: 'square', label: 'مربع ۱:۱ (فید)', icon: Square },
                { id: 'portrait', label: 'عمودی ۴:۵ (پست)', icon: FileText },
                { id: 'story', label: 'استوری ۹:۱۶', icon: Smartphone },
                { id: 'a4', label: 'چاپ A4', icon: Printer },
              ].map((fmt) => {
                const IconComp = fmt.icon;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setAspectRatio(fmt.id as MemorialAspectRatio)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      aspectRatio === fmt.id
                        ? 'bg-amber-600 text-stone-950 shadow-md font-black'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{fmt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* بوم رندر زنده پوستر */}
            <div className="w-full flex items-center justify-center p-2 flex-1 min-h-[380px]">
              <TemplateCanvasRenderer
                template={currentTemplate}
                config={fullConfig}
                photoUrl={photoUrl}
                fullName={fullName}
                titlePrefix={titlePrefix}
                fatherName={fatherName}
                aspectRatio={aspectRatio}
              />
            </div>

            {/* نوار ابزار سریع دانلود و اشتراک‌گذاری */}
            <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-stone-850">
              <button
                type="button"
                onClick={handleDownloadPoster}
                disabled={isExporting}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/60 transition-all"
              >
                {isExporting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>در حال رندر و تولید فایل تصویری...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>
                      {downloadSuccess ? 'پوستر با موفقیت دانلود شد ✓' : 'دانلود پوستر با کیفیت بالا (PNG)'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareToWhatsApp}
                className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 p-2.5 rounded-xl text-xs flex items-center justify-center cursor-pointer transition-colors"
                title="اشتراک در واتس‌اپ"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleShareToTelegram}
                className="bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 p-2.5 rounded-xl text-xs flex items-center justify-center cursor-pointer transition-colors"
                title="اشتراک در تلگرام"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ستون راست: جعبه‌ابزار شخصی‌سازی و تنظیمات (Tabs) */}
          <div className="lg:col-span-6 bg-stone-900 flex flex-col">
            
            {/* سربرگ تب‌ها */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 p-2 bg-stone-950/80 border-b border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'templates'
                    ? 'bg-stone-850 text-amber-400 border border-stone-700 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>قالب‌ها</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'photo'
                    ? 'bg-stone-850 text-amber-400 border border-stone-700 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>تنظیم عکس</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stickers')}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'stickers'
                    ? 'bg-stone-850 text-amber-400 border border-stone-700 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>نشان‌ها</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('typography')}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'typography'
                    ? 'bg-stone-850 text-amber-400 border border-stone-700 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>متن و فونت</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('export')}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer col-span-4 sm:col-span-1 ${
                  activeTab === 'export'
                    ? 'bg-stone-850 text-amber-400 border border-stone-700 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>خروجی</span>
              </button>
            </div>

            {/* محتوای تب فعال */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[500px] space-y-4">
              
              {/* ۱. تب انتخاب قالب‌های ۸ گانه */}
              {activeTab === 'templates' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200">
                      انتخاب از بین ۸ قالب طراحی شده:
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono">
                      {currentTemplate.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {MEMORIAL_TEMPLATES.map((tmpl) => {
                      const isSelected = tmpl.id === selectedTemplateId;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tmpl)}
                          className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden ${
                            isSelected
                              ? 'bg-amber-950/50 border-amber-500 shadow-lg shadow-amber-950/60 ring-2 ring-amber-500/40'
                              : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{tmpl.emoji}</span>
                            <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded-full border border-stone-800">
                              {tmpl.badgeText}
                            </span>
                          </div>

                          <div>
                            <span className="text-xs font-black block text-stone-100">
                              {tmpl.name}
                            </span>
                            <span className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                              {tmpl.description}
                            </span>
                          </div>

                          {isSelected && (
                            <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ۲. تب تنظیم و هوشمندسازی عکس متوفی */}
              {activeTab === 'photo' && (
                <div className="space-y-4">
                  {/* دکمه آپلود تصویر جدید */}
                  <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                        <img src={photoUrl} alt="تصویر متوفی" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-200 block">تصویر فعلی متوفی</span>
                        <span className="text-[10px] text-stone-400">عکس معمولی یا پرسنلی</span>
                      </div>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>تغییر تصویر</span>
                    </button>
                  </div>

                  {/* شکل کادر عکس */}
                  <div>
                    <label className="text-xs text-stone-300 font-bold block mb-1.5">
                      شکل کادر تصویر متوفی:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'rounded-rect', label: 'مربع گوشه‌گرد' },
                        { id: 'circle', label: 'دایره کامل' },
                        { id: 'arch', label: 'طاق محرابی' },
                        { id: 'oval', label: 'بیضی شکیل' },
                      ].map((shape) => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => setPhotoShape(shape.id as TemplatePhotoShape)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            photoShape === shape.id
                              ? 'bg-amber-600 text-stone-950 border-amber-500 shadow-md font-black'
                              : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                          }`}
                        >
                          {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* کنترل زوم (Zoom) */}
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-300 font-medium flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                        <span>بزرگ‌نمایی عکس (Zoom)</span>
                      </span>
                      <span className="text-amber-400 font-mono text-[11px]">{zoom.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="2.2"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* کنترل جابه‌جایی چهره در مرکز (Pan X & Y) */}
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2">
                    <span className="text-xs text-stone-300 font-medium flex items-center gap-1">
                      <Move className="w-3.5 h-3.5 text-sky-400" />
                      <span>تنظیم موقعیت چهره در مرکز کادر:</span>
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] block mb-1">افقی (چپ / راست):</span>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          value={panX}
                          onChange={(e) => setPanX(parseInt(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block mb-1">عمودی (بالا / پایین):</span>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          value={panY}
                          onChange={(e) => setPanY(parseInt(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* تنظیم نور و کنتراست */}
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-stone-300 flex items-center gap-1 text-[11px] mb-1">
                          <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                          <span>روشنایی: {brightness}%</span>
                        </span>
                        <input
                          type="range"
                          min="60"
                          max="140"
                          value={brightness}
                          onChange={(e) => setBrightness(parseInt(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="text-stone-300 flex items-center gap-1 text-[11px] mb-1">
                          <Contrast className="w-3.5 h-3.5 text-amber-400" />
                          <span>کنتراست: {contrast}%</span>
                        </span>
                        <input
                          type="range"
                          min="60"
                          max="140"
                          value={contrast}
                          onChange={(e) => setContrast(parseInt(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* فیلترهای سیاه‌وسفید و سپیا */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGrayscale(true);
                        setSepia(false);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        grayscale && !sepia
                          ? 'bg-stone-800 text-amber-400 border-amber-500 font-black'
                          : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      🖤 سیاه‌وسفید ترحیم
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGrayscale(false);
                        setSepia(true);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        sepia
                          ? 'bg-amber-950 text-amber-300 border-amber-500 font-black'
                          : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      📜 سپیا (نوستالژیک)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGrayscale(false);
                        setSepia(false);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        !grayscale && !sepia
                          ? 'bg-stone-800 text-stone-100 border-stone-500 font-black'
                          : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      🎨 رنگی طبیعی
                    </button>
                  </div>
                </div>
              )}

              {/* ۳. تب استیکرها و المان‌های معنوی */}
              {activeTab === 'stickers' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-200 block">
                    انتخاب عناصر تزیینی و معنوی پوستر:
                  </span>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'dove', label: '🕊️ کبوتر سپید پرواز', desc: 'نماد صلح، پرواز معنوی و آرامش ابدی' },
                      { id: 'candle', label: '🕯️ شمع‌های روشن ترحیم', desc: 'روشنایی یاد و خاطر در دو سوی کادر' },
                      { id: 'rose', label: '🌹 گل رز سوگ و یادبود', desc: 'گل رز سیاه/سرخ در کنار کادر عکس' },
                      { id: 'ribbon', label: '🖤 روبان سیاه عزا', desc: 'روبان کلاسیک مشکی در گوشه بالا' },
                      { id: 'bismillah', label: '📜 کتیبه استرجاع قرآنی', desc: '«إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ»' },
                      { id: 'islamic_star', label: '⚜️ نشان هو الباقی', desc: 'کتیبه طلایی هو الباقی و اسلیمی' },
                    ].map((item) => {
                      const isSelected = activeDecorations.includes(item.id as TemplateDecorationType);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleDecoration(item.id as TemplateDecorationType)}
                          className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-500 text-stone-100 shadow-md ring-1 ring-amber-500/40'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-amber-300">{item.label}</span>
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              isSelected ? 'bg-amber-500 text-stone-950 font-bold' : 'border border-stone-700'
                            }`}>
                              {isSelected ? '✓' : ''}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ۴. تب تایپوگرافی و متون */}
              {activeTab === 'typography' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs text-stone-300 font-bold block mb-1">
                      پیشوند عنوان متوفی:
                    </label>
                    <input
                      type="text"
                      value={titlePrefix}
                      onChange={(e) => setTitlePrefix(e.target.value)}
                      placeholder="زنده‌یاد، مرحومه بانو، مرحوم مغفور..."
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-2.5 text-xs text-stone-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 font-bold block mb-1">
                      نام و نام خانوادگی متوفی:
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-2.5 text-xs text-stone-100 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 font-bold block mb-1">
                      نام پدر گرامی:
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="نام پدر"
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-2.5 text-xs text-stone-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 font-bold block mb-1">
                      متن یا بیت تسلیت و یادبود:
                    </label>
                    <textarea
                      rows={2}
                      value={customQuote}
                      onChange={(e) => setCustomQuote(e.target.value)}
                      placeholder="روحش شاد و یادش تا ابد گرامی باد..."
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-2.5 text-xs text-stone-100 outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-300 font-bold block mb-1">
                      فونت تایپوگرافی پوستر:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'serif', label: 'خط سنتی فاخر' },
                        { id: 'nastaliq', label: 'نستعلیق ایرانی' },
                        { id: 'vazir', label: 'وزیرمتن مدرن' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFontFamily(f.id as any)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            fontFamily === f.id
                              ? 'bg-amber-600 text-stone-950 border-amber-500 shadow-md font-black'
                              : 'bg-stone-950 text-stone-400 border-stone-800'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ۵. تب خروجی و اشتراک‌گذاری */}
              {activeTab === 'export' && (
                <div className="space-y-4">
                  <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
                    <span className="text-xs font-bold text-stone-200 block">
                      خروجی‌های آماده و بهینه‌سازی شده پوستر:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                        <span className="text-amber-400 font-bold block mb-0.5">📱 استوری اینستاگرام & وضعیت واتس‌اپ</span>
                        <span className="text-[11px] text-stone-400">ابعاد ۱۰۸۰ در ۱۹۲۰ با کیفیت HD</span>
                      </div>

                      <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                        <span className="text-sky-400 font-bold block mb-0.5">🔲 پست فید و کانال‌های تلگرام</span>
                        <span className="text-[11px] text-stone-400">ابعاد مربعی ۱۰۸۰ در ۱۰۸۰ بهینه موبایل</span>
                      </div>

                      <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                        <span className="text-emerald-400 font-bold block mb-0.5">📄 پوستر عمودی و چاپ مسجد</span>
                        <span className="text-[11px] text-stone-400">ابعاد استاندارد کاغذ A4 جهت چاپ فیزیکی</span>
                      </div>

                      <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                        <span className="text-purple-400 font-bold block mb-0.5">🌐 کارت الکترونیکی متوفی</span>
                        <span className="text-[11px] text-stone-400">ارسال با لینک مستقیم در پیام‌رسان‌ها</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadPoster}
                    disabled={isExporting}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/60"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود مستقیم پوستر با رزولوشن اصلی (PNG)</span>
                  </button>
                </div>
              )}

            </div>

            {/* فوتر اعمال نهایی */}
            <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between mt-auto">
              <span className="text-xs text-stone-400">
                قالب انتخابی: <strong className="text-amber-400">{currentTemplate.name}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs py-2 px-4 rounded-xl font-medium cursor-pointer transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs py-2 px-5 rounded-xl font-bold cursor-pointer transition-colors shadow-md"
                >
                  ذخیره و اعمال بر آگهی
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
