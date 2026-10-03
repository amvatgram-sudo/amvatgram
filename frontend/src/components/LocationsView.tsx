import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppProvider';
import { 
  Building2, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Plus, 
  Map as MapIcon, 
  Grid, 
  Navigation, 
  Compass, 
  Crosshair 
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';
import { CeremonyMapPickerModal } from './CeremonyMapPickerModal';
import { MosqueLocation } from '../types';

export const LocationsView: React.FC = () => {
  const { locations, activeMadhhabContext, language, addLocation } = useApp();
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const isSunni = activeMadhhabContext === 'sunni';

  const filteredLocations = locations.filter((loc) => {
    if (isSunni) {
      return loc.type === 'mosque' || loc.type === 'cemetery';
    }
    return true;
  });

  // راه‌اندازی نقشه تعاملی هنگام سوییچ به حالت 'map'
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultLat = filteredLocations[0]?.lat || 35.5269;
    const defaultLng = filteredLocations[0]?.lng || 46.1764;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topleft' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // افزودن نشانگر برای تک تک مساجد و آرامستان‌ها
    filteredLocations.forEach((loc) => {
      const isMosque = loc.type === 'mosque';
      const isCem = loc.type === 'cemetery';
      const color = isCem ? '#f43f5e' : isMosque ? '#10b981' : '#0ea5e9';

      const customIcon = L.divIcon({
        className: 'location-map-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${color};
            border: 2px solid #ffffff;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background: #0c0a09;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const popupHtml = `
        <div style="direction: rtl; text-align: right; font-family: inherit; font-size: 11px; min-width: 160px;">
          <h4 style="font-weight: 800; font-size: 12px; margin: 0 0 4px 0; color: #1c1917;">${loc.name}</h4>
          <p style="margin: 0 0 6px 0; color: #57534e; font-size: 10px;">${loc.address}</p>
          ${loc.khademPhone ? `<p style="margin: 0 0 8px 0; color: #059669; font-size: 10px; font-weight: bold;">تلفن هماهنگی: ${loc.khademPhone}</p>` : ''}
          <div style="display: flex; gap: 4px; border-top: 1px solid #e7e5e4; padding-top: 6px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" style="background: #eab308; color: #000; padding: 3px 8px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 10px;">مسیریابی Google</a>
            <a href="https://waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes" target="_blank" style="background: #38bdf8; color: #000; padding: 3px 8px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 10px;">Waze</a>
          </div>
        </div>
      `;

      L.marker([loc.lat, loc.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupHtml);
    });

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [viewMode, filteredLocations]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* سربرگ معرفی و اکشن‌های ثبت موقعیت جدید و تغییر نما */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="text-center md:text-right">
          <h2 className="text-xl sm:text-2xl font-black text-stone-100 flex items-center justify-center md:justify-start gap-2">
            <Building2 className={`w-6 h-6 ${isSunni ? 'text-emerald-500' : 'text-blue-500'}`} />
            <span>{getTranslation('locations', language)}</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {language === 'ku' 
              ? 'لیستی مزگەوت و گۆڕستانە فەرمییەکان بۆ بەڕێوەبردنی مەراسیمی سەرەخۆشی و پرسە'
              : language === 'en'
              ? 'Directory of approved mosques, religious centers, and cemeteries'
              : language === 'tr'
              ? 'Taziye merasimleri ve defin için onaylı cami ve mezarlıklar listesi'
              : isSunni 
              ? 'فهرست مساجد شرعی و آرامستان‌های مورد تأیید در سراسر شهرها همراه با نقشه دقیق GPS' 
              : 'فهرست مراکز مذهبی، حسینیه‌ها و مساجد جهت برگزاری مراسمات'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-center md:justify-end">
          {/* سوییچ نما بین کارت‌ها و نقشه */}
          <div className="bg-stone-950 p-1 rounded-xl border border-stone-800 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards' 
                  ? 'bg-amber-500 text-stone-950 shadow' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>فهرست کارتی</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'map' 
                  ? 'bg-amber-500 text-stone-950 shadow' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>نقشه تعاملی اماکن و مساجد</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ثبت مسجد / آرامستان جدید با GPS</span>
          </button>
        </div>
      </div>

      {/* نمایش نقشه تعاملی */}
      {viewMode === 'map' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs px-2">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>مساجد و نیایشگاه‌های ثبت‌شده ({filteredLocations.filter(l => l.type === 'mosque').length})</span>
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>آرامستان‌ها ({filteredLocations.filter(l => l.type === 'cemetery').length})</span>
              </span>
            </div>
            <span className="text-stone-400 text-[10px]">
              روی هر نشانگر کلیک کنید تا اطلاعات و لینک‌های مسیریابی سریع Waze و Google نمایش داده شود
            </span>
          </div>

          <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-stone-700 shadow-inner bg-stone-950">
            <div ref={mapContainerRef} className="w-full h-full z-10" />
          </div>
        </div>
      )}

      {/* نمایش کارت‌های اماکن */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="bg-stone-900 border border-stone-800 hover:border-amber-600/40 rounded-2xl p-5 flex flex-col justify-between transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    loc.type === 'cemetery'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : loc.type === 'hussainiya'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {loc.type === 'cemetery' 
                      ? (language === 'ku' ? 'گۆڕستان' : language === 'en' ? 'Cemetery' : language === 'tr' ? 'Mezarlık' : 'آرامستان') 
                      : loc.type === 'hussainiya' 
                      ? (language === 'ku' ? 'حوسێنییە' : language === 'en' ? 'Hussainiya' : 'حسینیه') 
                      : (language === 'ku' ? 'مزگەوت' : language === 'en' ? 'Mosque' : language === 'tr' ? 'Cami' : 'مسجد')}
                  </span>
                  <span className="text-[11px] text-stone-500">{loc.neighborhood}</span>
                </div>

                <h3 className="text-sm font-bold text-stone-100 mb-1">{loc.name}</h3>
                <p className="text-xs text-stone-400 mb-3 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-500 flex-shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </p>

                {loc.khademPhone && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-4 bg-stone-950 p-2 rounded-lg">
                    <Phone className="w-3 h-3 text-emerald-500" />
                    <span className="text-stone-500">
                      {language === 'ku' ? 'پەیوەندی/خادم:' : language === 'en' ? 'Contact:' : language === 'tr' ? 'İletişim:' : 'هماهنگی/خادم:'}
                    </span>
                    <span className="font-mono text-stone-200" dir="ltr">{loc.khademPhone}</span>
                  </div>
                )}
              </div>

              {/* دکمه‌های مسیریابی هوشمند چهارگانه */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-500">
                  {language === 'ku' ? 'مسیریابی:' : language === 'en' ? 'Navigation:' : 'مسیریابی هوشمند:'}
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 transition-colors"
                    title="Google Maps"
                  >
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                    <span>گوگل</span>
                  </a>

                  <a
                    href={`https://waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 transition-colors"
                    title="Waze Navigation"
                  >
                    <Navigation className="w-3 h-3 text-cyan-400" />
                    <span>Waze</span>
                  </a>

                  <a
                    href={`https://neshan.org/maps/@${loc.lat},${loc.lng},16z`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 transition-colors"
                    title="نشان"
                  >
                    <Compass className="w-3 h-3 text-blue-400" />
                    <span>نشان</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* مدال ثبت مسجد / آرامستان جدید با نقشه و Geolocation */}
      {isAddModalOpen && (
        <CeremonyMapPickerModal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          onLocationPinned={(locData) => {
            const newLoc: MosqueLocation = {
              id: `loc-${Date.now()}`,
              name: locData.name,
              city: locData.city || 'تهران',
              neighborhood: locData.neighborhood || 'مرکزی',
              address: locData.address,
              lat: locData.lat,
              lng: locData.lng,
              khademPhone: locData.khademPhone,
              type: locData.type,
            };
            addLocation(newLoc);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
