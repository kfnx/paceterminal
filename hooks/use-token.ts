'use client';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Token } from '@/hooks/use-tokens';

export function useToken(address: string, includeArchived = false) {
  return useQuery({
    queryKey: ['token', address, includeArchived],
    queryFn: async (): Promise<Token | null> => {
      let query = supabase.from('tokens').select('*').eq('address', address);

      if (!includeArchived) {
        query = query.is('archived_at', null);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      return data;
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
