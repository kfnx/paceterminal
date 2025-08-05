'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type MetricDynamic = Tables<'metrics_dynamic'>;
export type MetricDynamicValue = Tables<'metrics_dynamic_values'>;

export interface MetricDynamicWithValues extends MetricDynamic {
  values: MetricDynamicValue[];
}

export async function fetchMetricsDynamic(
  address: string,
): Promise<MetricDynamicWithValues[]> {
  const { data: metrics, error: metricsError } = await supabase
    .from('metrics_dynamic')
    .select('*')
    .eq('address', address)
    .order('created_at', { ascending: false });
  console.log('metrics', address, metrics);

  if (metricsError) {
    throw new Error(`Failed to fetch dynamic metrics: ${metricsError.message}`);
  }

  if (!metrics || metrics.length === 0) {
    return [];
  }

  // Fetch values for each metric
  const metricsWithValues = await Promise.all(
    metrics.map(async (metric) => {
      const { data: values, error: valuesError } = await supabase
        .from('metrics_dynamic_values')
        .select('*')
        // .eq('metric_id', metric.id)
        .order('time', { ascending: true });

      if (valuesError) {
        console.error(
          `Failed to fetch values for metric ${metric.id}:`,
          valuesError,
        );
        return {
          ...metric,
          values: [],
        };
      }

      return {
        ...metric,
        values: values || [],
      };
    }),
  );

  return metricsWithValues;
}

export function useMetricsDynamic(address: string) {
  const {
    data: metricsDynamic = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['metrics-dynamic', address],
    queryFn: () => fetchMetricsDynamic(address),
    enabled: !!address,
  });

  return {
    metricsDynamic,
    loading,
    error: error?.message,
    refetch,
  };
}

interface CreateDynamicMetricParams {
  address: string;
  label_id: string;
  label_en?: string;
}

interface UpdateDynamicMetricParams {
  id: string;
  label_id: string;
  label_en?: string;
}

interface AddDynamicMetricValueParams {
  metric_id: string;
  value: number;
  time: string;
}

export function useCreateDynamicMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateDynamicMetricParams) => {
      const response = await fetch('/api/metrics-dynamic/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create dynamic metric');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch metrics dynamic for the address
      queryClient.invalidateQueries({
        queryKey: ['metrics-dynamic', variables.address],
      });
    },
  });
}

export function useUpdateDynamicMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateDynamicMetricParams) => {
      const response = await fetch('/api/metrics-dynamic/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update dynamic metric');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all metrics dynamic queries
      queryClient.invalidateQueries({
        queryKey: ['metrics-dynamic'],
      });
    },
  });
}

export function useDeleteDynamicMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/metrics-dynamic/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete dynamic metric');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all metrics dynamic queries
      queryClient.invalidateQueries({
        queryKey: ['metrics-dynamic'],
      });
    },
  });
}

export function useAddDynamicMetricValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddDynamicMetricValueParams) => {
      const response = await fetch('/api/metrics-dynamic/add-value', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add dynamic metric value');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all metrics dynamic queries
      queryClient.invalidateQueries({
        queryKey: ['metrics-dynamic'],
      });
    },
  });
}
