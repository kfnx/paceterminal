'use client';

import { useQuery } from '@tanstack/react-query';
import type { TopCryptocurrenciesResponse } from '@/app/api/coinmarketcap/top-cryptocurrencies/route';

/**
 * Hook to fetch top 3 cryptocurrencies by market cap from CoinMarketCap.
 * Includes price, market cap, volume, and percentage changes.
 */
export function useTopCryptocurrencies() {
  return useQuery({
    queryKey: ['top-cryptocurrencies'],
    queryFn: async (): Promise<TopCryptocurrenciesResponse> => {
      const response = await fetch('/api/coinmarketcap/top-cryptocurrencies');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || 'Failed to fetch top cryptocurrencies',
        );
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
