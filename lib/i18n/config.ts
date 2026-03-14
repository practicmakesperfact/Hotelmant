import type { Locale, LocaleConfig } from '@/lib/types';

export const locales: Locale[] = ['en', 'am', 'om'];
export const defaultLocale: Locale = 'en';

export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  am: {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    direction: 'ltr',
  },
  om: {
    code: 'om',
    name: 'Afaan Oromo',
    nativeName: 'Afaan Oromoo',
    direction: 'ltr',
  },
};

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return localeConfigs[locale] || localeConfigs[defaultLocale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Format currency in Ethiopian Birr
export function formatCurrency(amount: number, locale: Locale = 'en'): string {
  const formatter = new Intl.NumberFormat(locale === 'am' ? 'am-ET' : locale === 'om' ? 'om-ET' : 'en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

// Format date based on locale
export function formatDate(date: Date, locale: Locale = 'en', options?: Intl.DateTimeFormatOptions): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    am: 'am-ET',
    om: 'om-ET',
  };
  
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(date);
}

// Format relative time
export function formatRelativeTime(date: Date, locale: Locale = 'en'): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (Math.abs(diffHours) < 1) {
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      return rtf.format(diffMinutes, 'minute');
    }
    return rtf.format(diffHours, 'hour');
  }
  
  return rtf.format(diffDays, 'day');
}
