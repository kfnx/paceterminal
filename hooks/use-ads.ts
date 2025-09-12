'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';

export type Ad = Tables<'ads'>;

interface AdsResponse {
  ads: Ad[];
}

const fetchAds = async (): Promise<Ad[]> => {
  const response = await fetch('/api/ads');
  if (!response.ok) {
    throw new Error('Failed to fetch ads');
  }
  const data: AdsResponse = await response.json();
  return data.ads;
};


const createOrUpdateAd = async (params: {
  position: string;
  image_url: string;
  target_url?: string;
}): Promise<Ad> => {
  const response = await fetch('/api/ads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to save ad');
  }

  const data = await response.json();
  return data.ad;
};

const deleteAd = async (position: string): Promise<void> => {
  const response = await fetch(`/api/ads?position=${position}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete ad');
  }
};

export function useAds() {
  const {
    data: ads = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['ads'],
    queryFn: fetchAds,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    ads,
    loading,
    error: error?.message || null,
    refetch,
  };
}


export function useCreateOrUpdateAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrUpdateAd,
    onSuccess: async () => {
      // Refetch ads immediately
      await queryClient.refetchQueries({ queryKey: ['ads'] });
    },
  });
}

export function useDeleteAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAd,
    onSuccess: async () => {
      // Refetch ads immediately
      await queryClient.refetchQueries({ queryKey: ['ads'] });
    },
  });
}

export function useAdByPosition(position: string): Ad | null {
  const { ads } = useAds();
  return ads.find((ad) => ad.position === position) || null;
}
