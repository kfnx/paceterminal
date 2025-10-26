'use client';

import { useQuery } from '@tanstack/react-query';

import type { AltseasonIndexResponse } from '@/app/api/coinmarketcap/altseason-index/route';

/**
 * Hook to fetch the Altseason Index.
 * Compares top 100 coins' 90-day performance against Bitcoin.
 * Returns index from 1-100 where:
 * - 75-100: Altcoin Season (most coins outperforming BTC)
 * - 50-75: Mild Altcoin Season
 * - 25-50: Bitcoin Season
 * - 0-25: Extreme Bitcoin Season
 *
 * Refreshes daily per CoinMarketCap methodology.
 */
export function useAltseasonIndex() {
  return useQuery({
    queryKey: ['altseason-index'],
    queryFn: async (): Promise<AltseasonIndexResponse> => {
      const response = await fetch('/api/coinmarketcap/altseason-index');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch Altseason Index');
      }

      return response.json();
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
    retry: 2,
  });
}
