'use client';

import { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

// const NETWORK = 'https://api.devnet.solana.com';
const NETWORK = 'https://mainnet.helius-rpc.com/?api-key=d5ce36ae-e878-4394-ba0b-01b70b908a3f';

export const WalletConnectionProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={NETWORK} >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
