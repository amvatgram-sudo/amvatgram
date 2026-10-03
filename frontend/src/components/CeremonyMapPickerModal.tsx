import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  Check, 
  X, 
  Search, 
  ExternalLink, 
  Building2, 
  Compass, 
  Share2, 
  AlertCircle,
  Copy,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { MosqueLocation } from '../types';
import { useApp } from '../context/AppProvider';

interface CeremonyMapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
  initialTitle?: string;
  initialAddress?: string;
  initialCity?: string;
  initialType?: 'mosque' | 'cemetery' | 'hall' | 'hussainiya';
  onLocationPinned: (locationData: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    type: 'mosque' | 'cemetery' | 'hall' | 'hussainiya';
    khademPhone?: string;
    city?: string;
    neighborhood?: string;
  }) => void;
}

// مختصات پیش‌فرض
const DEFAULT_CENTER = { lat: 35.6892, lng: 51.3890 };

const QUICK_PRESETS = [
  {
    name: 'مسجد جامع مرکزی دارالاحسان',
    type: 'mosque' as const,
    lat: 35.6892,
    lng: 51.3890,
    city: 'تهران',
    neighborhood: 'مرکز شهر',
    address: 'خیابان انقلاب، جنب میدان امام، مجتمع عبادی دارالاحسان',
  },
  {
    name: 'آرامستان بین‌المللی بهشت زهرا (س)',
    type: 'cemetery' as const,
    lat: 35.5340,
    lng: 51.3720,
    city: 'تهران',
    neighborhood: 'بزرگراه خلیج فارس',
    address: 'کیلومتر ۶ بزرگراه تهران-قم، آرامستان بهشت زهرا',
  },
  {
    name: 'مسجد سلیمانیه (Süleymaniye Mosque)',
    type: 'mosque' as const,
    lat: 41.0162,
    lng: 28.9639,
    city: 'استانبول',
    neighborhood: 'Fatih',
    address: 'Süleymaniye Mah, Prof. Sıddık Sami Onar Cd. No:1, İstanbul',
  },
  {
    name: 'مزگەوتی جەلیل خەیات (Jalil Khayat Mosque)',
    type: 'mosque' as const,
    lat: 36.1911,
    lng: 44.0092,
    city: 'اربیل',
    neighborhood: 'بلوار 60 متری',
    address: 'شەقامی شەست مەتری، نزیک پارکی منارە، هەولێر',
  },
  {
    name: 'جامع الفاروق عمر بن الخطاب (Dubai)',
    type: 'mosque' as const,
    lat: 25.1852,
    lng: 55.2415,
    city: 'دبی',
    neighborhood: 'Al Safa 1',
    address: 'Al Safa 1, Jumeirah, Dubai, United Arab Emirates',
  },
  {
    name: 'مرکز اسلامی و مسجد ریجنتز پارک (London)',
    type: 'mosque' as const,
    lat: 51.5284,
    lng: -0.1666,
    city: 'لندن',
    neighborhood: "Regent's Park",
    address: '146 Park Rd, London NW8 7RG, United Kingdom',
  },
];

export const CeremonyMapPickerModal: React.FC<CeremonyMapPickerModalProps> = ({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  initialTitle = '',
  initialAddress = '',
  initialCity = 'تهران',
  initialType = 'mosque',
  onLocationPinned,
}) => {
  const { addLocation } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [pinCoords, setPinCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat || DEFAULT_CENTER.lat,
    lng: initialLng || DEFAULT_CENTER.lng,
  });

  const [locationName, setLocationName] = useState(initialTitle);
  const [city, setCity] = useState(initialCity);
  const [neighborhood, setNeighborhood] = useState('مرکز شهر');
  const [address, setAddress] = useState(initialAddress);
  const [locationType, setLocationType] = useState<'mosque' | 'cemetery' | 'hall' | 'hussainiya'>(initialType);
  const [khademPhone, setKhademPhone] = useState('');
  const [saveToGlobalDirectory, setSaveToGlobalDirectory] = useState(true);

  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // استخراج خودکار آدرس متنی از موقعیت مکانی (Reverse Geocoding)
  const fetchAddressForCoords = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa,en`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
          const foundCity = data.address?.city || data.address?.town || data.address?.county || data.address?.state || '';
          if (foundCity) setCity(foundCity);
          const foundNeigh = data.address?.suburb || data.address?.neighbourhood || data.address?.quarter || '';
          if (foundNeigh) setNeighborhood(foundNeigh);
        }
      }
    } catch {
      // ادامه با آدرس پیشین در صورت قطعی اینترنت
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // راه‌اندازی و بروزرسانی نقشه Leaflet
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // پاک‌سازی نمونه قبلی در صورت وجود
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const startLat = initialLat || pinCoords.lat;
    const startLng = initialLng || pinCoords.lng;

    // آیکون سفارشی پین نقشه
    const pinIcon = L.divIcon({
      className: 'custom-pin-marker',
      html: `
        <div style="
          width: 38px;
          height: 38px;
          background: #eab308;
          border: 3px solid #0c0a09;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 8px 18px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 14px;
            height: 14px;
            background: #0c0a09;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });

    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: 15,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topleft' }).addTo(map);

    // لایه نقشه OSM با استایل تمیز و خوانا
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // افزودن نشانگر با امکان درگ
    const marker = L.marker([startLat, startLng], {
      icon: pinIcon,
      draggable: true,
    }).addTo(map);

    marker.bindPopup(`<b>${locationName || 'محل مراسم'}</b><br/>برای تنظیم دقیق می‌توانید پین را بکشید`).openPopup();

    marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      const newLat = Number(position.lat.toFixed(6));
      const newLng = Number(position.lng.toFixed(6));
      setPinCoords({ lat: newLat, lng: newLng });
      fetchAddressForCoords(newLat, newLng);
    });

    // کلیک روی نقشه برای جابجایی پین
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const newLat = Number(lat.toFixed(6));
      const newLng = Number(lng.toFixed(6));
      marker.setLatLng([newLat, newLng]);
      setPinCoords({ lat: newLat, lng: newLng });
      fetchAddressForCoords(newLat, newLng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // رفع مشکل سایز نقشه بعد از لود مودال
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // مکان‌یابی زنده کاربر با GPS
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('مرورگر شما از قابلیت موقعیت‌یابی جغرافیایی (Geolocation) پشتیبانی نمی‌کند.');
      return;
    }

    setIsLocatingUser(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const newCoords = {
          lat: Number(latitude.toFixed(6)),
          lng: Number(longitude.toFixed(6)),
        };
        setPinCoords(newCoords);
        fetchAddressForCoords(newCoords.lat, newCoords.lng);

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([newCoords.lat, newCoords.lng], 16, { animate: true, duration: 1 });
          markerRef.current.setLatLng([newCoords.lat, newCoords.lng]);
          markerRef.current
            .bindPopup(`<b>موقعیت دقیق GPS شما</b><br/>دقت مکانی: ±${Math.round(accuracy)} متر`)
            .openPopup();
        }
      },
      (err) => {
        setIsLocatingUser(false);
        if (err.code === 1) {
          setGeoError('دسترسی به موقعیت مکانی (GPS) توسط شما مسدود شده است. لطفاً اجازه دسترسی را در مرورگر فعال کنید.');
        } else {
          setGeoError('خطا در دریافت مختصات ماهواره‌ای GPS. لطفاً مجدداً امتحان کنید یا مکان را به صورت دستی روی نقشه انتخاب نمایید.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // انتخاب پیش‌فرض‌های سریع
  const handleSelectPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setLocationName(preset.name);
    setAddress(preset.address);
    setLocationType(preset.type);
    setCity(preset.city || 'تهران');
    setNeighborhood(preset.neighborhood || 'مرکز شهر');
    setPinCoords({ lat: preset.lat, lng: preset.lng });

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], 16, { animate: true, duration: 0.8 });
      markerRef.current.setLatLng([preset.lat, preset.lng]);
      markerRef.current.bindPopup(`<b>${preset.name}</b><br/>${preset.address}`).openPopup();
    }
  };

  // ذخیره نهایی موقعیت و ثبت در مراسم
  const handleConfirmLocation = () => {
    const finalName = locationName.trim() || 'محل برگزاری مراسم';
    const finalAddress = address.trim() || `مختصات: ${pinCoords.lat}, ${pinCoords.lng}`;

    onLocationPinned({
      name: finalName,
      address: finalAddress,
      lat: pinCoords.lat,
      lng: pinCoords.lng,
      type: locationType,
      khademPhone: khademPhone.trim() || undefined,
      city: city.trim() || 'تهران',
      neighborhood: neighborhood.trim() || 'مرکز شهر',
    });

    if (saveToGlobalDirectory) {
      const newLoc: MosqueLocation = {
        id: `loc-${Date.now()}`,
        name: finalName,
        city: city.trim() || 'تهران',
        neighborhood: neighborhood.trim() || 'مرکز شهر',
        address: finalAddress,
        lat: pinCoords.lat,
        lng: pinCoords.lng,
        khademPhone: khademPhone.trim() || undefined,
        type: locationType,
      };
      addLocation(newLoc);
    }

    onClose();
  };

  const copyShareLink = () => {
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${pinCoords.lat},${pinCoords.lng}`;
    navigator.clipboard.writeText(navUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-stone-100 text-xs"
      >
        {/* سربرگ مودال نقشه */}
        <div className="p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/70 border border-amber-800 flex items-center justify-center text-amber-400 shadow-lg">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-stone-100">
                  ثبت و پین دقیق موقعیت مسجد یا محل مراسم روی نقشه
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  GPS & Geolocation
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                موقعیت جغرافیایی محل خاکسپاری یا فاتحه‌خوانی را با GPS یا پین روی نقشه تعیین کنید تا عزاداران به راحتی مسیریابی کنند.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوای نقشه و فرم */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-stone-800">
          
          {/* ستون راست (۷ ستون): نقشه تعاملی و ابزارهای GPS */}
          <div className="lg:col-span-7 flex flex-col p-4 space-y-3">
            {/* نوار ابزار بالای نقشه: دکمه GPS و فیلتر سریع */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocatingUser}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer active:scale-95"
              >
                <Crosshair className={`w-4 h-4 ${isLocatingUser ? 'animate-spin' : ''}`} />
                <span>{isLocatingUser ? 'در حال دریافت مختصات GPS...' : 'مکان‌یابی فعلی من (GPS)'}</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-stone-400">
                <span>مختصات پین:</span>
                <span className="font-mono text-amber-300 font-bold bg-stone-950 px-2 py-1 rounded-lg border border-stone-800" dir="ltr">
                  {pinCoords.lat}, {pinCoords.lng}
                </span>
              </div>
            </div>

            {geoError && (
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-900/60 text-rose-300 text-[11px] flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{geoError}</span>
              </div>
            )}

            {/* کانتینر نقشه Leaflet */}
            <div className="relative w-full h-72 sm:h-84 rounded-2xl overflow-hidden border border-stone-700 shadow-inner bg-stone-950">
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* راهنمای بصری روی نقشه */}
              <div className="absolute bottom-2 left-2 z-20 bg-stone-900/90 backdrop-blur-sm border border-stone-800 text-[10px] text-stone-300 px-2.5 py-1 rounded-lg shadow pointer-events-none flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>روی نقشه کلیک کنید یا پین را با کشیدن تنظیم نمایید</span>
              </div>
            </div>

            {/* پیش‌فرض‌های مشهور شهر انتخابی برای انتخاب تک‌کلیک */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-stone-400 font-bold block">
                مکان‌های مشهور و رسمی شهر انتخابی (یک‌کلیک برای پرش پین):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-none">
                {QUICK_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="px-2.5 py-1 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Building2 className="w-3 h-3 text-stone-400" />
                    <span>{p.name.split(' (')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ستون چپ (۵ ستون): فرم مشخصات محل مراسم و دکمه‌های مسیریابی */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-stone-950/60">
            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1">
                  نام مکان یا عنوان محل برگزاری
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مسجد دارالاحسان، آرامستان بهشت مصطفی، تالار..."
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1">
                  نوع مکان
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'mosque', label: 'مسجد' },
                    { id: 'cemetery', label: 'آرامستان' },
                    { id: 'hall', label: 'تالار مجالس' },
                    { id: 'hussainiya', label: 'حسینیه / تکیه' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setLocationType(t.id as any)}
                      className={`py-1.5 px-2 rounded-xl text-center font-bold text-xs transition-colors cursor-pointer border ${
                        locationType === t.id
                          ? 'bg-amber-500 text-stone-950 border-amber-400 shadow'
                          : 'bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-300 block mb-1">
                    شهر *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تهران، استانبول، دبی..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-300 block mb-1">
                    محله / منطقه
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: مرکز شهر، انقلاب..."
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-stone-300">
                    آدرس و نشانی دقیق متنی (ثبت خودکار از روی نقشه)
                  </label>
                  {isReverseGeocoding ? (
                    <span className="text-[10px] text-amber-400 animate-pulse">در حال دریافت آدرس...</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fetchAddressForCoords(pinCoords.lat, pinCoords.lng)}
                      className="text-[10px] text-sky-400 hover:text-sky-300 underline cursor-pointer"
                    >
                      استعلام آدرس از GPS
                    </button>
                  )}
                </div>
                <textarea
                  rows={2}
                  placeholder="آدرس به صورت خودکار با کلیک روی نقشه استخراج می‌شود..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1">
                  شماره تماس خادم یا مسئول هماهنگی (اختیاری)
                </label>
                <input
                  type="text"
                  placeholder="۰۹۱۸..."
                  value={khademPhone}
                  onChange={(e) => setKhademPhone(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-500 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-stone-900/90 p-2.5 rounded-xl border border-stone-800">
                <input
                  type="checkbox"
                  checked={saveToGlobalDirectory}
                  onChange={(e) => setSaveToGlobalDirectory(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded bg-stone-950 border-stone-700"
                />
                <span className="text-[11px] text-stone-300">
                  ذخیره در فهرست سراسری مساجد و مراکز مذهبی شهر انتخابی
                </span>
              </label>

              {/* ابزارهای تست مسیریابی سریع برای کاربران */}
              <div className="pt-2 border-t border-stone-800/80 space-y-2">
                <span className="text-[10px] text-stone-400 font-bold block">
                  پیش‌نمایش اپ‌های مسیریابی هوشمند برای مراجعین:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${pinCoords.lat},${pinCoords.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-stone-900 hover:bg-stone-850 rounded-lg text-center text-stone-200 border border-stone-800 flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3 text-sky-400" />
                    <span>Google</span>
                  </a>

                  <a
                    href={`https://waze.com/ul?ll=${pinCoords.lat},${pinCoords.lng}&navigate=yes`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-stone-900 hover:bg-stone-850 rounded-lg text-center text-stone-200 border border-stone-800 flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3 text-cyan-400" />
                    <span>Waze</span>
                  </a>

                  <a
                    href={`https://neshan.org/maps/@${pinCoords.lat},${pinCoords.lng},16z`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-stone-900 hover:bg-stone-850 rounded-lg text-center text-stone-200 border border-stone-800 flex items-center justify-center gap-1"
                  >
                    <Compass className="w-3 h-3 text-blue-400" />
                    <span>نشان</span>
                  </a>

                  <a
                    href={`https://balad.ir/location?latitude=${pinCoords.lat}&longitude=${pinCoords.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-stone-900 hover:bg-stone-850 rounded-lg text-center text-stone-200 border border-stone-800 flex items-center justify-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>بلد</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={copyShareLink}
                  className="w-full py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[10px] text-stone-400 hover:text-stone-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">لینک مسیریابی کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>کپی لینک مستقیم مسیریابی برای ارسال در پیام‌رسان‌ها</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* دکمه‌های تایید و بستن */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs cursor-pointer"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleConfirmLocation}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>ثبت نهایی موقعیت روی نقشه</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
