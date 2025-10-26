'use client';

import { RiPieChart2Line } from '@remixicon/react';
import { motion } from 'framer-motion';

import { useMarketGlobalMetrics } from '@/hooks/use-market-global-metrics';

export default function BitcoinDominance() {
  const { data: metrics, isLoading, error } = useMarketGlobalMetrics();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='flex flex-col rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs sm:p-6'
      >
        <div className='mb-3 flex items-center gap-2'>
          <RiPieChart2Line className='text-lg text-text-sub-600' />
          <h2 className='text-title-h6 text-text-strong-950'>
            Bitcoin Dominance
          </h2>
        </div>
        <div className='bg-gray-200 h-32 animate-pulse rounded' />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='flex flex-col rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs sm:p-6'
      >
        <div className='mb-3 flex items-center gap-2'>
          <RiPieChart2Line className='text-lg text-text-sub-600' />
          <h2 className='text-title-h6 text-text-strong-950'>
            Bitcoin Dominance
          </h2>
        </div>
        <div className='text-sm text-center text-error-base'>
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
      transition={{ duration: 0.4 }}
      className='flex flex-col rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs sm:p-6'
    >
      {/* Header */}
      <div className='mb-3 flex items-center gap-2'>
        <RiPieChart2Line className='text-lg text-text-sub-600' />
        <h2 className='text-title-h6 text-text-strong-950'>
          Bitcoin Dominance
        </h2>
      </div>

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
    </motion.div>
  );
}
