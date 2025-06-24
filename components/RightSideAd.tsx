import { useEffect, useState, useRef } from "react";
import { useMemberStatus } from "@/hooks/use-member-status";
import { RiCloseLine } from "@remixicon/react";

export function RightSideAd() {
  const { isMember } = useMemberStatus();
  const [showAds, setShowAds] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(30000); // 30 seconds in milliseconds
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
      }, 3000); // 3 seconds delay

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
      className={`relative hidden h-[600px] w-[240px] min-w-0 transform cursor-pointer flex-col gap-2 transition-all duration-300 ease-in-out lg:flex ${isVisible
        ? 'translate-x-0 scale-100 opacity-100'
        : 'translate-x-4 scale-95 opacity-0'
        }`}
      onClick={() => {
        window?.open('https://x.com/PaceTerminal', '_blank');
      }}
    >
      <div className='z-10 flex items-center justify-between gap-2 rounded-md'>
        <span className='px-2 text-paragraph-xs text-text-sub-600'>
          {canClose > 0
            ? `Please wait ${Math.ceil(canClose / 1000)} seconds to close the Sponsored Ad`
            : 'Sponsored Ad'}
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
      <div className="space-y-2">
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full transition-transform duration-200 hover:scale-105' />
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full transition-transform duration-200 hover:scale-105' />
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full transition-transform duration-200 hover:scale-105' />
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full transition-transform duration-200 hover:scale-105' />
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full transition-transform duration-200 hover:scale-105' />
      </div>
    </div>
  );
}