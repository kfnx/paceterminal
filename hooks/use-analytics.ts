'use client';

import { useCallback } from 'react';

import { isUmamiLoaded, trackEvent } from '@/lib/umami';

export function useAnalytics() {
  const track = useCallback(
    (eventName: string, eventData?: Record<string, any>) => {
      trackEvent(eventName, eventData);
    },
    [],
  );

  const trackPageView = useCallback(
    (pageName?: string) => {
      const page = pageName || window.location.pathname;
      track('page_view', { page });
    },
    [track],
  );

  const trackButtonClick = useCallback(
    (buttonName: string, additionalData?: Record<string, any>) => {
      track('button_click', { button: buttonName, ...additionalData });
    },
    [track],
  );

  const trackFormSubmission = useCallback(
    (
      formName: string,
      success: boolean,
      additionalData?: Record<string, any>,
    ) => {
      track('form_submission', {
        form: formName,
        success,
        ...additionalData,
      });
    },
    [track],
  );

  const trackError = useCallback(
    (
      errorType: string,
      errorMessage: string,
      additionalData?: Record<string, any>,
    ) => {
      track('error', {
        type: errorType,
        message: errorMessage,
        ...additionalData,
      });
    },
    [track],
  );

  return {
    track,
    trackPageView,
    trackButtonClick,
    trackFormSubmission,
    trackError,
    isLoaded: isUmamiLoaded,
  };
}
