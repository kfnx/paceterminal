export interface UmamiConfig {
  websiteId: string;
  dataDomains?: string[];
  autoTrack?: boolean;
  doNotTrack?: boolean;
  cache?: boolean;
  domains?: string[];
  url?: string;
}

export interface UmamiEvent {
  event_name: string;
  event_data?: Record<string, any>;
}

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
      trackEvent: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

export const UMANI_SCRIPT_ID = 'umami-script';

export const createUmamiScript = (config: UmamiConfig): HTMLScriptElement => {
  const script = document.createElement('script');
  script.id = UMANI_SCRIPT_ID;
  script.async = true;
  script.defer = true;
  script.src = config.url || 'https://umami.example.com/script.js';
  script.setAttribute('data-website-id', config.websiteId);

  if (config.dataDomains) {
    script.setAttribute('data-domains', config.dataDomains.join(','));
  }

  if (config.autoTrack !== undefined) {
    script.setAttribute('data-auto-track', config.autoTrack.toString());
  }

  if (config.doNotTrack !== undefined) {
    script.setAttribute('data-do-not-track', config.doNotTrack.toString());
  }

  if (config.cache !== undefined) {
    script.setAttribute('data-cache', config.cache.toString());
  }

  if (config.domains) {
    script.setAttribute('data-domains', config.domains.join(','));
  }

  return script;
};

export const trackEvent = (
  eventName: string,
  eventData?: Record<string, any>,
): void => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }
};

export const isUmamiLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.umami;
};
