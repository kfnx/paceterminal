# Solana Wallet Hooks

This document describes the comprehensive Solana wallet hooks that provide wallet connection and transaction functionality for the Pace Terminal application.

## Overview

The hooks provide a complete solution for:

- Reading connected wallet information
- Managing wallet connection state
- Executing Solana transactions (SOL and any SPL token transfers)
- Handling transaction states and errors
- Displaying network information and balances
- **Configurable token addresses** for maximum flexibility

## Pages and Components

### Send Tokens Page (`/send/tokens`)

A dedicated page for sending any SPL token to any Solana address with a comprehensive UI.

**Features:**

- **Universal SPL Token Support**: Send any SPL token by entering its mint address
- **Auto-Decimal Detection**: Automatically detects decimals for known tokens (USDC = 6, others = 9)
- **Automatic Token Account Creation**: Creates recipient token accounts if they don't exist
- **Comprehensive Validation**: Validates addresses, amounts, and wallet connection
- **Real-time Feedback**: Shows transaction status, success/error messages, and signatures
- **Modern UI**: Clean, responsive design with proper loading states

**Usage:**

1. Navigate to `/send/tokens`
2. Connect your Solana wallet
3. Enter the token mint address
4. Specify the recipient address
5. Enter the amount to send
6. Click "Send Tokens" to execute the transaction

**Example Token Mint Addresses:**

```typescript
// USDC (Mainnet)
const USDC_MAINNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// USDC (Devnet)
const USDC_DEVNET = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

// USDT (Mainnet)
const USDT_MAINNET = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
```

**Component Structure:**

```typescript
// app/send/tokens/page.tsx
import { SendTokensForm } from '@/components/send-tokens-form';

export default function SendTokensPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1>Send SPL Tokens</h1>
        <SendTokensForm />
        {/* Info panels with popular token addresses */}
      </div>
    </div>
  );
}
```

**Form Component Features:**

- Wallet connection integration
- Token mint address input with validation
- Recipient address input with validation
- Amount input with decimal precision
- Auto-detection of token decimals
- Transaction execution with proper error handling
- Success/error message display
- Transaction signature display
- Reset functionality for multiple transactions

## Hooks Overview

### 1. `useWalletConnection`

A hook for managing wallet connection state, balance, and network information with configurable token support.

**Features:**

- Wallet connection/disconnection
- SOL and configurable token balance fetching and refresh
- Network information (mainnet/devnet)
- RPC endpoint information
- Connection state management
- Error handling
- **Custom token mint address support**

**Usage:**

```typescript
import { useWalletConnection } from '@/hooks/use-wallet-connection';

// Basic usage with default USDC
function MyComponent() {
  const {
    connected,
    connecting,
    publicKey,
    balance,
    usdcBalance,
    network,
    endpoint,
    isLoading,
    error,
    connect,
    disconnect,
    refreshBalance,
    refreshUsdcBalance,
  } = useWalletConnection();

  // Use the wallet state and actions
}

// Advanced usage with custom token
function MyCustomTokenComponent() {
  const customTokenMint = 'YourCustomTokenMintAddress';

  const {
    connected,
    usdcBalance, // This will now show balance for your custom token
    refreshUsdcBalance,
  } = useWalletConnection({ tokenMint: customTokenMint });

  // Refresh balance for specific token
  const handleRefresh = () => {
    refreshUsdcBalance(customTokenMint);
  };
}
```

### 2. `useSolanaTransaction`

A hook for executing Solana transactions with configurable token support.

**Features:**

- SOL transfers
- **Configurable SPL token transfers** (any token, not just USDC)
- Transaction state management
- Error handling
- Convenience function for sending tokens to Pace Terminal
- **Custom token mint address support**

**Usage:**

```typescript
import { useSolanaTransaction } from '@/hooks/use-solana-transaction';

// Basic usage with default USDC
function MyComponent() {
  const {
    isExecuting,
    signature,
    error,
    success,
    sendSol,
    sendUsdc,
    sendUsdcToPace,
    resetTransaction,
  } = useSolanaTransaction();

  const handleSendUsdc = async () => {
    const signature = await sendUsdcToPace(10); // Send 10 USDC to Pace
    if (signature) {
      console.log('Transaction successful:', signature);
    }
  };
}

// Advanced usage with custom token and Pace address
function MyCustomTokenComponent() {
  const customTokenMint = 'YourCustomTokenMintAddress';
  const customPaceAddress = 'YourCustomPaceAddress';

  const { sendUsdc, sendUsdcToPace } = useSolanaTransaction({
    defaultTokenMint: customTokenMint,
    paceAddress: customPaceAddress,
  });

  const handleSendCustomToken = async () => {
    // Send custom token to any address
    const signature = await sendUsdc(5, 'recipientAddress', customTokenMint);

    // Send custom token to custom Pace address
    const signature2 = await sendUsdcToPace(5, customTokenMint);
  };
}
```

### 3. `useSolanaWallet`

A combined hook that provides both wallet connection and transaction functionality with full token customization.

**Features:**

- All features from both `useWalletConnection` and `useSolanaTransaction`
- Unified state management
- Simplified API for common use cases
- **Complete token address customization**

**Usage:**

```typescript
import { useSolanaWallet } from '@/hooks/use-solana-wallet';

// Basic usage
function MyComponent() {
  const {
    // Wallet state
    connected,
    publicKey,
    balance,
    usdcBalance,
    network,
    endpoint,
    isLoading,
    error,

    // Transaction state
    isExecuting,
    signature,
    transactionError,
    transactionSuccess,

    // Actions
    connect,
    disconnect,
    refreshBalance,
    refreshUsdcBalance,
    sendUsdcToPace,
    resetTransaction,
  } = useSolanaWallet();

  // Use all wallet and transaction functionality
}

// Advanced usage with custom tokens
function MyCustomTokenComponent() {
  const customTokenMint = 'YourCustomTokenMintAddress';
  const customPaceAddress = 'YourCustomPaceAddress';

  const {
    usdcBalance, // Shows balance for custom token
    sendUsdc,
    sendUsdcToPace,
    refreshUsdcBalance,
  } = useSolanaWallet({
    tokenMint: customTokenMint, // For balance checking
    defaultTokenMint: customTokenMint, // For transfers
    paceAddress: customPaceAddress,
  });

  const handleSendCustomToken = async () => {
    // Send to any address
    const signature = await sendUsdc(10, 'recipientAddress', customTokenMint);

    // Send to custom Pace address
    const signature2 = await sendUsdcToPace(10, customTokenMint);
  };
}
```

### 4. `useWalletTransaction` (New)

A simplified hook for basic wallet transactions with configurable token support.

**Features:**

- SOL transfers
- **Generic SPL token transfers** (any token)
- Simple API for basic transaction needs
- **Required token mint address for transfers**

**Usage:**

```typescript
import { useWalletTransaction } from '@/hooks/use-wallet-transaction';

function MyComponent() {
  const {
    isExecuting,
    signature,
    error,
    success,
    sendSol,
    sendToken,
    resetTransaction,
  } = useWalletTransaction();

  const handleSendCustomToken = async () => {
    const tokenMint = 'YourCustomTokenMintAddress';
    const recipient = 'recipientAddress';

    // Must specify token mint address
    const signature = await sendToken(5, recipient, tokenMint);
    if (signature) {
      console.log('Token sent successfully:', signature);
    }
  };
}
```

## Token Address Configuration

### Configurable Token Mint Addresses

All hooks now support custom token mint addresses:

```typescript
// Example token mint addresses
const USDC_MAINNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDC_DEVNET = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
const CUSTOM_TOKEN = 'YourCustomTokenMintAddress';

// Use in hooks
const wallet = useSolanaWallet({
  tokenMint: CUSTOM_TOKEN, // For balance checking
  defaultTokenMint: CUSTOM_TOKEN, // For transfers
});
```

### Token Decimal Handling

The hooks automatically handle different token decimals:

- **USDC**: 6 decimals
- **Most other SPL tokens**: 9 decimals
- **Custom detection**: Based on known USDC mint addresses

### Pace Terminal Address Customization

You can customize the Pace Terminal address for transfers:

```typescript
const wallet = useSolanaWallet({
  paceAddress: 'YourCustomPaceAddress',
});

// This will send to your custom address instead of the default
const signature = await wallet.sendUsdcToPace(10);
```

## Network Information

The hooks automatically detect and provide network information:

### Network Types

- **mainnet-beta**: Solana mainnet
- **devnet**: Solana devnet (for testing)
- **testnet**: Solana testnet
- **localnet**: Local development network

### Default USDC Mint Addresses

- **Mainnet USDC**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **Devnet USDC**: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`

### RPC Endpoints

- **Devnet**: `https://api.devnet.solana.com`
- **Mainnet**: `https://api.mainnet-beta.solana.com`

## Advanced Usage Examples

### Custom Token Integration

```typescript
function CustomTokenWallet() {
  const customTokenMint = 'YourCustomTokenMintAddress';

  const {
    connected,
    usdcBalance, // Shows your custom token balance
    sendUsdc,
    refreshUsdcBalance,
  } = useSolanaWallet({
    tokenMint: customTokenMint,
    defaultTokenMint: customTokenMint,
  });

  const handleSendCustomToken = async (amount: number, recipient: string) => {
    const signature = await sendUsdc(amount, recipient, customTokenMint);
    if (signature) {
      await refreshUsdcBalance(customTokenMint); // Refresh balance
    }
  };

  return (
    <div>
      <p>Custom Token Balance: {usdcBalance}</p>
      <button onClick={() => handleSendCustomToken(5, 'recipient')}>
        Send 5 Custom Tokens
      </button>
    </div>
  );
}
```

### Multiple Token Support

```typescript
function MultiTokenWallet() {
  const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  const customTokenMint = 'YourCustomTokenMintAddress';

  const {
    sendUsdc,
    refreshUsdcBalance,
  } = useSolanaWallet();

  const handleSendUsdc = async () => {
    await sendUsdc(10, 'recipient', usdcMint);
  };

  const handleSendCustomToken = async () => {
    await sendUsdc(5, 'recipient', customTokenMint);
  };

  return (
    <div>
      <button onClick={handleSendUsdc}>Send USDC</button>
      <button onClick={handleSendCustomToken}>Send Custom Token</button>
    </div>
  );
}
```

## Demo Component

A complete demo component is provided at `components/solana-wallet-demo.tsx` that showcases:

- Wallet connection/disconnection
- Network information display
- SOL and configurable token balance display and refresh
- RPC endpoint information
- Token transfer to any address (including Pace Terminal)
- Transaction status and error handling
- Modern UI with proper loading states

**Usage:**

```typescript
import { SolanaWalletDemo } from '@/components/solana-wallet-demo';

function MyPage() {
  return (
    <div>
      <h1>Solana Wallet Integration</h1>
      <SolanaWalletDemo />
    </div>
  );
}
```

## Demo Page

A complete demo page is available at `/solana-demo` that includes:

- Interactive wallet demo
- Network information
- Getting started guide
- Feature documentation
- **Token customization examples**

## Balance Management

### SOL Balance

- Automatically fetched when wallet connects
- Refreshable with `refreshBalance()`
- Displayed in SOL units (with 9 decimal precision)

### Token Balance

- Automatically fetched when wallet connects
- Refreshable with `refreshUsdcBalance(tokenMint?)`
- Displayed in token units (with appropriate decimal precision)
- Handles cases where token account doesn't exist (shows 0)
- **Supports any SPL token with custom mint address**

## Error Handling

All hooks include comprehensive error handling:

- Connection errors
- Transaction failures
- Network issues
- Insufficient balance
- Invalid addresses
- Token account errors
- **Invalid token mint addresses**

Errors are exposed through the `error` state and can be displayed to users.

## Dependencies

The hooks require the following dependencies (already included in the project):

- `@solana/wallet-adapter-react`
- `@solana/web3.js`
- `@solana/spl-token`

## TypeScript Support

All hooks are fully typed with TypeScript interfaces:

```typescript
interface WalletConnectionState {
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

interface TransactionState {
  isExecuting: boolean;
  signature: string | null;
  error: string | null;
  success: boolean;
}

interface UseSolanaWalletOptions {
  tokenMint?: string; // Custom token mint address for balance checking
  defaultTokenMint?: string; // Default token mint address for transfers
  paceAddress?: string; // Custom Pace Terminal address
}
```

## Best Practices

1. **Always check connection state** before attempting transactions
2. **Handle loading states** to provide good UX
3. **Display errors** to users in a user-friendly way
4. **Reset transaction state** after successful transactions
5. **Validate amounts** before sending transactions
6. **Use the demo component** as a reference for proper implementation
7. **Refresh balances** after transactions to show updated amounts
8. **Display network information** to help users understand the environment
9. **Validate token mint addresses** before using them
10. **Use appropriate decimal precision** for different tokens
11. **Provide fallback token addresses** for common tokens like USDC

## Security Considerations

- Never store private keys in the frontend
- Always use the wallet adapter for signing transactions
- Validate all user inputs before sending transactions
- Handle transaction failures gracefully
- Use proper error boundaries in React components
- Verify network before executing transactions
- Check token balances before transfers
- **Validate token mint addresses** before using them
- **Use appropriate decimal precision** for different tokens
- **Handle token account creation** for new recipients
