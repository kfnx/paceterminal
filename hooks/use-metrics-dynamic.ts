'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type MetricDynamic = Tables<'metrics_dynamic'>;
export type MetricDynamicValue = Pick<
  Tables<'metrics_dynamic_values'>,
  'time' | 'value'
>;

export interface MetricDynamicWithValues extends MetricDynamic {
  values: MetricDynamicValue[];
  last: {
    time: string;
    value: number;
    percentChange: number;
  };
}

export async function fetchMetricsDynamic(
  address: string,
): Promise<MetricDynamicWithValues[]> {
  const { data: metrics, error: metricsError } = await supabase
    .from('metrics_dynamic')
    .select('*')
    .eq('address', address)
    .order('ordering', { ascending: true });

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
        .select('value, time')
        .eq('metric_id', metric.id)
        .order('time', { ascending: true });

      let last = {
        time: '',
        value: 0,
        percentChange: 0,
      };
      if (valuesError) {
        console.error(
          `Failed to fetch values for metric ${metric.id}:`,
          valuesError,
        );
        return {
          ...metric,
          values: [],
          last,
        };
      }

      // calc latest value for frontend
      if (values.length < 1) {
        return {
          ...metric,
          values: [],
          last,
        };
      }

      last.time = values[values.length - 1].time;
      last.value = values[values.length - 1].value;
      if (values.length >= 2) {
        const currentValue = values[values.length - 1].value;
        const previousValue = values[values.length - 2].value;
        last.percentChange =
          previousValue !== 0
            ? ((currentValue - previousValue) / previousValue) * 100
            : 0;
      }

      const metricResult: MetricDynamicWithValues = {
        ...metric,
        values,
        last,
      };

      return metricResult;
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
  label: string;
  label_en?: string;
  ordering?: number;
  unit?: string;
  unit_en?: string;
  source?: string;
}

interface UpdateDynamicMetricParams {
  id: string;
  label: string;
  label_en?: string;
  ordering?: number;
  unit?: string;
  unit_en?: string;
  source?: string;
}

interface AddDynamicMetricValueParams {
  metric_id: string;
  value: number;
  time: string;
}

interface DeleteDynamicMetricValueParams {
  metric_id: string;
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

export function useDeleteDynamicMetricValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: DeleteDynamicMetricValueParams) => {
      const response = await fetch('/api/metrics-dynamic/delete-value', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete dynamic metric value');
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
