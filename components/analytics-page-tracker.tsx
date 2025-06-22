'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAnalytics } from '@/hooks/use-analytics';

function AnalyticsPageTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    try {
      const url = pathname + searchParams.toString();
      trackPageView(url);
    } catch (error) {
      // Silently handle errors to prevent build failures
      console.warn('Analytics tracking error:', error);
    }
  }, [pathname, searchParams, trackPageView]);

  return null;
}

export function AnalyticsPageTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageTrackerInner />
    </Suspense>
  );
} 