'use client';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Token } from '@/hooks/use-tokens';

/**
 * Hook to fetch all tokens for display in sidebar and navigation.
 * Returns tokens ordered by their ordering field.
 */
export function useAllTokens() {
  return useQuery({
    queryKey: ['all-tokens'],
    queryFn: async (): Promise<Token[]> => {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .order('ordering', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
