'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/translation-context';
import { RiCloseLine } from '@remixicon/react';
import { motion } from 'framer-motion';

export function PaceTokenBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { locale } = useTranslation();

  if (!isVisible) return null;

  const benefits =
    locale === 'id'
      ? [
          'Analisis Token ICM Mendalam',
          'Update Pasar Harian',
          'Peluang ICM Eksklusif',
          'Live Interaktif Privat 2x Sehari',
        ]
      : [
          'Deep ICM Token Analysis',
          'Daily Market Updates',
          'Exclusive ICM Opportunities',
          'Bi-daily Private Interactive Live',
        ];

  // Duplicate benefits for seamless loop
  const duplicatedBenefits = [...benefits, ...benefits];

  return (
    <div className='relative w-full bg-primary-base'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8'>
        {/* Content */}
        <div className='flex min-w-0 flex-1 flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2'>
          {/* Main Text */}
          <div className='sm:text-sm flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white'>
            <span className='whitespace-nowrap'>
              {locale === 'id'
                ? 'Tahan 1% Token $PACE untuk Membuka:'
                : 'Hold 1% $PACE Token to Unlock:'}
            </span>
          </div>

          {/* Benefits - Running Text with Framer Motion */}
          <div className='relative w-full overflow-hidden sm:flex-1'>
            <motion.div
              className='sm:text-xs flex gap-6 whitespace-nowrap text-[11px] text-white/90'
              animate={{
                x: [0, -50 + '%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 20,
                  ease: 'linear',
                },
              }}
            >
              {duplicatedBenefits.map((benefit, index) => (
                <div key={index} className='flex items-center gap-6'>
                  {index > 0 && <span className='text-white/50'>∙</span>}
                  <span>{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA Link & Close Button */}
        <div className='flex items-center gap-2'>
          <Link
            href='https://pump.fun/coin/6HsMxxNDee1WsRzonNtEEu35Lti4CXey8wzueY7rpump'
            target='_blank'
            rel='noopener noreferrer'
            className='sm:text-sm whitespace-nowrap text-[11px] font-semibold text-white underline transition-opacity hover:opacity-80'
          >
            {locale === 'id' ? 'Beli' : 'Buy'}
          </Link>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className='flex h-6 w-6 items-center justify-center rounded text-white/80 transition-colors hover:bg-white/10 hover:text-white'
            aria-label={locale === 'id' ? 'Tutup banner' : 'Close banner'}
          >
            <RiCloseLine className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
