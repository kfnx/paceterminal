'use client';

import React from 'react';
import { RiExchangeDollarFill, RiInformationLine } from '@remixicon/react';
import { motion } from 'framer-motion';

import { useAltseasonIndex } from '@/hooks/use-altseason-index';

export default function AltcoinSeasonWidget() {
  const { data: altseasonData, isLoading, error } = useAltseasonIndex();

  if (isLoading) {
    return (
      <motion.div
        className='w-full max-w-md rounded-20 bg-bg-white-0 p-4 shadow-regular-sm'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className='mb-3 flex items-center gap-2'>
          <RiExchangeDollarFill className='text-lg text-text-sub-600' />
          <h3 className='text-title-h6 text-text-strong-950'>
            Indeks Altcoin Season CMC
          </h3>
        </div>
        <div className='bg-gray-200 h-24 animate-pulse rounded' />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className='w-full max-w-md rounded-20 bg-bg-white-0 p-4 shadow-regular-sm'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className='mb-3 flex items-center gap-2'>
          <RiExchangeDollarFill className='text-lg text-text-sub-600' />
          <h3 className='text-title-h6 text-text-strong-950'>
            Indeks Altcoin Season CMC
          </h3>
        </div>
        <div className='text-sm text-center text-error-base'>
          Failed to load data
        </div>
      </motion.div>
    );
  }

  // Get altseason index from API
  const value = altseasonData?.index || 50;
  const coinsAnalyzed = altseasonData?.coinsAnalyzed || 0;
  const coinsOutperforming = altseasonData?.coinsOutperforming || 0;
  const percentageOutperforming = altseasonData?.percentageOutperforming || 0;

  // Determine label and color based on value (CMC methodology)
  let label = '';
  let labelColor = '';

  if (value >= 75) {
    label = 'Extreme Altcoin Season';
    labelColor = 'bg-blue-600 text-white';
  } else if (value >= 50) {
    label = 'Altcoin Season';
    labelColor = 'bg-blue-500 text-white';
  } else if (value >= 25) {
    label = 'Bitcoin Season';
    labelColor = 'bg-orange-500 text-white';
  } else {
    label = 'Extreme Bitcoin Season';
    labelColor = 'bg-orange-600 text-white';
  }

  // Calculate thumb position in %
  const thumbPosition = Math.min(Math.max(value, 0), 100);

  return (
    <motion.div
      className='w-full max-w-md rounded-20 bg-bg-white-0 p-4 shadow-regular-sm'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className='mb-3 flex items-center gap-2'>
        <RiExchangeDollarFill className='text-lg text-text-sub-600' />
        <h3 className='text-title-h6 text-text-strong-950'>
          Indeks Altcoin Season CMC
        </h3>
      </div>

      {/* Value Section */}
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-baseline'>
          <p className='text-4xl font-semibold text-text-strong-950'>{value}</p>
          <p className='ml-1 text-label-md text-text-sub-600'>/100</p>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-label-sm font-medium ${labelColor}`}
        >
          {label}
        </div>
      </div>

      {/* Season Range */}
      <div className='mb-1 flex justify-between text-paragraph-xs text-text-sub-600'>
        <span>Bitcoin Season</span>
        <span>Altcoin Season</span>
      </div>

      {/* Progress Bar */}
      <div className='relative h-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-200 to-blue-500'>
        <motion.div
          className='shadow-md absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-[3px] border-white bg-text-strong-950'
          initial={{ left: '0%' }}
          animate={{ left: `${thumbPosition}%` }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        />
      </div>

      {/* Info Footer */}
      <div className='mt-3 flex items-center justify-between border-t border-stroke-soft-200 pt-3'>
        <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
          <RiInformationLine className='h-4 w-4' />
          <span>
            {coinsOutperforming}/{coinsAnalyzed} coins outperforming BTC
          </span>
        </div>
        <span className='text-paragraph-xs font-medium text-text-strong-950'>
          {percentageOutperforming.toFixed(1)}%
        </span>
      </div>
    </motion.div>
  );
}
