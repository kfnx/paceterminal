import dynamic from 'next/dynamic';
import { RiEmotionSadFill } from '@remixicon/react';
import { motion } from 'framer-motion';

import { useFearGreedIndex } from '@/hooks/use-fear-greed-index';
import * as Divider from '@/components/ui/divider';

const GaugeComponent = dynamic(() => import('react-gauge-component'), {
  ssr: false,
});

// Helper function to determine sentiment color based on score
const getSentimentColor = (score: number): string => {
  if (score < 25) return '#E74C3C'; // Extreme Fear - Brighter Red
  if (score < 50) return '#F39C12'; // Fear - Brighter Orange
  if (score < 75) return '#F1C40F'; // Greed - Brighter Yellow
  return '#2ECC71'; // Extreme Greed - Brighter Green
};

// Helper function to get simplified sentiment label
const getSentiment = (score: number): string => {
  if (score < 25) return 'Extreme Fear';
  if (score < 50) return 'Fear';
  if (score < 75) return 'Greed';
  return 'Extreme Greed';
};

export default function FearGreedIndex() {
  const { data, isLoading, error } = useFearGreedIndex();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 shadow-regular-xs sm:p-4 md:p-6'
      >
        <div className='mb-2 flex items-center gap-2 sm:mb-3'>
          <RiEmotionSadFill size={20} className='text-text-sub-600 sm:size-6' />
          <p className='text-paragraph-md font-semibold text-text-strong-950'>
            Fear and Greed Index
          </p>
        </div>
        <div className='bg-gray-200 h-48 animate-pulse rounded' />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 shadow-regular-xs sm:p-4 md:p-6'
      >
        <div className='mb-2 flex items-center gap-2 sm:mb-3'>
          <RiEmotionSadFill size={20} className='text-text-sub-600 sm:size-6' />
          <p className='text-paragraph-md font-semibold text-text-strong-950'>
            Fear and Greed Index
          </p>
        </div>
        <Divider.Root variant='line-spacing' className='mb-2 sm:mb-3' />
        <div className='text-sm text-center text-error-base'>
          Failed to load data
        </div>
      </motion.div>
    );
  }

  const score = data?.value || 50;
  const sentiment = data?.classification || getSentiment(score);
  const sentimentColor = getSentimentColor(score);
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='w-full rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 shadow-regular-xs sm:p-4 md:p-6'
    >
      <div className='mb-2 flex items-center gap-2 sm:mb-3'>
        <RiEmotionSadFill size={20} className='text-text-sub-600 sm:size-6' />
        <p className='text-paragraph-md font-semibold text-text-strong-950'>
          Fear and Greed Index
        </p>
      </div>

      {/* Divider */}
      <Divider.Root variant='line-spacing' className='mb-2 sm:mb-3' />

      <div className='flex h-4/5 flex-col justify-center'>
        <motion.div
          key={score}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='flex flex-col'
        >
          {/* Now Label */}
          <div className='relative mb-2 flex items-baseline gap-2 sm:mb-3'>
            <span className='text-sm dark:text-gray-100 font-bold text-text-strong-950 sm:text-label-lg'>
              Now:
            </span>
            <span
              className='text-sm font-bold sm:text-label-lg'
              style={{ color: sentimentColor }}
            >
              {sentiment}
            </span>
          </div>

          {/* Gauge Chart */}
          <div className='relative mb-2 sm:mb-3'>
            <GaugeComponent
              id='gauge-component-fear-greed'
              type='semicircle'
              value={score}
              minValue={0}
              maxValue={100}
              arc={{
                gradient: true,
                width: 0.2,
                padding: 0.005,
                cornerRadius: 0,
                subArcs: [
                  {
                    limit: 25,
                    color: '#E74C3C', // Brighter Red
                    showTick: false,
                  },
                  {
                    limit: 50,
                    color: '#F39C12', // Brighter Orange
                    showTick: false,
                  },
                  {
                    limit: 75,
                    color: '#F1C40F', // Brighter Yellow
                    showTick: false,
                  },
                  {
                    limit: 100,
                    color: '#2ECC71', // Brighter Green
                    showTick: false,
                  },
                ],
              }}
              pointer={{
                type: 'arrow',
                elastic: true,
                color: sentimentColor,
                baseColor: sentimentColor,
                length: 0.1,
                animate: true,
                animationDuration: 1000,
                animationDelay: 0,
                width: 15,
              }}
              labels={{
                valueLabel: {
                  hide: true,
                },
                tickLabels: {
                  hideMinMax: true,
                  defaultTickValueConfig: {
                    hide: true,
                  },
                },
              }}
            />

            {/* Score Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className='-mt-10 flex justify-center sm:-mt-14'
            >
              <div
                className='shadow-md text-base sm:text-xl flex h-10 w-10 items-center justify-center rounded-full font-bold text-white sm:h-14 sm:w-14'
                style={{ backgroundColor: sentimentColor }}
              >
                {score}
              </div>
            </motion.div>
          </div>
          {/* Footer */}
          <div className='mt-2 flex items-center justify-between border-t border-stroke-soft-200 pt-2 sm:mt-3 sm:pt-3'>
            <span className='dark:text-gray-500 text-[10px] text-text-sub-600 sm:text-paragraph-xs'>
              Last updated: {lastUpdated}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Gauge Section */}
    </motion.div>
  );
}
