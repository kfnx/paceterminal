import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Member = Tables<'members'>;

interface MembersResponse {
  data: Member[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const fetchMembers = async (
  page: number = 1,
  pageSize: number = 10,
): Promise<MembersResponse> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('members')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: true });

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Error fetching members: ${error.message}`);
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data || [],
    total,
    page,
    pageSize,
    totalPages,
  };
};

export function useMembers(page: number = 1, pageSize: number = 10) {
  const {
    data: membersResponse,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['members', page, pageSize],
    queryFn: () => fetchMembers(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    members: membersResponse?.data || [],
    total: membersResponse?.total || 0,
    page: membersResponse?.page || 1,
    pageSize: membersResponse?.pageSize || 10,
    totalPages: membersResponse?.totalPages || 1,
    loading,
    error: error?.message || null,
    refetch,
  };
}
