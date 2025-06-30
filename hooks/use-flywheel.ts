'use client';

import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Flywheel = Tables<'flywheels'>;

const fetchFlywheel = async (address: string): Promise<Flywheel | null> => {
  const { data, error } = await supabase
    .from('flywheels')
    .select('*')
    .eq('address', address)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data;
};

export function useFlywheel(address: string) {
  const {
    data: flywheel = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['flywheel', address],
    queryFn: () => fetchFlywheel(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    flywheel,
    loading,
    error: error?.message || null,
    refetch,
  };
}
