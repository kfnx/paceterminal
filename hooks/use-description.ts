'use client';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const fetchDescription = async (address: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('tokens')
    .select('description')
    .eq('address', address)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data?.description || null;
};

export function useDescription(address: string) {
  const {
    data: description = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['description', address],
    queryFn: () => fetchDescription(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    description,
    loading,
    error: error?.message || null,
    refetch,
  };
}
