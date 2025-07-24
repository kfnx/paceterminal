'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n';

export function LocaleProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Extract locale from pathname (e.g., /en/dashboard -> 'en')
    const pathSegments = pathname.split('/');
    const localeFromPath = pathSegments[1];

    // Check if the locale is valid
    if (localeFromPath && locales.includes(localeFromPath as any)) {
      document.documentElement.lang = localeFromPath;
    } else {
      // Fallback to default locale
      document.documentElement.lang = 'en';
    }
  }, [pathname]);

  return null; // This component doesn't render anything
} 