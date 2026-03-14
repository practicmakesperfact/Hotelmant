import type { Locale } from '@/lib/types';
import { en, type TranslationKey } from './translations/en';
import { am } from './translations/am';
import { om } from './translations/om';
import { defaultLocale, locales, localeConfigs, getLocaleConfig, isValidLocale, formatCurrency, formatDate, formatRelativeTime } from './config';

const translations: Record<Locale, TranslationKey> = {
  en,
  am,
  om,
};

export function getTranslations(locale: Locale): TranslationKey {
  return translations[locale] || translations[defaultLocale];
}

// Deep get nested translation key
type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string 
      ? T[K] extends object 
        ? `${K}.${NestedKeyOf<T[K]>}` | K
        : K 
      : never 
    }[keyof T]
  : never;

export function t(locale: Locale, key: string): string {
  const trans = getTranslations(locale);
  const keys = key.split('.');
  let result: unknown = trans;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key; // Return key if not found
    }
  }
  
  return typeof result === 'string' ? result : key;
}

export {
  defaultLocale,
  locales,
  localeConfigs,
  getLocaleConfig,
  isValidLocale,
  formatCurrency,
  formatDate,
  formatRelativeTime,
};

export type { TranslationKey };
