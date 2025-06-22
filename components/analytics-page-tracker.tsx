'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAnalytics } from '@/hooks/use-analytics';

export function AnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    trackPageView(url);
  }, [pathname, searchParams, trackPageView]);

  return null;
} 