import { useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

export type NetworkType =
  | 'mainnet-beta'
  | 'devnet'
  | 'testnet'
  | 'localnet'
  | 'custom';

export interface NetworkInfo {
  type: NetworkType;
  name: string;
  endpoint: string;
  isMainnet: boolean;
  isDevnet: boolean;
  isTestnet: boolean;
  isLocalnet: boolean;
  description: string;
  color: string;
  bgColor: string;
}

export function useNetworkInfo(): NetworkInfo {
  const { connection } = useConnection();

  const getNetworkInfo = useCallback((endpoint: string): NetworkInfo => {
    if (endpoint.includes('mainnet')) {
      return {
        type: 'mainnet-beta',
        name: 'Mainnet Beta',
        endpoint,
        isMainnet: true,
        isDevnet: false,
        isTestnet: false,
        isLocalnet: false,
        description: 'Production network with real SOL',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
      };
    }

    if (endpoint.includes('devnet')) {
      return {
        type: 'devnet',
        name: 'Devnet',
        endpoint,
        isMainnet: false,
        isDevnet: true,
        isTestnet: false,
        isLocalnet: false,
        description: 'Test network for development and testing',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200',
      };
    }

    if (endpoint.includes('testnet')) {
      return {
        type: 'testnet',
        name: 'Testnet',
        endpoint,
        isMainnet: false,
        isDevnet: false,
        isTestnet: true,
        isLocalnet: false,
        description: 'Experimental network for testing',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
      };
    }

    if (endpoint.includes('localhost') || endpoint.includes('127.0.0.1')) {
      return {
        type: 'localnet',
        name: 'Localnet',
        endpoint,
        isMainnet: false,
        isDevnet: false,
        isTestnet: false,
        isLocalnet: true,
        description: 'Local development network',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 border-gray-200',
      };
    }

    return {
      type: 'custom',
      name: 'Custom Network',
      endpoint,
      isMainnet: false,
      isDevnet: false,
      isTestnet: false,
      isLocalnet: false,
      description: 'Custom RPC endpoint',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200',
    };
  }, []);

  return getNetworkInfo(connection.rpcEndpoint);
}
