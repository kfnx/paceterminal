import { useSolanaTransaction } from './use-solana-transaction';
import { useWalletConnection } from './use-wallet-connection';

export interface SolanaWalletState {
  // Wallet connection state
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  publicKey: string | null;
  wallet: any | null;
  balance: number | null;
  usdcBalance: number | null;
  network: 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';
  endpoint: string;
  isLoading: boolean;
  error: string | null;

  // Transaction state
  isExecuting: boolean;
  signature: string | null;
  transactionError: string | null;
  transactionSuccess: boolean;
}

export interface SolanaWalletActions {
  // Wallet actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshUsdcBalance: (tokenMint?: string) => Promise<void>;

  // Transaction actions
  sendSol: (amount: number, recipient: string) => Promise<string | null>;
  sendUsdc: (
    amount: number,
    recipient: string,
    tokenMint?: string,
  ) => Promise<string | null>;
  sendUsdcToPace: (
    amount: number,
    tokenMint?: string,
  ) => Promise<string | null>;
  resetTransaction: () => void;
}

export interface UseSolanaWalletOptions {
  tokenMint?: string; // Custom token mint address for balance checking
  defaultTokenMint?: string; // Default token mint address for transfers
  paceAddress?: string; // Custom Pace Terminal address
}

export function useSolanaWallet(
  options: UseSolanaWalletOptions = {},
): SolanaWalletState & SolanaWalletActions {
  const walletConnection = useWalletConnection({
    tokenMint: options.tokenMint,
  });
  const transaction = useSolanaTransaction({
    defaultTokenMint: options.defaultTokenMint,
    paceAddress: options.paceAddress,
  });

  return {
    // Wallet connection state
    connected: walletConnection.connected,
    connecting: walletConnection.connecting,
    disconnecting: walletConnection.disconnecting,
    publicKey: walletConnection.publicKey?.toString() || null,
    wallet: walletConnection.wallet,
    balance: walletConnection.balance,
    usdcBalance: walletConnection.usdcBalance,
    network: walletConnection.network,
    endpoint: walletConnection.endpoint,
    isLoading: walletConnection.isLoading,
    error: walletConnection.error,

    // Transaction state
    isExecuting: transaction.isExecuting,
    signature: transaction.signature,
    transactionError: transaction.error,
    transactionSuccess: transaction.success,

    // Wallet actions
    connect: walletConnection.connect,
    disconnect: walletConnection.disconnect,
    refreshBalance: walletConnection.refreshBalance,
    refreshUsdcBalance: walletConnection.refreshUsdcBalance,

    // Transaction actions
    sendSol: transaction.sendSol,
    sendUsdc: transaction.sendUsdc,
    sendUsdcToPace: transaction.sendUsdcToPace,
    resetTransaction: transaction.resetTransaction,
  };
}
