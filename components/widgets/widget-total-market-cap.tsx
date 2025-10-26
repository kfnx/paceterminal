'use client';

import { RiBarChartBoxFill } from '@remixicon/react';
import { motion } from 'framer-motion';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useMarketGlobalMetrics } from '@/hooks/use-market-global-metrics';

// Mock chart data - would need historical API endpoint for real data
const generateMockChartData = (currentValue: number, change24h: number) => {
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const baseValue = currentValue / (1 + change24h / 100);

  return months.map((month, index) => {
    const progress = index / (months.length - 1);
    const value = baseValue + (currentValue - baseValue) * progress;
    const randomVariation = (Math.random() - 0.5) * 0.1 * currentValue;
    return {
      month,
      value: (value + randomVariation) / 1e12, // Convert to trillions
    };
  });
};

export default function TotalMarketCapWidget() {
  const { data: metrics, isLoading, error } = useMarketGlobalMetrics();

  if (isLoading) {
    return (
      <motion.div
        className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className='mb-3 flex items-center gap-2'>
          <RiBarChartBoxFill className='text-lg text-text-sub-600' />
          <h3 className='text-title-h6 text-text-strong-950'>
            Total Market Cap
          </h3>
        </div>
        <div className='space-y-4'>
          <div className='bg-gray-200 h-10 w-48 animate-pulse rounded' />
          <div className='flex gap-1'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className='bg-gray-200 h-8 w-12 animate-pulse rounded'
              />
            ))}
          </div>
          <div className='bg-gray-200 h-40 w-full animate-pulse rounded' />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className='mb-3 flex items-center gap-2'>
          <RiBarChartBoxFill className='text-lg text-text-sub-600' />
          <h3 className='text-title-h6 text-text-strong-950'>
            Total Market Cap
          </h3>
        </div>
        <div className='text-sm py-6 text-center text-error-base'>
          Failed to load data
        </div>
      </motion.div>
    );
  }

  const totalMarketCapInTrillions = (metrics?.totalMarketCap || 0) / 1e12;
  const change24h = metrics?.totalMarketCapChange24h || 0;
  const isPositive = change24h >= 0;
  const chartData = generateMockChartData(
    metrics?.totalMarketCap || 0,
    change24h,
  );

  return (
    <motion.div
      className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className='mb-3 flex items-center gap-2'>
        <RiBarChartBoxFill className='text-lg text-text-sub-600' />
        <h3 className='text-title-h6 text-text-strong-950'>Total Market Cap</h3>
      </div>

      {/* Value */}
      <div className='mb-2 flex items-baseline gap-2'>
        <p className='text-3xl font-semibold text-text-strong-950'>
          ${totalMarketCapInTrillions.toFixed(2)}{' '}
          <span className='text-xl text-text-sub-700 font-medium'>
            Trillion
          </span>
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-label-sm font-medium ${
            isPositive
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {isPositive ? '+' : ''}
          {change24h.toFixed(2)}%
        </span>
      </div>

      {/* Range buttons */}
      {/* <div className='mb-4 flex items-center gap-1'>
        {['1D', '1W', '1M', '3M', '6M', '1Y'].map((range) => (
          <button
            key={range}
            className={`rounded-md px-3 py-1 text-label-sm font-medium ${
              range === '6M'
                ? 'bg-bg-white-100 text-text-strong-950'
                : 'text-text-sub-600 transition hover:text-text-strong-950'
            }`}
          >
            {range}
          </button>
        ))}
      </div> */}

      {/* Chart */}
      <div className='h-40 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={chartData}>
            <XAxis
              dataKey='month'
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [
                `$${value.toFixed(2)}T`,
                'Market Cap',
              ]}
            />
            <Line
              type='monotone'
              dataKey='value'
              stroke='#2563EB' // blue-600
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
