'use client';

import { motion } from 'framer-motion';
import { useMarketGlobalMetrics } from '@/hooks/use-market-global-metrics';

export default function BitcoinDominance() {
  const { data: metrics, isLoading, error } = useMarketGlobalMetrics();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 dark:border-neutral-800 dark:bg-neutral-900'
      >
        <div className='mb-3 flex items-center gap-1.5'>
          <i className='ri-pie-chart-2-line text-lg text-text-sub-600' />
          <h2 className='font-semibold text-text-strong-950 dark:text-gray-100 text-sm'>
            Bitcoin Dominance
          </h2>
        </div>
        <div className='h-32 animate-pulse rounded bg-gray-200' />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 dark:border-neutral-800 dark:bg-neutral-900'
      >
        <div className='mb-3 flex items-center gap-1.5'>
          <i className='ri-pie-chart-2-line text-lg text-text-sub-600' />
          <h2 className='font-semibold text-text-strong-950 dark:text-gray-100 text-sm'>
            Bitcoin Dominance
          </h2>
        </div>
        <div className='text-center text-sm text-error-base'>
          Failed to load data
        </div>
      </motion.div>
    );
  }

  const btcDominance = metrics?.btcDominance || 0;
  const ethDominance = metrics?.ethDominance || 0;
  const othersDominance = 100 - btcDominance - ethDominance;

  const data = {
    bitcoin: {
      percentage: Number(btcDominance.toFixed(1)),
      change: metrics?.btcDominanceChange24h || 0,
      color: '#F59E0B',
    },
    ethereum: {
      percentage: Number(ethDominance.toFixed(1)),
      change: metrics?.ethDominanceChange24h || 0,
      color: '#3B82F6',
    },
    others: {
      percentage: Number(othersDominance.toFixed(1)),
      change: 0, // Not provided by API
      color: '#9CA3AF',
    },
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'bg-green-100 text-green-600';
    if (change < 0) return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };

  const formatChange = (change: number) => {
    return change > 0 ? `+${change}%` : `${change}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex flex-col rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 dark:border-neutral-800 dark:bg-neutral-900'
    >
      {/* Header */}
      <div className='mb-3 flex items-center gap-1.5'>
        <i className='ri-pie-chart-2-line text-lg text-text-sub-600' />
        <h2 className='text-sm dark:text-gray-100 font-semibold text-text-strong-950'>
          Bitcoin Dominance
        </h2>
      </div>

      {/* Divider */}
      <div className='mb-3 h-px w-full bg-stroke-soft-200 dark:bg-neutral-800' />

      {/* Data Grid */}
      <div className='mb-3 grid grid-cols-3 gap-3'>
        {Object.entries(data).map(([key, item], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
            className='flex flex-col'
          >
            <div className='mb-1 flex items-center gap-1.5'>
              <div
                className='h-2 w-2 rounded-full'
                style={{ backgroundColor: item.color }}
              />
              <span className='text-xs dark:text-gray-400 capitalize text-text-sub-600'>
                {key}
              </span>
            </div>
            <span className='text-base dark:text-gray-100 font-semibold text-text-strong-950'>
              {item.percentage}%
            </span>
            <span
              className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${getChangeColor(item.change)}`}
            >
              {formatChange(item.change)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className='mb-3 flex h-1.5 w-full overflow-hidden rounded-full'
        style={{ transformOrigin: 'left' }}
      >
        <div
          className='h-full'
          style={{
            backgroundColor: data.bitcoin.color,
            width: `${data.bitcoin.percentage}%`,
          }}
        />
        <div
          className='h-full'
          style={{
            backgroundColor: data.ethereum.color,
            width: `${data.ethereum.percentage}%`,
          }}
        />
        <div
          className='h-full'
          style={{
            backgroundColor: data.others.color,
            width: `${data.others.percentage}%`,
          }}
        />
      </motion.div>

      {/* Divider */}
      <div className='mb-2 h-px w-full bg-stroke-soft-200 dark:bg-neutral-800' />

      {/* Footer */}
      <div className='flex items-center justify-between'>
        <span className='dark:text-gray-500 text-[10px] text-text-sub-600'>
          Data by CoinMarketCap
        </span>
        <button
          className='dark:text-gray-400 flex h-5 w-5 items-center justify-center rounded-full bg-bg-weak-50 text-text-sub-600 transition-colors hover:bg-bg-soft-200 dark:bg-neutral-800'
          aria-label='Info'
        >
          <i className='ri-information-line text-xs' />
        </button>
      </div>
    </motion.div>
  );
}
