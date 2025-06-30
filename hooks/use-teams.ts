'use client';

import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Team = Tables<'teams'>;

const fetchTeams = async (address: string): Promise<Team[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('address', address)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};

export function useTeams(address: string) {
  const {
    data: teams = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['teams', address],
    queryFn: () => fetchTeams(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    teams,
    loading,
    error: error?.message || null,
    refetch,
  };
}
