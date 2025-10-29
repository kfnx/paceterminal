'use client';

import { useEffect, useRef, useState } from 'react';
import { RiTwitterXLine } from '@remixicon/react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import * as Divider from '@/components/ui/divider';

interface XPostWidgetProps {
  tweetId: string;
  username?: string;
  className?: string;
}

export default function XPostWidget({
  tweetId,
  username = 'x',
  className = '',
}: XPostWidgetProps) {
  const embedRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const container = embedRef.current;

    const existingScript = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]',
    );

    const loadEmbed = () => {
      if (window.twttr && container) {
        container.innerHTML = '';
        const blockquote = document.createElement('blockquote');
        blockquote.className = 'twitter-tweet';
        if (theme === 'dark') {
          blockquote.setAttribute('data-theme', 'dark');
        }
        if (theme === 'light') {
          blockquote.setAttribute('data-theme', 'light');
        }
        const link = document.createElement('a');
        link.href = `https://twitter.com/${username}/status/${tweetId}`;
        blockquote.appendChild(link);
        container.appendChild(blockquote);

        window.twttr.widgets
          .load(container)
          .then(() => {
            setIsLoading(false);
            const iframe = container.querySelector('iframe');
            if (iframe) {
              iframe.style.borderRadius = '12px';
              iframe.style.overflow = 'hidden';
              // ✅ Make the tweet responsive
              iframe.style.width = '100%'; // fill parent width
              iframe.style.maxWidth = '550px'; // Twitter's default max width
              iframe.style.minWidth = '320px'; // prevent too small on mobile

              // ✅ Ensure it behaves well inside flex/grid
              iframe.style.display = 'block';
              iframe.style.margin = '0 auto';
            }
          })
          .catch(() => {
            setError(true);
            setIsLoading(false);
          });
      }
    };

    if (existingScript) {
      if (window.twttr) loadEmbed();
      else existingScript.addEventListener('load', loadEmbed);
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      script.onload = loadEmbed;
      script.onerror = () => {
        setError(true);
        setIsLoading(false);
      };
      document.body.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [tweetId, username, theme]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 shadow-regular-xs sm:p-4 md:p-6 ${className}`}
      >
        <div className='mb-2 flex items-center gap-2 sm:mb-3'>
          <RiTwitterXLine className='text-base sm:text-lg text-text-sub-600' />
          <p className='text-paragraph-md font-semibold text-text-strong-950'>
            X Post
          </p>
        </div>
        <Divider.Root variant='line-spacing' className='mb-2 sm:mb-3' />
        <div className='text-sm text-center text-error-base'>
          Failed to load tweet
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center rounded border border-stroke-soft-200 bg-bg-white-0 px-2 py-3 shadow-regular-xs sm:px-2 sm:py-4 md:px-2 md:py-6 ${className}`}
    >
      {/* Header */}
      <div className='mb-2 flex items-center gap-2 self-start sm:mb-3'>
        <RiTwitterXLine className='text-base sm:text-lg text-text-sub-600' />
        <p className='text-paragraph-md font-semibold text-text-strong-950'>
          X Post
        </p>
      </div>

      {/* Divider */}
      <Divider.Root variant='line-spacing' className='mb-2 sm:mb-3' />

      {/* Content */}
      {isLoading && (
        <div className='flex h-48 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-stroke-soft-200 border-t-primary-base' />
        </div>
      )}
      <div
        ref={embedRef}
        className={isLoading ? 'hidden' : ''}
        style={{
          minHeight: isLoading ? 0 : undefined,
          // width: 'fit-content',
        }}
      />
    </motion.div>
  );
}

// TypeScript declaration for twttr
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => Promise<void>;
      };
    };
  }
}
