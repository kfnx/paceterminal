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
      try {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
          });
        }
      } catch (error) {
        console.warn('Analytics trackEvent error:', error);
      }
    },
    [],
  );

  const trackPageView = useCallback((url: string) => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-6CLBJ1L2S8', {
          page_path: url,
        });
      }
    } catch (error) {
      console.warn('Analytics trackPageView error:', error);
    }
  }, []);

  const trackCustomEvent = useCallback(
    (eventName: string, parameters: Record<string, any> = {}) => {
      try {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', eventName, parameters);
        }
      } catch (error) {
        console.warn('Analytics trackCustomEvent error:', error);
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
