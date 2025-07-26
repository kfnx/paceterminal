import { useRouter } from 'next/router';

export const locales = ['en', 'id'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export function useTranslation(locale?: Locale) {
  const router = useRouter();
  const currentLocale = (locale || router.locale || defaultLocale) as Locale;

  const t = (key: string, translations: Record<Locale, any>) => {
    const keys = key.split('.');
    let value = translations[currentLocale];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return { t, locale: currentLocale };
}

export async function getTranslations(locale: Locale) {
  try {
    const translations = await import(`../locales/${locale}/common.json`);
    return translations.default;
  } catch (error) {
    console.warn(`Could not load translations for locale: ${locale}`);
    return {};
  }
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }

  return defaultLocale;
}
