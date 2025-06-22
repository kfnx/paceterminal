'use client';

import { useCallback } from 'react';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, any>,
    ) => void;
  }
}

export function useAnalytics() {
  const trackEvent = useCallback(
    (action: string, category: string, label?: string, value?: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
    },
    [],
  );

  const trackPageView = useCallback((url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-6CLBJ1L2S8', {
        page_path: url,
      });
    }
  }, []);

  const trackCustomEvent = useCallback(
    (eventName: string, parameters: Record<string, any> = {}) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, parameters);
      }
    },
    [],
  );

  return {
    trackEvent,
    trackPageView,
    trackCustomEvent,
  };
}
