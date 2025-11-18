'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/contexts/translation-context';
import { RiCloseLine } from '@remixicon/react';

import { useAdByPosition } from '@/hooks/use-ads';
import { useAnalytics } from '@/hooks/use-analytics';
import { useMemberStatus } from '@/hooks/use-member-status';

const isMember = false; // pace request: show ads but keep content free

export function MobileAd() {
  // const { isMember } = useMemberStatus();

  const { t } = useTranslation();
  const { trackCustomEvent } = useAnalytics();
  const mobileAd = useAdByPosition('right');
  const [showAd, setShowAd] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // If user becomes a member after initial load, hide immediately
    if (!isInitialLoad.current && isMember) {
      setIsVisible(false);
      setTimeout(() => setShowAd(false), 300); // Wait for animation to complete
      return;
    }

    // Initial load: add 8-second delay before checking member status and ad availability
    if (isInitialLoad.current) {
      const timer = setTimeout(() => {
        if (isMember || !mobileAd?.image_url) {
          setShowAd(false);
          setIsVisible(false);
        } else {
          setShowAd(true);
          // Add a small delay for the visibility animation
          setTimeout(() => setIsVisible(true), 50);
        }
        isInitialLoad.current = false; // Mark initial load as complete
      }, 8000); // 8 seconds delay

      // Cleanup the timer if component unmounts or isMember changes before delay
      return () => clearTimeout(timer);
    }
  }, [isMember, mobileAd]);

  const handleCloseAd = () => {
    // Smooth close animation
    setIsVisible(false);
    setTimeout(() => setShowAd(false), 300); // Wait for animation to complete
  };

  if (!showAd) return null;

  return (
    <div
      className={`shadow-lg fixed bottom-4 left-4 right-4 top-4 z-50 m-12 flex transform flex-col gap-2 rounded-lg bg-white/80 p-3 transition-all duration-300 ease-in-out dark:bg-black/80 lg:hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {/* Header with label and close button */}
      <div className='flex shrink-0 items-center justify-between gap-2'>
        <span className='text-paragraph-xs text-text-sub-600'>
          {t('adModal.sponsoredAd')}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCloseAd();
          }}
          className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors duration-200 hover:bg-white/30'
          aria-label='Close ad'
        >
          <RiCloseLine className='size-4' />
        </button>
      </div>

      {/* Ad image - clickable */}
      {mobileAd?.image_url && (
        <div
          className='relative flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md'
          onClick={async () => {
            if (mobileAd?.target_url) {
              // Track in database (reliable, ad-blocker resistant)
              try {
                await fetch('/api/ads/track-click', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    target_url: mobileAd.target_url,
                    position: 'right',
                  }),
                });
              } catch (error) {
                console.error('Error tracking ad click:', error);
              }

              // Track in Google Analytics (rich analytics)
              trackCustomEvent('ad_click', {
                ad_position: 'mobile',
                ad_url: mobileAd.target_url,
                event_category: 'Advertising',
                event_label: 'Mobile Ad',
              });

              window?.open(mobileAd.target_url, '_blank');
            }
          }}
        >
          <Image
            src={mobileAd.image_url}
            alt='Advertisement'
            width={200}
            height={400}
            className='h-full w-full object-fill'
            priority={false}
          />
        </div>
      )}
    </div>
  );
}
