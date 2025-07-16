import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const fetchMembers = async () => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Error fetching members: ${error.message}`);
  }

  return data || [];
};

export function useMembers() {
  const {
    data: members = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    members,
    loading,
    error: error?.message || null,
    refetch,
  };
}
