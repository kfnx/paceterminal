import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { type Locale } from '@/lib/i18n';

type TranslationKey = string;
type TranslationValue = string | Record<string, any>;
type Translations = Record<string, TranslationValue>;

export function useTranslations(translations: Translations) {
  const pathname = usePathname();
  const locale = pathname.startsWith('/id') ? 'id' : 'en';

  const t = useMemo(() => {
    return (key: TranslationKey): string => {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }

      return typeof value === 'string' ? value : key;
    };
  }, [translations]);

  return { t, locale };
}
