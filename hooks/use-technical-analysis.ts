'use client';

import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type TechnicalAnalysis = Tables<'technical_analysis'>;

const fetchTechnicalAnalysis = async (
  address: string,
): Promise<TechnicalAnalysis[]> => {
  const { data, error } = await supabase
    .from('technical_analysis')
    .select('*')
    .eq('address', address)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export function useTechnicalAnalysis(address: string) {
  const {
    data: technicalAnalysis = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['technical-analysis', address],
    queryFn: () => fetchTechnicalAnalysis(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    technicalAnalysis,
    loading,
    error: error?.message || null,
    refetch,
  };
}
