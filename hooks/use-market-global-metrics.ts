'use client';

import { useQuery } from '@tanstack/react-query';

import type { GlobalMetricsResponse } from '@/app/api/coinmarketcap/global-metrics/route';

/**
 * Hook to fetch global cryptocurrency market metrics from CoinMarketCap.
 * Includes total market cap, trading volume, and dominance data.
 */
export function useMarketGlobalMetrics() {
  return useQuery({
    queryKey: ['market-global-metrics'],
    queryFn: async (): Promise<GlobalMetricsResponse> => {
      const response = await fetch('/api/coinmarketcap/global-metrics');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch global metrics');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
