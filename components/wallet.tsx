'use client';

import { RiCloseLine, RiLoader4Line, RiWallet3Line } from '@remixicon/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { useWalletAddress } from '@/hooks/use-wallet-address';
import { useWalletT } from '@/hooks/use-translations';
import * as Button from '@/components/ui/button';

export function WalletButton({
  className,
  collapsed,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  const { connected, formattedAddress, isLoading } = useWalletAddress();
  const { disconnect } = useWallet();
  const t = useWalletT();

  const handleWalletClick = () => {
    if (!connected) {
      // Programmatically click the hidden wallet adapter button to connect
      const connectButton = document.querySelector('.wallet-adapter-button');
      if (connectButton instanceof HTMLElement) {
        connectButton.click();
      }
    } else {
      // Directly call disconnect function instead of trying to click a dropdown item
      disconnect();
    }
  };

  return (
    <Button.Root
      variant='neutral'
      mode='stroke'
      className={className}
      onClick={handleWalletClick}
    >
      {isLoading ? (
        <>
          <span className='animate-pulse'>{t('connecting')}</span>
          <Button.Icon as={RiLoader4Line} className='animate-spin' />
        </>
      ) : connected ? (
        <>
          <Button.Icon as={RiWallet3Line} />
          {formattedAddress}
          <Button.Icon as={RiCloseLine} />
        </>
      ) : (
        <>
          {collapsed ? '' : t('connect')}
          <Button.Icon as={RiWallet3Line} />
        </>
      )}
    </Button.Root>
  );
}

// This invisible component is needed to trigger the wallet modal
export function InvisibleWalletMultiButton() {
  return (
    <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
      <WalletMultiButton />
    </div>
  );
}
