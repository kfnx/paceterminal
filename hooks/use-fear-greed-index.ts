'use client';

import { useQuery } from '@tanstack/react-query';
import type { FearGreedIndexResponse } from '@/app/api/coinmarketcap/fear-greed/route';

/**
 * Hook to fetch the CMC Crypto Fear and Greed Index.
 * Returns a value from 0-100 with a classification (Extreme Fear to Extreme Greed).
 */
export function useFearGreedIndex() {
  return useQuery({
    queryKey: ['fear-greed-index'],
    queryFn: async (): Promise<FearGreedIndexResponse> => {
      const response = await fetch('/api/coinmarketcap/fear-greed');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || 'Failed to fetch Fear and Greed Index',
        );
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
