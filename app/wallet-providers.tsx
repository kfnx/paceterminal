'use client';

import { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { Provider } from 'jotai';

// Import Solana wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletConnectionProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Set to 'devnet' or 'mainnet-beta' based on your needs
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    return 'https://api.devnet.solana.com';
  }, []);

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Provider>{children}</Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
