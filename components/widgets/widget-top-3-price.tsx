'use client';

import { RiStockLine } from '@remixicon/react';
import { motion } from 'framer-motion';

import { useTopCryptocurrencies } from '@/hooks/use-top-cryptocurrencies';
import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';
import { MiniPriceChart } from '@/components/mini-price-chart';

interface CryptoItem {
  name: string;
  symbol: string;
  logoUrl: string;
  price: string;
  change: string;
  priceHistory: number[];
}

// Logo mapping for different cryptocurrencies (using CoinGecko image URLs)
const getCryptoLogo = (symbol: string): string => {
  const logoMap: Record<string, string> = {
    BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    BNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    XRP: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  };
  return (
    logoMap[symbol] ||
    'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  );
};

export default function Top3PriceWidget() {
  const { data, isLoading, error } = useTopCryptocurrencies();

  console.log('data', data);

  // Generate realistic price history from 24h change
  const generatePriceHistory = (
    currentPrice: number,
    change24h: number,
  ): number[] => {
    const points = 24; // 24 data points for hourly data
    const data: number[] = [];

    // Calculate the starting price 24h ago
    const startPrice = currentPrice / (1 + change24h / 100);

    // Generate realistic price movements with volatility
    const volatility = Math.abs(change24h) / 200; // Adjust volatility factor

    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);

      // Linear interpolation from start to current price
      const baseValue = startPrice + (currentPrice - startPrice) * progress;

      // Add realistic random fluctuations
      const fluctuation = (Math.random() - 0.5) * 2 * volatility * currentPrice;

      // Add some smoothing by considering previous value
      const smoothed = i > 0 ? data[i - 1] * 0.3 + baseValue * 0.7 : baseValue;

      data.push(smoothed + fluctuation);
    }

    // Ensure last value is close to current price
    data[data.length - 1] = currentPrice;

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
        className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs sm:p-6'
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
        className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs sm:p-6'
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
    data?.cryptocurrencies
      .filter(
        (crypto) =>
          crypto.name !== 'Tether USDt' && crypto.symbol !== 'USDT',
      )
      .slice(0, 3)
      .map((crypto) => ({
        name: crypto.name,
        symbol: crypto.symbol,
        logoUrl: getCryptoLogo(crypto.symbol),
        price: formatPrice(crypto.price),
        change: formatChange(crypto.priceChange24h),
        priceHistory: generatePriceHistory(crypto.price, crypto.priceChange24h),
      })) || [];

  return (
    <motion.div
      className='w-full rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 shadow-regular-xs sm:p-4 md:p-6'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className='mb-2 flex items-center gap-2 sm:mb-3'>
        <RiStockLine className='text-base sm:text-lg text-text-sub-600' />
        <h3 className='text-base font-semibold text-text-strong-950 sm:text-title-h6'>
          Top 3 Price
        </h3>
      </div>

      {/* Divider */}
      <Divider.Root variant='line-spacing' className='mb-2 sm:mb-3' />

      {/* Crypto list */}
      <div className='divide-y divide-stroke-soft-200'>
        {cryptos.map((crypto, index) => {
          const isPositive = crypto.change.startsWith('+');
          return (
            <motion.div
              key={crypto.name}
              className='flex items-center justify-between py-2 sm:py-3'
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {/* Left section */}
              <div className='flex items-center gap-2 sm:gap-3'>
                <Avatar.Root size='24' color='blue' className='sm:!h-8 sm:!w-8'>
                  <Avatar.Image src={crypto.logoUrl} alt={crypto.name} />
                </Avatar.Root>
                <div>
                  <p className='text-xs font-medium text-text-strong-950 sm:text-label-md'>
                    {crypto.name}
                  </p>
                  <p className='text-xs font-medium text-text-strong-950 sm:text-paragraph-sm'>
                    {crypto.price}
                  </p>
                  <p
                    className={`text-[10px] sm:text-paragraph-xs ${
                      isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {crypto.change}
                  </p>
                </div>
              </div>

              {/* Price Chart */}
              <div className='h-8 w-[60px] sm:h-10 sm:w-20'>
                <MiniPriceChart
                  data={crypto.priceHistory}
                  width={60}
                  height={32}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
