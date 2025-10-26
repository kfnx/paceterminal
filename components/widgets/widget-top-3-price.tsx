'use client';

import { RiCoinFill, RiStockLine } from '@remixicon/react';
import { motion } from 'framer-motion';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

import { useTopCryptocurrencies } from '@/hooks/use-top-cryptocurrencies';

interface CryptoItem {
  name: string;
  symbol: string;
  icon: JSX.Element;
  price: string;
  change: string;
  chart: number[];
}

// Icon mapping for different cryptocurrencies
const getCryptoIcon = (symbol: string) => {
  const iconMap: Record<string, JSX.Element> = {
    BTC: <RiCoinFill className='text-2xl text-orange-500' />,
    ETH: <RiCoinFill className='text-2xl text-neutral-700' />,
    SOL: <RiStockLine className='text-2xl text-purple-600' />,
    BNB: <RiCoinFill className='text-2xl text-yellow-500' />,
    XRP: <RiCoinFill className='text-2xl text-blue-500' />,
  };
  return iconMap[symbol] || <RiCoinFill className='text-2xl text-gray-500' />;
};

// Convert chart array into Recharts-friendly data
const formatChartData = (data: number[]) =>
  data.map((value, index) => ({ index, value }));

const Sparkline = ({ data }: { data: number[] }) => {
  return (
    <ResponsiveContainer width={90} height={40}>
      <LineChart data={formatChartData(data)}>
        <Line
          type='monotone'
          dataKey='value'
          stroke='rgb(34 197 94)' // Tailwind green-500
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default function Top3PriceWidget() {
  const { data, isLoading, error } = useTopCryptocurrencies();

  // Generate sparkline data from 24h change
  const generateSparkline = (change24h: number): number[] => {
    const points = 7;
    const volatility = Math.abs(change24h) / 100;
    const data: number[] = [];

    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const trend = 1 + (change24h / 100) * progress;
      const randomVariation = (Math.random() - 0.5) * volatility * 0.5;
      data.push(Math.max(0.8, Math.min(1.2, trend + randomVariation)));
    }

    return data;
  };

  // Format price
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  // Format percentage change
  const formatChange = (change: number): string => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <motion.div
        className='w-full max-w-md rounded-20 bg-bg-white-0 p-4 shadow-regular-sm'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className='mb-3 flex items-center gap-2'>
          <RiStockLine className='text-lg text-text-sub-600' />
          <h3 className='text-title-h6 text-text-strong-950'>Top 3 Price</h3>
        </div>
        <div className='divide-y divide-stroke-soft-200'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex items-center justify-between py-3'>
              <div className='flex items-center gap-3'>
                <div className='bg-gray-200 h-8 w-8 animate-pulse rounded-full' />
                <div className='space-y-2'>
                  <div className='bg-gray-200 h-4 w-20 animate-pulse rounded' />
                  <div className='bg-gray-200 h-4 w-24 animate-pulse rounded' />
                  <div className='bg-gray-200 h-3 w-16 animate-pulse rounded' />
                </div>
              </div>
              <div className='bg-gray-200 h-10 w-24 animate-pulse rounded' />
            </div>
          ))}
        </div>
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
          <RiStockLine className='text-lg text-text-sub-600' />
          <h3 className='text-title-h6 text-text-strong-950'>Top 3 Price</h3>
        </div>
        <div className='text-sm py-6 text-center text-error-base'>
          Failed to load data
        </div>
      </motion.div>
    );
  }

  const cryptos: CryptoItem[] =
    data?.cryptocurrencies.map((crypto) => ({
      name: crypto.name,
      symbol: crypto.symbol,
      icon: getCryptoIcon(crypto.symbol),
      price: formatPrice(crypto.price),
      change: formatChange(crypto.priceChange24h),
      chart: generateSparkline(crypto.priceChange24h),
    })) || [];

  return (
    <motion.div
      className='w-full max-w-md rounded-20 bg-bg-white-0 p-4 shadow-regular-sm'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className='mb-3 flex items-center gap-2'>
        <RiStockLine className='text-lg text-text-sub-600' />
        <h3 className='text-title-h6 text-text-strong-950'>Top 3 Price</h3>
      </div>

      {/* Crypto list */}
      <div className='divide-y divide-stroke-soft-200'>
        {cryptos.map((crypto, index) => {
          const isPositive = crypto.change.startsWith('+');
          return (
            <motion.div
              key={crypto.name}
              className='flex items-center justify-between py-3'
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {/* Left section */}
              <div className='flex items-center gap-3'>
                {crypto.icon}
                <div>
                  <p className='text-label-md text-text-strong-950'>
                    {crypto.name}
                  </p>
                  <p className='text-paragraph-sm font-medium text-text-strong-950'>
                    {crypto.price}
                  </p>
                  <p
                    className={`text-paragraph-xs ${
                      isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {crypto.change}
                  </p>
                </div>
              </div>

              {/* Sparkline */}
              <Sparkline data={crypto.chart} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
