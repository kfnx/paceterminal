'use client';

// https://github.com/anza-xyz/wallet-adapter/tree/master/packages/core/react#creating-a-custom-connect-button
import { disconnect } from 'process';
import { useTranslation } from '@/contexts/translation-context';
import {
  RiArrowDownSLine,
  RiCloseLine,
  RiLockUnlockLine,
  RiLogoutBoxRLine,
  RiStarLine,
  RiWalletLine,
} from '@remixicon/react';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useAtom } from 'jotai';

import { useMemberStatus } from '@/hooks/use-member-status';
import { useWalletAddress } from '@/hooks/use-wallet-address';
import * as Button from '@/components/ui/button';
import * as Dropdown from '@/components/ui/dropdown';

import { paymentModalOpenAtom } from './payment-modal';

export function WalletButton({
  connectText,
  className,
}: {
  connectText?: string;
  className?: string;
}) {
  // const [walletModalConfig, setWalletModalConfig] = useState<Readonly<{
  //   onSelectWallet(walletName: WalletName): void;
  //   wallets: Wallet[];
  // }> | null>(null);
  const { buttonState, onConnect, onDisconnect, onSelectWallet, walletIcon } =
    useWalletMultiButton({
      onSelectWallet: (wallet) => {
        wallet.onSelectWallet(wallet.wallets[0].adapter.name);
        // setWalletModalConfig(wallet);
        // if (Array.isArray(wallet.wallets) && wallet.wallets.length > 0) {
        //   const walletAdapter = wallet.wallets[0].adapter.name;
        //   // setWalletModalConfig(null);
        //   return walletAdapter;
        // }
      },
    });
  const { connected, formattedAddress } = useWalletAddress();
  const { isMember, expiredAt, loading } = useMemberStatus();
  const { t } = useTranslation();

  const [_paymentModalOpen, setPaymentModalOpen] =
    useAtom(paymentModalOpenAtom);

  let label;
  switch (buttonState) {
    case 'connected':
      label = formattedAddress;
      break;
    case 'connecting':
      label = t('wallet.connecting');
      break;
    case 'disconnecting':
      label = t('wallet.disconnecting');
      break;
    case 'has-wallet':
    case 'no-wallet':
      label = connectText || t('wallet.connect');
      break;
  }

  if (connected) {
    return (
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button.Root variant='neutral' mode='stroke'>
            <img src={walletIcon} alt='wallet icon' className='h-4 w-4' />
            {label} {connected && <Button.Icon as={RiArrowDownSLine} />}
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align='end' className='w-56'>
          <Dropdown.Item
            onClick={() => {
              if (!isMember) {
                setPaymentModalOpen(true);
              }
            }}
          >
            <Dropdown.ItemIcon as={isMember ? RiStarLine : RiLockUnlockLine} />
            {/* {loading
              ? t('wallet.checkingStatus')
              : isMember && expiredAt
                ? t('wallet.memberUntil').replace(
                    '{date}',
                    expiredAt.toLocaleDateString(),
                  )
                : t('wallet.removeAds')} */}
            Free Premium Access!
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onDisconnect?.()}>
            <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
            {t('wallet.disconnectWallet')}
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    );
  }
  return (
    <>
      <Button.Root
        variant='neutral'
        mode='stroke'
        disabled={
          buttonState === 'connecting' || buttonState === 'disconnecting'
        }
        onClick={() => {
          switch (buttonState) {
            case 'connected':
              onDisconnect?.();
              break;
            case 'connecting':
            case 'disconnecting':
              break;
            case 'has-wallet':
              onConnect?.();
              break;
            case 'no-wallet':
              onSelectWallet?.();
              break;
          }
        }}
        className={className}
      >
        <Button.Icon as={RiWalletLine} /> {label}{' '}
        {connected && <Button.Icon as={RiCloseLine} onClick={disconnect} />}
      </Button.Root>
      {/* {walletModalConfig ? (
        <Modal.Root>
          {walletModalConfig.wallets.map((wallet) => (
            <Button.Root
              key={wallet.adapter.name}
              onClick={() => {
                walletModalConfig.onSelectWallet(wallet.adapter.name);
                setWalletModalConfig(null);
              }}
            >
              {wallet.adapter.name}
            </Button.Root>
          ))}
        </Modal.Root>
      ) : null} */}
    </>
  );
}
