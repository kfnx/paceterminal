'use client';

import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Metric = Tables<'metrics_static'>;

export async function fetchMetrics(address: string): Promise<Metric[]> {
  const { data, error } = await supabase
    .from('metrics_static')
    .select('*')
    .eq('address', address)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch metrics: ${error.message}`);
  }

  return data || [];
}

export function useMetrics(address: string) {
  const {
    data: metrics = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['metrics', address],
    queryFn: () => fetchMetrics(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    metrics,
    loading,
    error: error?.message,
    refetch,
  };
}
