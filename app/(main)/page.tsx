'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/translation-context';
import {
  RiArrowDownLine,
  RiArrowDownSFill,
  RiArrowUpLine,
  RiArrowUpSFill,
  RiExpandUpDownFill,
} from '@remixicon/react';

import { getTokenImageUrl } from '@/utils/image-url';
import { useAllTokens } from '@/hooks/use-all-tokens';
import { useActiveXPost } from '@/hooks/use-x-posts';
import * as Avatar from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MiniPriceChart } from '@/components/mini-price-chart';
import AltcoinSeasonWidget from '@/components/widgets/widget-altseason';
import BitcoinDominance from '@/components/widgets/widget-bitcoin-dominance';
import FearGreedIndex from '@/components/widgets/widget-fear-index';
import Top3PriceWidget from '@/components/widgets/widget-top-3-price';
import TotalMarketCapWidget from '@/components/widgets/widget-total-market-cap';
import XPostWidget from '@/components/widgets/widget-x-post';

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  priceChange: {
    h1: number;
    h24: number;
    h6: number;
    m5: number;
  };
  volume: {
    h24: number;
    h6: number;
    m5: number;
  };
  liquidity?: {
    usd?: number;
    base?: number;
    quote?: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
}

interface DexScreenerResponse {
  schemaVersion: string;
  pairs: DexScreenerPair[] | null;
}

interface TokenMarketData {
  address: string;
  name: string;
  symbol: string;
  image: string | null;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  priceHistory: number[];
}

export default function PageHome() {
  const { locale } = useTranslation();
  const { data: tokens, isLoading: tokensLoading } = useAllTokens();
  const { xPost: activeXPost } = useActiveXPost();
  const [marketData, setMarketData] = useState<TokenMarketData[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!tokens || tokens.length === 0) {
        setIsInitialLoad(false);
        return;
      }

      try {
        // DexScreener API has a limit of 30 addresses per request
        // We need to batch the requests
        const BATCH_SIZE = 30;
        const allPairs: DexScreenerPair[] = [];

        // Split tokens into batches
        for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
          const batch = tokens.slice(i, i + BATCH_SIZE);
          const addresses = batch.map((token) => token.address).join(',');

          const response = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${addresses}`,
          );

          if (!response.ok) {
            console.error(`Failed to fetch batch ${i / BATCH_SIZE + 1}`);
            continue; // Skip this batch and continue with others
          }

          const data: DexScreenerResponse = await response.json();

          if (data.pairs && data.pairs.length > 0) {
            allPairs.push(...data.pairs);
          }

          // Add a small delay between requests to avoid rate limiting
          if (i + BATCH_SIZE < tokens.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        if (allPairs.length === 0) {
          setMarketData([]);
          setIsInitialLoad(false);
          return;
        }

        // Group pairs by token address and take the first pair for each token
        const tokenPairMap = new Map<string, DexScreenerPair>();
        allPairs.forEach((pair) => {
          const address = pair.baseToken.address;
          if (!tokenPairMap.has(address)) {
            tokenPairMap.set(address, pair);
          }
        });

        // Map the data to our format
        const formattedData: TokenMarketData[] = tokens
          .map((token) => {
            const pair = tokenPairMap.get(token.address);
            if (!pair) return null;

            // Generate mock 7-day price history based on current price and 24h change
            const currentPrice = parseFloat(pair.priceUsd);
            const change24h = pair.priceChange?.h24 || 0;
            const priceHistory = generatePriceHistory(currentPrice, change24h);

            return {
              address: token.address,
              name: token.name,
              symbol: pair.baseToken.symbol,
              image: token.image,
              price: currentPrice,
              priceChange1h: pair.priceChange?.h1 || 0,
              priceChange24h: change24h,
              priceChange7d: 0, // DexScreener doesn't provide 7d change directly
              marketCap: pair.marketCap || pair.fdv || 0,
              volume24h: pair.volume?.h24 || 0,
              liquidity: pair.liquidity?.usd || 0,
              priceHistory,
            };
          })
          .filter((item): item is TokenMarketData => item !== null)
          .sort((a, b) => b.marketCap - a.marketCap); // Sort by market cap descending

        setMarketData(formattedData);
        setError(null);
        setIsInitialLoad(false);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to fetch market data');
        setIsInitialLoad(false);
      }
    };

    fetchMarketData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);

    return () => clearInterval(interval);
  }, [tokens]);

  const formatPrice = (price: number) => {
    if (price === 0) return '$0.00';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  // Helper function to generate mock 7-day price history
  const generatePriceHistory = (currentPrice: number, change24h: number) => {
    // Generate 7 data points for a week
    const points = 7;
    const history: number[] = [];

    // Start with a base price 7 days ago
    // Use 24h change to estimate volatility
    const volatility = Math.abs(change24h) / 100;
    const basePrice = currentPrice / (1 + change24h / 100);

    for (let i = 0; i < points; i++) {
      // Create some variation in the price
      const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2;
      const progress = i / (points - 1);
      const interpolatedPrice =
        basePrice + (currentPrice - basePrice) * progress;
      history.push(interpolatedPrice * randomFactor);
    }

    // Ensure last point is current price
    history[history.length - 1] = currentPrice;

    return history;
  };

  const renderPriceChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div
        className={`flex items-center justify-center gap-0.5 sm:gap-1 ${
          isPositive ? 'text-success-base' : 'text-error-base'
        }`}
      >
        {isPositive ? (
          <RiArrowUpLine className='h-3 w-3 sm:h-4 sm:w-4' />
        ) : (
          <RiArrowDownLine className='h-3 w-3 sm:h-4 sm:w-4' />
        )}
        <span>{Math.abs(change).toFixed(2)}%</span>
      </div>
    );
  };

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column - default to descending for numeric, ascending for text
      setSortColumn(column);
      setSortDirection(column === 'symbol' ? 'asc' : 'desc');
    }
  };

  // Get sort icon based on column state
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return (
        <RiExpandUpDownFill className='h-3 w-3 text-text-sub-600 sm:h-4 sm:w-4' />
      );
    }
    return sortDirection === 'asc' ? (
      <RiArrowUpSFill className='h-3 w-3 text-text-sub-600 sm:h-4 sm:w-4' />
    ) : (
      <RiArrowDownSFill className='h-3 w-3 text-text-sub-600 sm:h-4 sm:w-4' />
    );
  };

  // Get sorted market data
  const sortedMarketData = [...marketData].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortColumn) {
      case 'symbol':
        aValue = a.symbol.toLowerCase();
        bValue = b.symbol.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'priceChange1h':
        aValue = a.priceChange1h;
        bValue = b.priceChange1h;
        break;
      case 'priceChange24h':
        aValue = a.priceChange24h;
        bValue = b.priceChange24h;
        break;
      case 'marketCap':
        aValue = a.marketCap;
        bValue = b.marketCap;
        break;
      case 'volume24h':
        aValue = a.volume24h;
        bValue = b.volume24h;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate total 24h volume across curated tokens
  const total24hVolume = marketData.reduce(
    (sum, token) => sum + token.volume24h,
    0,
  );

  // Only show loading spinner on initial load
  if (tokensLoading || isInitialLoad) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 px-4 py-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='rounded-lg border border-error-base bg-red-alpha-10 p-6 text-center'>
            <p className='text-error-base'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 p-3 sm:p-4'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        {/* <div className='mb-4 sm:mb-8'>
          <h1 className='text-xl sm:text-3xl font-bold text-text-strong-950'>
            {locale === 'id' ? 'Ikhtisar Pasar' : 'Market Overview'}
          </h1>
          <p className='text-xs sm:text-base mt-1 text-text-sub-600 sm:mt-2'>
            {locale === 'id'
              ? 'Data pasar real-time untuk semua token yang dikurasi'
              : 'Real-time market data for all curated tokens'}
          </p>
        </div> */}

        {/* Market Stats Widgets */}
        <div className='mb-4 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* TOP 3 Price */}
          <Top3PriceWidget />

          {/* Total Market Cap */}
          <TotalMarketCapWidget />

          {/* Fear and Greed Index */}
          <FearGreedIndex />

          {/* Bitcoin Dominance */}
          <BitcoinDominance />

          {/* Altcoin Season */}
          <AltcoinSeasonWidget />

          {/* X Post */}
          {activeXPost && (
            <XPostWidget
              tweetId={activeXPost.tweet_id}
              username={activeXPost.username}
            />
          )}
        </div>

        {/* Token Table */}
        <div className='w-full max-w-[calc(100vw-2rem)] overflow-x-scroll rounded-lg border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs lg:max-w-full'>
          <table className='w-full'>
            <thead className='border-b border-stroke-soft-200 bg-bg-weak-50'>
              <tr>
                <th className='text-xs sm:text-sm px-1.5 py-2 text-center font-semibold text-text-sub-600 sm:px-4 sm:py-3'>
                  #
                </th>
                <th
                  className='text-xs sm:text-sm cursor-pointer px-1.5 py-2 text-left font-semibold text-text-sub-600 transition hover:bg-bg-soft-200 sm:px-4 sm:py-3'
                  onClick={() => handleSort('symbol')}
                >
                  <div className='flex items-center gap-0.5 sm:gap-1'>
                    {locale === 'id' ? 'Token' : 'Token'}
                    {getSortIcon('symbol')}
                  </div>
                </th>
                <th
                  className='text-xs sm:text-sm cursor-pointer px-1.5 py-2 text-center font-semibold text-text-sub-600 transition hover:bg-bg-soft-200 sm:px-4 sm:py-3'
                  onClick={() => handleSort('price')}
                >
                  <div className='flex items-center justify-center gap-0.5 sm:gap-1'>
                    {locale === 'id' ? 'Harga' : 'Price'}
                    {getSortIcon('price')}
                  </div>
                </th>
                <th
                  className='text-xs sm:text-sm cursor-pointer px-1.5 py-2 text-center font-semibold text-text-sub-600 transition hover:bg-bg-soft-200 sm:px-4 sm:py-3'
                  onClick={() => handleSort('priceChange1h')}
                >
                  <div className='flex items-center justify-center gap-0.5 sm:gap-1'>
                    1h %{getSortIcon('priceChange1h')}
                  </div>
                </th>
                <th
                  className='text-xs sm:text-sm cursor-pointer px-1.5 py-2 text-center font-semibold text-text-sub-600 transition hover:bg-bg-soft-200 sm:px-4 sm:py-3'
                  onClick={() => handleSort('priceChange24h')}
                >
                  <div className='flex items-center justify-center gap-0.5 sm:gap-1'>
                    24h %{getSortIcon('priceChange24h')}
                  </div>
                </th>
                <th
                  className='text-xs sm:text-sm cursor-pointer px-1.5 py-2 text-center font-semibold text-text-sub-600 transition hover:bg-bg-soft-200 sm:px-4 sm:py-3'
                  onClick={() => handleSort('marketCap')}
                >
                  <div className='flex items-center justify-center gap-0.5 sm:gap-1'>
                    {locale === 'id' ? 'Kap. Pasar' : 'Mkt Cap'}
                    {getSortIcon('marketCap')}
                  </div>
                </th>
                <th
                  className='text-xs sm:text-sm cursor-pointer px-1.5 py-2 text-center font-semibold text-text-sub-600 transition hover:bg-bg-soft-200 sm:px-4 sm:py-3'
                  onClick={() => handleSort('volume24h')}
                >
                  <div className='flex items-center justify-center gap-0.5 sm:gap-1'>
                    {locale === 'id' ? 'Volume' : 'Volume'}
                    {getSortIcon('volume24h')}
                  </div>
                </th>
                <th className='text-xs sm:text-sm px-1.5 py-2 text-center font-semibold text-text-sub-600 sm:px-4 sm:py-3'>
                  {locale === 'id' ? '7 Hari' : '7 Days'}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMarketData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className='sm:text-xs px-3 py-6 text-center text-text-sub-600 sm:px-6 sm:py-8'
                  >
                    {locale === 'id'
                      ? 'Tidak ada data pasar tersedia'
                      : 'No market data available'}
                  </td>
                </tr>
              ) : (
                sortedMarketData.map((token, index) => {
                  const tokenPath =
                    locale === 'id'
                      ? `/id/solana/${token.address}`
                      : `/solana/${token.address}`;
                  return (
                    <tr
                      key={token.address}
                      className='cursor-pointer border-b border-stroke-soft-200 transition-colors hover:bg-bg-weak-50'
                    >
                      <td className='text-xs sm:text-sm px-1.5 py-2 text-center text-text-sub-600 sm:px-4 sm:py-3'>
                        <Link href={tokenPath} className='block'>
                          {index + 1}
                        </Link>
                      </td>
                      <td className='px-1.5 py-2 sm:px-4 sm:py-3'>
                        <Link href={tokenPath} className='block'>
                          <div className='flex items-center gap-1 sm:gap-2'>
                            <div className='h-5 w-5 flex-shrink-0 sm:h-8 sm:w-8'>
                              <Avatar.Root
                                size='20'
                                color='blue'
                                className='sm:!h-8 sm:!w-8'
                              >
                                <Avatar.Image
                                  src={getTokenImageUrl(token.image)}
                                  alt={token.name}
                                />
                              </Avatar.Root>
                            </div>
                            <div className='min-w-0'>
                              <div className='text-xs sm:text-sm truncate font-medium text-text-strong-950'>
                                {token.symbol}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className='text-xs sm:text-sm px-1.5 py-2 text-center text-text-strong-950 sm:px-4 sm:py-3'>
                        <Link href={tokenPath} className='block'>
                          {formatPrice(token.price)}
                        </Link>
                      </td>
                      <td className='text-xs sm:text-sm px-1.5 py-2 text-center sm:px-4 sm:py-3'>
                        <Link href={tokenPath} className='block'>
                          {renderPriceChange(token.priceChange1h)}
                        </Link>
                      </td>
                      <td className='text-xs sm:text-sm px-1.5 py-2 text-center sm:px-4 sm:py-3'>
                        <Link href={tokenPath} className='block'>
                          {renderPriceChange(token.priceChange24h)}
                        </Link>
                      </td>
                      <td className='text-xs sm:text-sm px-1.5 py-2 text-center text-text-strong-950 sm:px-4 sm:py-3'>
                        <Link href={tokenPath} className='block'>
                          {formatVolume(token.marketCap)}
                        </Link>
                      </td>
                      <td className='text-xs sm:text-sm px-1.5 py-2 text-center text-text-strong-950 sm:px-4 sm:py-3'>
                        <Link href={tokenPath} className='block'>
                          {formatVolume(token.volume24h)}
                        </Link>
                      </td>
                      <td className='px-1.5 py-2 text-center sm:px-4 sm:py-3'>
                        <Link href={tokenPath} className='block'>
                          <div className='flex justify-center'>
                            <MiniPriceChart
                              data={token.priceHistory}
                              width={80}
                              height={40}
                            />
                          </div>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
