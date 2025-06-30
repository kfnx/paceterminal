'use client';

import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Token = Tables<'tokens'>;

const fetchTokens = async (): Promise<Token[]> => {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .order('ordering', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export function useTokens() {
  const {
    data: tokens = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    staleTime: 30 * 60 * 1000, // 30 minutes - data stays fresh longer
    gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep in cache for a full day
  });

  return {
    tokens,
    loading,
    error: error?.message || null,
    refetch,
  };
}
