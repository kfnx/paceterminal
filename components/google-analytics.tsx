'use client';

import { Suspense } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

function GoogleAnalyticsInner() {
  try {
    return <GoogleAnalytics gaId="G-6CLBJ1L2S8" />;
  } catch (error) {
    // Silently handle errors to prevent build failures
    console.warn('Google Analytics initialization error:', error);
    return null;
  }
}

export function GoogleAnalyticsWrapper() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  );
} 