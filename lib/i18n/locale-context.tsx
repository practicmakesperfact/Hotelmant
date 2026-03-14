'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Locale } from '@/lib/types';
import { defaultLocale, isValidLocale, getTranslations, type TranslationKey } from './index';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKey;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_KEY = 'habesha_hotel_locale';

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale);

  useEffect(() => {
    // Check localStorage on mount
    const savedLocale = localStorage.getItem(LOCALE_KEY);
    if (savedLocale && isValidLocale(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(LOCALE_KEY, newLocale);
    setLocaleState(newLocale);
  }, []);

  const t = getTranslations(locale);

  const formatCurrency = useCallback((amount: number) => {
    const formatter = new Intl.NumberFormat(locale === 'am' ? 'am-ET' : locale === 'om' ? 'om-ET' : 'en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  }, [locale]);

  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
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
  }, [locale]);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
        formatCurrency,
        formatDate,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
