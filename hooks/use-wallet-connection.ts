import { useCallback, useEffect, useState } from 'react';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// Default USDC token mint addresses
const USDC_MINT_MAINNET = new PublicKey(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
);
const USDC_MINT_DEVNET = new PublicKey(
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
);

export interface WalletConnectionState {
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  publicKey: PublicKey | null;
  wallet: any | null;
  balance: number | null;
  usdcBalance: number | null;
  network: 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';
  endpoint: string;
  isLoading: boolean;
  error: string | null;
}

export interface WalletConnectionActions {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshUsdcBalance: (tokenMint?: string) => Promise<void>;
}

export interface UseWalletConnectionOptions {
  tokenMint?: string; // Custom token mint address
}

export function useWalletConnection(
  options: UseWalletConnectionOptions = {},
): WalletConnectionState & WalletConnectionActions {
  const {
    connected,
    connecting,
    disconnecting,
    publicKey,
    wallet,
    connect,
    disconnect,
  } = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine network from connection endpoint
  const getNetwork = useCallback(() => {
    const endpoint = connection.rpcEndpoint;
    if (endpoint.includes('mainnet')) return 'mainnet-beta' as const;
    if (endpoint.includes('devnet')) return 'devnet' as const;
    if (endpoint.includes('testnet')) return 'testnet' as const;
    return 'localnet' as const;
  }, [connection.rpcEndpoint]);

  // Get USDC mint based on network or custom token mint
  const getUsdcMint = useCallback(() => {
    // If custom token mint is provided, use it
    if (options.tokenMint) {
      return new PublicKey(options.tokenMint);
    }

    // Otherwise use default USDC mint based on network
    const network = getNetwork();
    if (network === 'devnet') {
      return USDC_MINT_DEVNET;
    }
    return USDC_MINT_MAINNET;
  }, [getNetwork, options.tokenMint]);

  // Fetch SOL balance
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) {
      setBalance(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    } catch (err) {
      console.error('Error fetching SOL balance:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch SOL balance',
      );
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection]);

  // Fetch USDC balance
  const fetchUsdcBalance = useCallback(
    async (tokenMint?: string) => {
      if (!publicKey || !connection) {
        setUsdcBalance(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Use provided token mint or default
        const mint = tokenMint ? new PublicKey(tokenMint) : getUsdcMint();

        const tokenAccount = await getAssociatedTokenAddress(
          mint,
          publicKey,
          false,
        );

        try {
          const account = await getAccount(connection, tokenAccount);
          // Determine decimals based on token mint (USDC has 6, most others have 9)
          const decimals =
            mint.equals(USDC_MINT_MAINNET) || mint.equals(USDC_MINT_DEVNET)
              ? 6
              : 9;
          setUsdcBalance(Number(account.amount) / Math.pow(10, decimals));
        } catch {
          // Token account doesn't exist, balance is 0
          setUsdcBalance(0);
        }
      } catch (err) {
        console.error('Error fetching token balance:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch token balance',
        );
        setUsdcBalance(null);
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, connection, getUsdcMint],
  );

  // Connect wallet
  const handleConnect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await connect();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, [connect]);

  // Disconnect wallet
  const handleDisconnect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await disconnect();
      setBalance(null);
      setUsdcBalance(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to disconnect wallet',
      );
    } finally {
      setIsLoading(false);
    }
  }, [disconnect]);

  // Refresh SOL balance
  const refreshBalance = useCallback(async () => {
    await fetchBalance();
  }, [fetchBalance]);

  // Refresh USDC balance
  const refreshUsdcBalance = useCallback(
    async (tokenMint?: string) => {
      await fetchUsdcBalance(tokenMint);
    },
    [fetchUsdcBalance],
  );

  // Auto-fetch balances when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      fetchUsdcBalance();
    } else {
      setBalance(null);
      setUsdcBalance(null);
    }
  }, [connected, publicKey, fetchBalance, fetchUsdcBalance]);

  // Clear error when wallet state changes
  useEffect(() => {
    if (connected || connecting || disconnecting) {
      setError(null);
    }
  }, [connected, connecting, disconnecting]);

  return {
    // State
    connected,
    connecting,
    disconnecting,
    publicKey,
    wallet,
    balance,
    usdcBalance,
    network: getNetwork(),
    endpoint: connection.rpcEndpoint,
    isLoading,
    error,

    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
    refreshBalance,
    refreshUsdcBalance,
  };
}
