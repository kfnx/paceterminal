# Network Information Guide

This guide explains how to get and use current network information (devnet/mainnet) in your Solana application.

## Overview

The application provides several ways to access network information:

1. **`useNetworkInfo` Hook** - Programmatic access to network details
2. **`ConnectionWidget` Component** - Visual display of network information
3. **Network-aware components** - Conditional rendering based on network

## Current Network Configuration

Based on your `app/wallet-providers.tsx`, the current network is set to:

```typescript
const NETWORK = 'https://api.devnet.solana.com';
// const NETWORK = 'https://mainnet.helius-rpc.com/?api-key=d5ce36ae-e878-4394-ba0b-01b70b908a3f';
```

This means your application is currently connected to **Solana Devnet**.

## Using the `useNetworkInfo` Hook

### Basic Usage

```typescript
import { useNetworkInfo } from '@/hooks/use-network-info';

function MyComponent() {
  const networkInfo = useNetworkInfo();

  return (
    <div>
      <p>Current Network: {networkInfo.name}</p>
      <p>Endpoint: {networkInfo.endpoint}</p>
      <p>Description: {networkInfo.description}</p>
    </div>
  );
}
```

### Network Information Object

The `useNetworkInfo` hook returns a `NetworkInfo` object with the following properties:

```typescript
interface NetworkInfo {
  type: 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet' | 'custom';
  name: string; // "Mainnet Beta", "Devnet", etc.
  endpoint: string; // RPC endpoint URL
  isMainnet: boolean; // true if mainnet
  isDevnet: boolean; // true if devnet
  isTestnet: boolean; // true if testnet
  isLocalnet: boolean; // true if localnet
  description: string; // Human-readable description
  color: string; // Tailwind color class
  bgColor: string; // Tailwind background color class
}
```

### Conditional Rendering Examples

```typescript
function NetworkAwareComponent() {
  const networkInfo = useNetworkInfo();

  // Show different content based on network
  if (networkInfo.isDevnet) {
    return (
      <div className="bg-orange-50 border border-orange-200 p-4 rounded">
        <p className="text-orange-800">
          ⚠️ You're on Devnet - use test SOL only
        </p>
      </div>
    );
  }

  if (networkInfo.isMainnet) {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded">
        <p className="text-green-800">
          ✅ You're on Mainnet - real SOL transactions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded">
      <p className="text-gray-800">
        ℹ️ Connected to {networkInfo.name}
      </p>
    </div>
  );
}
```

## Using the `ConnectionWidget` Component

The `ConnectionWidget` provides a visual display of network information:

```typescript
import { ConnectionWidget } from '@/components/connection-widget';

function MyPage() {
  return (
    <div>
      <h1>My Solana App</h1>
      <ConnectionWidget />
      {/* Other content */}
    </div>
  );
}
```

### Features

- **Network Name**: Shows "Mainnet Beta", "Devnet", etc.
- **RPC Endpoint**: Displays the full endpoint URL
- **Network Description**: Explains what the network is for
- **Color Coding**: Different colors for different networks
- **Refresh Button**: Reloads the page to refresh connection

## Network Types and Colors

| Network  | Type           | Color  | Background | Description                      |
| -------- | -------------- | ------ | ---------- | -------------------------------- |
| Mainnet  | `mainnet-beta` | Green  | Green      | Production network with real SOL |
| Devnet   | `devnet`       | Orange | Orange     | Test network for development     |
| Testnet  | `testnet`      | Blue   | Blue       | Experimental network for testing |
| Localnet | `localnet`     | Gray   | Gray       | Local development network        |
| Custom   | `custom`       | Gray   | Gray       | Custom RPC endpoint              |

## Switching Networks

To switch between networks, modify the `NETWORK` constant in `app/wallet-providers.tsx`:

```typescript
// For Devnet (current)
const NETWORK = 'https://api.devnet.solana.com';

// For Mainnet
const NETWORK = 'https://api.mainnet-beta.solana.com';

// For custom RPC (e.g., Helius)
const NETWORK = 'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY';
```

## Network-Specific Features

### Devnet Features

- Free SOL available from faucets
- Test tokens for development
- No real value at risk
- Faster transaction processing

### Mainnet Features

- Real SOL and tokens
- Production environment
- Real value at risk
- Slower transaction processing

## Best Practices

1. **Always check the network** before executing transactions
2. **Use appropriate warnings** for mainnet vs devnet
3. **Test on devnet first** before deploying to mainnet
4. **Display network information** prominently in your UI
5. **Use conditional rendering** to show network-specific content

## Example: Network-Aware Transaction Component

```typescript
function TransactionComponent() {
  const networkInfo = useNetworkInfo();
  const [amount, setAmount] = useState('');

  const handleTransaction = () => {
    if (networkInfo.isMainnet) {
      // Show confirmation dialog for real transactions
      if (!confirm('This will send real SOL. Are you sure?')) {
        return;
      }
    }

    // Execute transaction
    executeTransaction(amount);
  };

  return (
    <div>
      <div className={`p-3 rounded border ${networkInfo.bgColor}`}>
        <p className={`text-sm ${networkInfo.color}`}>
          Connected to {networkInfo.name}
        </p>
      </div>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in SOL"
      />

      <button onClick={handleTransaction}>
        {networkInfo.isMainnet ? 'Send Real SOL' : 'Send Test SOL'}
      </button>

      {networkInfo.isMainnet && (
        <p className="text-red-600 text-sm">
          ⚠️ This will send real SOL with real value
        </p>
      )}
    </div>
  );
}
```

## Integration with Existing Hooks

The network information is already integrated with your existing wallet hooks:

```typescript
// useWalletConnection already provides network info
const {
  network,        // 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet'
  endpoint,       // RPC endpoint
  // ... other properties
} = useWalletConnection();

// useSolanaWallet also includes network info
const {
  network,
  endpoint,
  // ... other properties
} = useSolanaWallet();
```

This ensures consistency across your application when accessing network information.
