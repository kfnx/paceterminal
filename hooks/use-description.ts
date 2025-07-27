'use client';

import { useTranslation } from '@/contexts/translation-context';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const fetchDescription = async (
  address: string,
): Promise<{ description: string | null; description_en: string | null }> => {
  const { data, error } = await supabase
    .from('tokens')
    .select('description, description_en')
    .eq('address', address)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return { description: null, description_en: null };
    }
    throw error;
  }

  return {
    description: data?.description || null,
    description_en: data?.description_en || null,
  };
};

export function useDescription(address: string) {
  const { locale } = useTranslation();

  const {
    data: descriptionData = { description: null, description_en: null },
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['description', address],
    queryFn: () => fetchDescription(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Return the appropriate description based on locale
  const description =
    locale === 'en' && descriptionData.description_en
      ? descriptionData.description_en
      : descriptionData.description;

  return {
    description,
    loading,
    error: error?.message || null,
    refetch,
  };
}
