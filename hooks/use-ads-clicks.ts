'use client';

import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';

export type AdClick = Tables<'ads_clicks'>;

interface AdsClicksResponse {
  adsClicks: AdClick[];
  stats: {
    totalClicks: number;
    leftClicks: number;
    rightClicks: number;
    uniqueAds: number;
  };
}

const fetchAdsClicks = async (): Promise<AdsClicksResponse> => {
  const response = await fetch('/api/ads/clicks');
  if (!response.ok) {
    throw new Error('Failed to fetch ads clicks');
  }
  return response.json();
};

export function useAdsClicks() {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['ads-clicks'],
    queryFn: fetchAdsClicks,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    adsClicks: data?.adsClicks || [],
    stats: data?.stats || {
      totalClicks: 0,
      leftClicks: 0,
      rightClicks: 0,
      uniqueAds: 0,
    },
    loading,
    error: error?.message || null,
    refetch,
  };
}
