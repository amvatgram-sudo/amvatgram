import { CeremonyDetails, CeremonySessionSlot } from '../types';

/**
 * مدیریت و قالب‌بندی ساعات ۳ گانه مساجد، مجلس بانوان در منزل و اعلان سراسری خاکسپاری
 */

export const DEFAULT_MORNING_SLOT: CeremonySessionSlot = {
  enabled: true,
  label: 'صبح',
  startTime: '۰۹:۰۰',
  endTime: '۱۱:۳۰',
};

export const DEFAULT_AFTERNOON_SLOT: CeremonySessionSlot = {
  enabled: true,
  label: 'عصر',
  startTime: '۱۵:۰۰',
  endTime: '۱۷:۰۰',
};

export const DEFAULT_EVENING_SLOT: CeremonySessionSlot = {
  enabled: true,
  label: 'شب',
  startTime: '۱۹:۳۰',
  endTime: '۲۱:۳۰',
};

/**
 * دریافت لیست نوبت‌های فعال مسجد (صبح، عصر، شب)
 */
export function getActiveMosqueSlots(ceremony: CeremonyDetails): { slotName: string; timeRange: string; key: string }[] {
  const slots: { slotName: string; timeRange: string; key: string }[] = [];

  if (ceremony.morningSlot?.enabled) {
    slots.push({
      slotName: 'نوبت صبح',
      timeRange: `${ceremony.morningSlot.startTime} الی ${ceremony.morningSlot.endTime || 'پایان'}`,
      key: 'morning',
    });
  }

  if (ceremony.afternoonSlot?.enabled) {
    slots.push({
      slotName: 'نوبت عصر',
      timeRange: `${ceremony.afternoonSlot.startTime} الی ${ceremony.afternoonSlot.endTime || 'پایان'}`,
      key: 'afternoon',
    });
  }

  if (ceremony.eveningSlot?.enabled) {
    slots.push({
      slotName: 'نوبت شب',
      timeRange: `${ceremony.eveningSlot.startTime} الی ${ceremony.eveningSlot.endTime || 'پایان'}`,
      key: 'evening',
    });
  }

  // اگر هیچ اسلاتی فعال نبود ولی startTime وجود داشت (سازگاری به عقب)
  if (slots.length === 0 && ceremony.startTime) {
    slots.push({
      slotName: 'ساعت برگزاری',
      timeRange: `${ceremony.startTime} ${ceremony.endTime ? `الی ${ceremony.endTime}` : ''}`.trim(),
      key: 'legacy',
    });
  }

  return slots;
}

/**
 * متن خلاصه نوبت‌های مسجد برای نمایش روی کارت آگهی
 */
export function getMosqueSlotsSummary(ceremony: CeremonyDetails): string {
  const active = getActiveMosqueSlots(ceremony);
  if (active.length === 0) return ceremony.startTime || 'طبق اعلام مساجد';
  return active.map((s) => `${s.slotName.replace('نوبت ', '')}: ${s.timeRange}`).join(' | ');
}

/**
 * تولید متن اعلان سراسری شهر برای تشییع و خاکسپاری متوفی
 */
export function generateCitywideBurialText(
  deceasedName: string,
  gender: 'male' | 'female',
  targetCity: string,
  cemeteryName: string
): string {
  const prefix = gender === 'female' ? 'مرحومه مغفوره' : 'مرحوم مغفور';
  return `به اطلاع عموم همشهریان گرامی شهر ${targetCity} می‌رساند؛ پیکر مطهر ${prefix} ${deceasedName} به ${cemeteryName} خاکسپاری خواهد شد.`;
}
