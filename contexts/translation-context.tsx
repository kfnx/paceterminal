'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { getServerTranslations } from '@/lib/get-server-translations';
import { type Locale } from '@/lib/i18n';

type TranslationContextType = {
  t: (key: string) => string;
  locale: Locale;
  isLoading: boolean;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [translations, setTranslations] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // Extract current locale from pathname
  const locale: Locale = pathname.startsWith('/id') ? 'id' : 'en';

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const trans = await getServerTranslations(locale);
        setTranslations(trans);
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTranslations();
  }, [locale]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ t, locale, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
