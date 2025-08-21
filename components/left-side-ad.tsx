import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/contexts/translation-context';
import { RiCloseLine } from '@remixicon/react';

import { useMemberStatus } from '@/hooks/use-member-status';
const isMember = false // pace request: show ads but keep content free

export function LeftSideAd() {
  // const { isMember } = useMemberStatus();
  const { t } = useTranslation();
  const [showAds, setShowAds] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(10000); // 10 seconds in milliseconds
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // If user becomes a member after initial load, hide immediately
    if (!isInitialLoad.current && isMember) {
      setIsVisible(false);
      setTimeout(() => setShowAds(false), 300); // Wait for animation to complete
      return;
    }

    // Initial load: add 3-second delay before checking member status
    if (isInitialLoad.current) {
      const timer = setTimeout(() => {
        if (isMember) {
          setShowAds(false);
          setIsVisible(false);
        } else {
          setShowAds(true);
          // Add a small delay for the visibility animation
          setTimeout(() => setIsVisible(true), 50);
        }
        isInitialLoad.current = false; // Mark initial load as complete
      }, 10000); // 10 seconds delay

      // Cleanup the timer if component unmounts or isMember changes before delay
      return () => clearTimeout(timer);
    }
  }, [isMember]);

  useEffect(() => {
    if (!showAds) return;

    const timer = setInterval(() => {
      setCanClose((prev) => {
        if (prev <= 0) return 0;
        return prev - 1000; // Decrease by 1 second
      });
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [showAds]);

  const handleCloseAds = () => {
    if (canClose <= 0) {
      // Smooth close animation
      setIsVisible(false);
      setTimeout(() => setShowAds(false), 300); // Wait for animation to complete
    }
  };

  if (!showAds) return null;

  return (
    <div
      className={`fixed left-6 top-12 z-50 hidden h-[850px] w-[230px] min-w-0 transform cursor-pointer flex-col gap-2 bg-white/80 p-2 px-4 transition-all duration-300 ease-in-out dark:bg-black/80 lg:flex ${isVisible
          ? 'translate-x-0 scale-100 opacity-100'
          : '-translate-x-4 scale-95 opacity-0'
        }`}
      onClick={() => {
        window?.open('https://x.com/PaceTerminal', '_blank');
      }}
    >
      <div className='z-10 flex items-center justify-between gap-2 rounded-md'>
        <span className='px-2 text-paragraph-xs text-text-sub-600'>
          {canClose > 0
            ? t('adModal.pleaseWaitToClose').replace(
              '{seconds}',
              Math.ceil(canClose / 1000).toString(),
            )
            : t('adModal.sponsoredAd')}
        </span>
        {canClose <= 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseAds();
            }}
            className='flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-colors duration-200 hover:bg-white/30'
          >
            <RiCloseLine className='size-4' />
          </button>
        )}
      </div>
      <div className='flex min-h-[600px] w-full items-center justify-center space-y-2 bg-bg-weak-50 text-center'>
        <p>
          {t('adModal.spaceAvailable')} <br />
          {t('adModal.contactUsOnX')} <br />
          @paceterminal
        </p>
      </div>
    </div>
  );
}
