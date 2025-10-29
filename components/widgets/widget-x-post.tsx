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
    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]',
    );

    const loadEmbed = () => {
      if (window.twttr && embedRef.current) {
        // Clear previous content
        embedRef.current.innerHTML = '';

        // Create the blockquote with dark mode support
        const blockquote = document.createElement('blockquote');
        blockquote.className = 'twitter-tweet';
        // Add data-theme attribute for dark mode
        if (theme === 'dark') {
          blockquote.setAttribute('data-theme', 'dark');
        }
        const link = document.createElement('a');
        link.href = `https://twitter.com/${username}/status/${tweetId}`;
        blockquote.appendChild(link);
        embedRef.current.appendChild(blockquote);

        // Load the widget
        window.twttr.widgets
          .load(embedRef.current)
          .then(() => {
            setIsLoading(false);
            // Wait for iframe to render completely
            setTimeout(() => {
              const iframe = embedRef.current?.querySelector('iframe');
              if (iframe) {
                iframe.style.borderRadius = '12px';
                iframe.style.overflow = 'hidden';
                iframe.style.border = '1px solid rgba(0, 0, 0, 0.1)'; // light border
                // iframe.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';
                iframe.style.display = 'block';
                iframe.style.margin = '0 auto';
                iframe.style.width = '100%';
                iframe.style.maxWidth = '550px';
              }
            }, 100); // Delay ensures iframe is ready
          })
          .catch(() => {
            setError(true);
            setIsLoading(false);
          });
      }
    };

    if (existingScript) {
      // Script already loaded
      if (window.twttr) {
        loadEmbed();
      } else {
        // Wait for script to load
        existingScript.addEventListener('load', loadEmbed);
      }
    } else {
      // Load Twitter widgets script
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

    // Cleanup function
    return () => {
      if (embedRef.current) {
        embedRef.current.innerHTML = '';
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
      className={`flex flex-col rounded border border-stroke-soft-200 bg-bg-white-0 px-2 py-3 shadow-regular-xs sm:px-2 sm:py-4 md:px-2 md:py-6 ${className}`}
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
          // maxWidth: '550px',
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
