'use client';

import React from 'react';
import { RiInformationLine, RiLineChartLine } from '@remixicon/react';
import { motion } from 'framer-motion';

import { useAltseasonIndex } from '@/hooks/use-altseason-index';
import * as Divider from '@/components/ui/divider';

export default function AltcoinSeasonWidget() {
  const { data: altseasonData, isLoading, error } = useAltseasonIndex();

  if (isLoading) {
    return (
      <motion.div
        className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs sm:p-6'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className='mb-3 flex items-center gap-2'>
          <RiLineChartLine className='text-lg text-text-sub-600' />
          <h3 className='text-title-h6 text-text-strong-950'>
            Altseason Index
          </h3>
        </div>
        <div className='bg-gray-200 h-24 animate-pulse rounded' />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs sm:p-6'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className='mb-3 flex items-center gap-2'>
          <RiLineChartLine className='text-lg text-text-sub-600' />
          <h3 className='text-title-h6 text-text-strong-950'>
            Altseason Index
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
      className='w-full rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 shadow-regular-xs sm:p-4 md:p-6'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className='mb-2 flex items-center gap-2 sm:mb-3'>
        <RiInformationLine className='text-base text-text-sub-600 sm:text-lg' />
        <h3 className='text-base font-semibold text-text-strong-950 sm:text-title-h6'>
          Altseason Index
        </h3>
      </div>

      {/* Divider */}
      <Divider.Root variant='line-spacing' className='mb-2 sm:mb-3' />

      {/* Value Section */}
      <div className='mb-2 flex flex-col gap-2 sm:mb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0'>
        <div className='flex items-baseline'>
          <p className='text-2xl font-semibold text-text-strong-950 sm:text-4xl'>
            {value}
          </p>
          <p className='ml-1 text-sm text-text-sub-600 sm:text-label-md'>/100</p>
        </div>

        <div
          className={`self-start rounded-full px-2 py-0.5 text-xs font-medium sm:px-3 sm:py-1 sm:text-label-sm ${labelColor}`}
        >
          {label}
        </div>
      </div>

      {/* Season Range */}
      <div className='mb-1 flex justify-between text-[10px] text-text-sub-600 sm:text-paragraph-xs'>
        <span>Bitcoin Season</span>
        <span>Altcoin Season</span>
      </div>

      {/* Progress Bar */}
      <div className='relative h-1.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-200 to-blue-500 sm:h-2'>
        <motion.div
          className='shadow-md absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-text-strong-950 sm:h-4 sm:w-4 sm:border-[3px]'
          initial={{ left: '0%' }}
          animate={{ left: `${thumbPosition}%` }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        />
      </div>

      {/* Info Footer */}
      <div className='mt-2 flex flex-col gap-1 border-t border-stroke-soft-200 pt-2 sm:mt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-3'>
        <div className='flex items-center gap-1 text-[10px] text-text-sub-600 sm:text-paragraph-xs'>
          <RiInformationLine className='h-3 w-3 sm:h-4 sm:w-4' />
          <span>
            {coinsOutperforming}/{coinsAnalyzed} coins outperforming BTC
          </span>
        </div>
        <span className='text-[10px] font-medium text-text-strong-950 sm:text-paragraph-xs'>
          {percentageOutperforming.toFixed(1)}%
        </span>
      </div>
    </motion.div>
  );
}
