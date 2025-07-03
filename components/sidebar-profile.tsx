'use client';

import * as React from 'react';
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiLoader4Line,
  RiLockUnlockLine,
  RiLogoutBoxRLine,
  RiMoonLine,
  RiPaypalLine,
  RiStarLine,
  RiWalletLine,
} from '@remixicon/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom } from 'jotai';
import { useTheme } from 'next-themes';

import { cn, cnExt } from '@/utils/cn';
import { useMemberStatus } from '@/hooks/use-member-status';
import { useWalletAddress } from '@/hooks/use-wallet-address';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Dropdown from '@/components/ui/dropdown';
import * as Switch from '@/components/ui/switch';
import { paymentModalOpenAtom } from '@/components/payment-modal';

import { WalletButton } from './wallet';
import IconVerifiedFill from '~/icons/icon-verified-fill.svg';

export function SidebarProfile({
  className,
  collapsed,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const { connected, formattedAddress, isLoading } = useWalletAddress();
  const { disconnect } = useWallet();
  const [_paymentModalOpen, setPaymentModalOpen] =
    useAtom(paymentModalOpenAtom);
  const { isMember, expiredAt, loading } = useMemberStatus();

  if (isLoading) {
    return (
      <div className='flex w-full items-center px-4 py-2'>
        <span className='animate-pulse'>Loading...</span>
        <Button.Icon as={RiLoader4Line} className='animate-spin' />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className='flex w-full items-center px-4 py-2'>
        <WalletButton collapsed={collapsed} />
      </div>
    );
  }

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className={cnExt(
          'flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none hover:bg-bg-weak-50 focus:outline-none',
          className,
        )}
      >
        <div
          className='flex w-full shrink-0 items-center justify-between gap-3'
          data-hide-collapsed
        >
          <div className='w-full flex-1 space-y-1'>
            <div className='flex items-center gap-4 text-label-sm'>
              <Button.Icon as={RiWalletLine} />
              {formattedAddress}
            </div>
          </div>

          <RiArrowRightSLine className='mr-2 size-5 text-text-sub-600' />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side='right' sideOffset={24} align='end'>
        <Dropdown.Item
          onSelect={(e) => {
            e.preventDefault();
            setTheme(() => (theme === 'dark' ? 'light' : 'dark'));
          }}
        >
          <Dropdown.ItemIcon as={RiMoonLine} />
          Dark Mode
          <span className='flex-1' />
          <Switch.Root checked={theme === 'dark'} />
        </Dropdown.Item>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item
            onClick={() => {
              if (!isMember) {
                setPaymentModalOpen(true);
              }
            }}
          >
            <Dropdown.ItemIcon as={isMember ? RiStarLine : RiLockUnlockLine} />
            {loading
              ? 'Checking status...'
              : isMember && expiredAt
                ? `Member until ${expiredAt.toLocaleDateString()}`
                : 'Remove Ads'}
          </Dropdown.Item>
        </Dropdown.Group>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item onClick={() => disconnect()}>
            <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
            Disconnect Wallet
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
