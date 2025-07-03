'use client';

import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Alpha = Tables<'alpha'>;

const fetchAlpha = async (address: string): Promise<Alpha[]> => {
  const { data, error } = await supabase
    .from('alpha')
    .select('*')
    .eq('address', address)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export function useAlpha(address: string) {
  const {
    data: alpha = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['alpha', address],
    queryFn: () => fetchAlpha(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    alpha,
    loading,
    error: error?.message || null,
    refetch,
  };
}
