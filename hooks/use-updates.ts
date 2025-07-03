'use client';

import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Update = Tables<'updates'>;

const fetchUpdates = async (address: string): Promise<Update[]> => {
  const { data, error } = await supabase
    .from('updates')
    .select('*')
    .eq('address', address)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export function useUpdates(address: string) {
  const {
    data: updates = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['updates', address],
    queryFn: () => fetchUpdates(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    updates,
    loading,
    error: error?.message || null,
    refetch,
  };
}
