import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
type Locale = 'en' | 'id';
export const locales: Locale[] = ['en', 'id'];

export default getRequestConfig((async ({ locale }: { locale: Locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
}) as any);
