'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Token = Tables<'tokens'>;

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tokens')
        .select('*')
        .order('ordering', { ascending: true })
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setTokens(data || []);
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens, loading, error, refetch: fetchTokens };
}
