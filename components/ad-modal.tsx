'use client';

import * as React from 'react';
import * as Modal from '@/components/ui/modal';
// import { WalletButton } from './wallet';

const TIME_BEFORE_AD_OPEN = 10_000;
const TIME_TO_CLOSE_AD = 30_000;
const AD_SHOW_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
const AD_TRACKING_KEY = 'ad-modal-last-shown';

export default function AdModal() {
  const [open, setOpen] = React.useState(false);
  const [timeToClose, setTimeToClose] = React.useState(TIME_TO_CLOSE_AD);

  // Check if enough time has passed since last ad showing
  const canShowAd = React.useCallback(() => {
    if (typeof window === 'undefined') return false;

    const lastShown = localStorage.getItem(AD_TRACKING_KEY);
    if (!lastShown) return true;

    const timeSinceLastShow = Date.now() - parseInt(lastShown, 10);
    return timeSinceLastShow >= AD_SHOW_INTERVAL;
  }, []);

  // Record the current time when ad is shown
  const recordAdShown = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AD_TRACKING_KEY, Date.now().toString());
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (canShowAd()) {
        console.log('showing ad modal');
        setTimeToClose(TIME_TO_CLOSE_AD);
        setOpen(true);
        recordAdShown();
      } else {
        console.log('ad modal skipped - not enough time has passed');
      }
    }, TIME_BEFORE_AD_OPEN);

    return () => clearTimeout(timeout);
  }, [canShowAd, recordAdShown]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (open) {
        setTimeToClose((prev) => Math.max(prev - 1000, 0));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if timeToClose is 0 (user can close manually)
    // or if newOpen is true (opening the modal)
    if (newOpen || timeToClose === 0) {
      setOpen(newOpen);
    }
    // If newOpen is false and timeToClose > 0, ignore the change
    // This prevents closing by clicking outside or pressing Escape
  };

  const handleAdsClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;
    window.open('https://x.com/PaceTerminal', '_blank');
  };

  return (
    <Modal.Root open={open} onOpenChange={handleOpenChange}>
      <Modal.Content className='max-w-[880px]' >
        <Modal.Header>
          <Modal.Title className='flex w-full items-center justify-between'>
            <span>{timeToClose > 0
              ? `Please wait ${timeToClose / 1000} seconds to close the Sponsored Ad`
              : 'Sponsored Ad'}</span>
            {/* <WalletButton /> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex items-start gap-4'>
          <img src='/images/ads/placeholder.png' alt='ad' className='w-full cursor-pointer' onClick={handleAdsClick} />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
