'use client';

import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]',
    );

    const loadEmbed = () => {
      if (window.twttr && embedRef.current) {
        // Clear previous content
        embedRef.current.innerHTML = '';

        // Create the blockquote
        const blockquote = document.createElement('blockquote');
        blockquote.className = 'twitter-tweet';
        const link = document.createElement('a');
        link.href = `https://twitter.com/${username}/status/${tweetId}`;
        blockquote.appendChild(link);
        embedRef.current.appendChild(blockquote);

        // Load the widget
        window.twttr.widgets
          .load(embedRef.current)
          .then(() => {
            setIsLoading(false);
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
  }, [tweetId, username]);

  if (error) {
    return (
      <div className={`rounded-lg bg-bg-white-0 p-6 ${className}`}>
        <div className='text-center text-sm text-error-base'>
          Failed to load tweet
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <div className='flex h-48 items-center justify-center rounded-lg bg-bg-white-0'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500' />
        </div>
      )}
      <div
        ref={embedRef}
        className={isLoading ? 'hidden' : ''}
        style={{ minHeight: isLoading ? 0 : undefined }}
      />
    </div>
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
