'use client';

import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import {
  tokenSearchAtom,
  tokenSortFieldAtom,
  tokenSortOrderAtom,
  tokenTierFilterAtom,
} from '@/app/admin/tokens/filters';

export type Token = Tables<'tokens'>;

interface TokensResponse {
  data: Token[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const fetchTokens = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  tierFilter: string = 'all',
  sortField: string = 'created_at',
  sortOrder: string = 'desc',
): Promise<TokensResponse> => {
  // Calculate the range for pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Start building the query
  let query = supabase.from('tokens').select('*', { count: 'exact' });

  // Apply search filter
  if (search.trim()) {
    query = query.or(
      `name.ilike.%${search}%,address.ilike.%${search}%,label.ilike.%${search}%`,
    );
  }

  // Apply tier filter
  if (tierFilter !== 'all') {
    const tierMap: Record<string, number> = {
      s: 1,
      a: 2,
      b: 3,
      c: 4,
    };
    const tierValue = tierMap[tierFilter];
    if (tierValue !== undefined) {
      query = query.eq('tier', tierValue);
    }
  }

  // Apply sorting
  let orderBy = 'ordering';
  let ascending = true;

  if (sortField === 'name') {
    orderBy = 'name';
    ascending = sortOrder === 'asc';
  } else if (sortField === 'created_at') {
    orderBy = 'created_at';
    ascending = sortOrder === 'asc';
  } else if (sortField === 'tier') {
    orderBy = 'tier';
    ascending = sortOrder === 'asc';
  }

  // Apply ordering
  query = query.order(orderBy, { ascending });

  // Add secondary ordering for consistent results
  if (sortField !== 'created_at') {
    query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw error;
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

export function useTokens(page: number = 1, pageSize: number = 10) {
  const search = useAtomValue(tokenSearchAtom);
  const tierFilter = useAtomValue(tokenTierFilterAtom);
  const sortField = useAtomValue(tokenSortFieldAtom);
  const sortOrder = useAtomValue(tokenSortOrderAtom);

  const {
    data: tokensResponse,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'tokens',
      page,
      pageSize,
      search,
      tierFilter,
      sortField,
      sortOrder,
    ],
    queryFn: () =>
      fetchTokens(page, pageSize, search, tierFilter, sortField, sortOrder),
    staleTime: 30 * 60 * 1000, // 30 minutes - data stays fresh longer
    gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep in cache for a full day
  });

  return {
    tokens: tokensResponse?.data || [],
    total: tokensResponse?.total || 0,
    page: tokensResponse?.page || 1,
    pageSize: tokensResponse?.pageSize || 10,
    totalPages: tokensResponse?.totalPages || 0,
    loading,
    error: error?.message || null,
    refetch,
  };
}
