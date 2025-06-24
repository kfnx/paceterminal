'use client';

import { RiGlobalLine, RiAlertLine } from '@remixicon/react';
import { useNetworkInfo } from '@/hooks/use-network-info';

export function NetworkStatus() {
  const networkInfo = useNetworkInfo();

  return (
    <div className="flex items-center gap-2">
      <RiGlobalLine className={networkInfo.color} />
      <span className={`text-sm font-medium ${networkInfo.color}`}>
        {networkInfo.name}
      </span>
      {networkInfo.isMainnet && (
        <RiAlertLine className="text-xs text-red-500" />
      )}
    </div>
  );
}

// Example usage in other components:
export function NetworkAwareComponent() {
  const networkInfo = useNetworkInfo();

  // You can conditionally render based on network
  if (networkInfo.isDevnet) {
    return (
      <div className="rounded border border-orange-200 bg-orange-50 p-4">
        <p className="text-sm text-orange-800">
          ⚠️ You&apos;re on Devnet. This is for testing only.
        </p>
      </div>
    );
  }

  if (networkInfo.isMainnet) {
    return (
      <div className="rounded border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-800">
          ✅ You&apos;re on Mainnet. Real transactions will be executed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-gray-200 rounded border p-4">
      <p className="text-gray-800 text-sm">
        ℹ️ Connected to {networkInfo.name}
      </p>
    </div>
  );
} 