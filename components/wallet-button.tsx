'use client';

// https://github.com/anza-xyz/wallet-adapter/tree/master/packages/core/react#creating-a-custom-connect-button
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import * as Button from "@/components/ui/button";
import { RiCloseLine, RiWalletLine, RiArrowDownSLine, RiLockUnlockLine } from "@remixicon/react";
import { RiLogoutBoxRLine } from "@remixicon/react";
import { useWalletAddress } from '@/hooks/use-wallet-address';
import { disconnect } from "process";
import * as Dropdown from "@/components/ui/dropdown";
import { useAtom } from "jotai";
import { paymentModalOpenAtom } from "./payment-modal";


export function WalletButton() {
  // const [walletModalConfig, setWalletModalConfig] = useState<Readonly<{
  //   onSelectWallet(walletName: WalletName): void;
  //   wallets: Wallet[];
  // }> | null>(null);
  const { buttonState, onConnect, onDisconnect, onSelectWallet, walletIcon } = useWalletMultiButton({
    onSelectWallet: (wallet) => {
      // console.log('wallet', wallet);
      wallet.onSelectWallet(wallet.wallets[0].adapter.name);
      // setWalletModalConfig(wallet);
      // if (Array.isArray(wallet.wallets) && wallet.wallets.length > 0) {
      //   const walletAdapter = wallet.wallets[0].adapter.name;
      //   console.log('wallet.wallets', walletAdapter);
      //   // setWalletModalConfig(null);
      //   return walletAdapter;
      // }
    },
  });
  const { connected, formattedAddress } = useWalletAddress();

  const [_paymentModalOpen, setPaymentModalOpen] = useAtom(
    paymentModalOpenAtom,
  );

  let label;
  switch (buttonState) {
    case 'connected':
      label = formattedAddress;
      break;
    case 'connecting':
      label = 'Connecting';
      break;
    case 'disconnecting':
      label = 'Disconnecting';
      break;
    case 'has-wallet':
    case 'no-wallet':
      label = 'Connect Wallet';
      break;
  }


  if (connected) {
    return <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          <img src={walletIcon} alt='wallet icon' className='h-4 w-4' />
          {label} {connected && <Button.Icon as={RiArrowDownSLine} />}
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align='end' className='w-48'>
        <Dropdown.Item onClick={() => setPaymentModalOpen(true)}>
          <Dropdown.ItemIcon as={RiLockUnlockLine} />
          Remove Ads
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onDisconnect?.()}>
          <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
          Disconnect Wallet
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  }
  return (
    <>
      <Button.Root
        variant='neutral'
        mode='stroke'
        disabled={buttonState === 'connecting' || buttonState === 'disconnecting'}
        onClick={() => {
          console.log('buttonState', buttonState);
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
      >
        <Button.Icon as={RiWalletLine} /> {label} {connected && <Button.Icon as={RiCloseLine} onClick={disconnect} />}
      </Button.Root>
      {/* {walletModalConfig ? (
        <Modal.Root>
          {walletModalConfig.wallets.map((wallet) => (
            <Button.Root
              key={wallet.adapter.name}
              onClick={() => {
                console.log('wallet.adapter.name', wallet.adapter.name);
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