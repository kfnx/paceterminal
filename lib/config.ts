export const config = {
  analytics: {
    umami: {
      websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '',
      url:
        process.env.NEXT_PUBLIC_UMAMI_URL ||
        'https://umami.example.com/script.js',
      autoTrack: process.env.NEXT_PUBLIC_UMAMI_AUTO_TRACK !== 'false',
      doNotTrack: process.env.NEXT_PUBLIC_UMAMI_DO_NOT_TRACK === 'true',
      enabled:
        process.env.NODE_ENV === 'production' &&
        !!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    },
  },
  app: {
    name: 'PACETERMINAL',
    description: 'PACETERMINAL',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://paceterminal.com',
  },
} as const;
