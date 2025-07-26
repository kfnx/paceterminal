import { type Locale } from './i18n';

export async function getServerTranslations(locale: Locale) {
  try {
    const translations = await import(`../locales/${locale}/common.json`);
    return translations.default;
  } catch (error) {
    console.warn(`Could not load translations for locale: ${locale}`);
    const fallback = await import(`../locales/en/common.json`);
    return fallback.default;
  }
}
