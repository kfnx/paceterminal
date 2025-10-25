'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/translation-context';
import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';

import { getTokenImageUrl } from '@/utils/image-url';
import { useAllTokens } from '@/hooks/use-all-tokens';
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
  const [marketData, setMarketData] = useState<TokenMarketData[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('DATA', marketData);

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
        className={`flex items-center gap-1 ${
          isPositive ? 'text-success-base' : 'text-error-base'
        }`}
      >
        {isPositive ? (
          <RiArrowUpLine className='h-4 w-4' />
        ) : (
          <RiArrowDownLine className='h-4 w-4' />
        )}
        <span>{Math.abs(change).toFixed(2)}%</span>
      </div>
    );
  };

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
    <div className='flex-1 p-4'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-text-strong-950'>
            {locale === 'id' ? 'Ikhtisar Pasar' : 'Market Overview'}
          </h1>
          <p className='mt-2 text-text-sub-600'>
            {locale === 'id'
              ? 'Data pasar real-time untuk semua token yang dikurasi'
              : 'Real-time market data for all curated tokens'}
          </p>
        </div>

        {/* Market Stats Widgets */}
        <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* TOP 3 Price */}
          <Top3PriceWidget />

          {/* Total Market Cap */}
          <TotalMarketCapWidget />

          {/* Fear and Greed Index */}
          <FearGreedIndex />

          {/* X Post */}
          <XPostWidget tweetId='1975947991518474336' username='degenping' />

          {/* Bitcoin Dominance */}
          <BitcoinDominance />

          {/* Altcoin Season */}
          <AltcoinSeasonWidget />
        </div>

        {/* Token Table */}
        <div className='overflow-x-auto rounded-lg border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs'>
          <table className='w-full'>
            <thead className='border-b border-stroke-soft-200 bg-bg-weak-50'>
              <tr>
                <th className='text-sm px-6 py-4 text-left font-semibold text-text-sub-600'>
                  #
                </th>
                <th className='text-sm px-6 py-4 text-left font-semibold text-text-sub-600'>
                  {locale === 'id' ? 'Token' : 'Token'}
                </th>
                <th className='text-sm px-6 py-4 text-right font-semibold text-text-sub-600'>
                  {locale === 'id' ? 'Harga' : 'Price'}
                </th>
                <th className='text-sm px-6 py-4 text-right font-semibold text-text-sub-600'>
                  1h %
                </th>
                <th className='text-sm px-6 py-4 text-right font-semibold text-text-sub-600'>
                  24h %
                </th>
                <th className='text-sm px-6 py-4 text-right font-semibold text-text-sub-600'>
                  {locale === 'id' ? 'Kapitalisasi Pasar' : 'Market Cap'}
                </th>
                <th className='text-sm px-6 py-4 text-right font-semibold text-text-sub-600'>
                  {locale === 'id' ? 'Volume (24j)' : 'Volume (24h)'}
                </th>
                <th className='text-sm px-6 py-4 text-right font-semibold text-text-sub-600'>
                  {locale === 'id' ? '7 Hari' : 'Last 7 Days'}
                </th>
              </tr>
            </thead>
            <tbody>
              {marketData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className='px-6 py-12 text-center text-text-sub-600'
                  >
                    {locale === 'id'
                      ? 'Tidak ada data pasar tersedia'
                      : 'No market data available'}
                  </td>
                </tr>
              ) : (
                marketData.map((token, index) => {
                  const tokenPath =
                    locale === 'id'
                      ? `/id/solana/${token.address}`
                      : `/solana/${token.address}`;
                  return (
                    <tr
                      key={token.address}
                      className='cursor-pointer border-b border-stroke-soft-200 transition-colors hover:bg-bg-weak-50'
                    >
                      <td className='text-sm px-6 py-4 text-text-sub-600'>
                        <Link href={tokenPath} className='block'>
                          {index + 1}
                        </Link>
                      </td>
                      <td className='px-6 py-4'>
                        <Link href={tokenPath} className='block'>
                          <div className='flex items-center gap-3'>
                            <Avatar.Root size='32' color='blue'>
                              <Avatar.Image
                                src={getTokenImageUrl(token.image)}
                                alt={token.name}
                              />
                            </Avatar.Root>
                            <div>
                              <div className='font-medium text-text-strong-950'>
                                {token.name}
                              </div>
                              <div className='text-sm text-text-sub-600'>
                                {token.symbol}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className='text-sm px-6 py-4 text-right text-text-strong-950'>
                        <Link href={tokenPath} className='block'>
                          {formatPrice(token.price)}
                        </Link>
                      </td>
                      <td className='text-sm px-6 py-4 text-right'>
                        <Link href={tokenPath} className='block'>
                          {renderPriceChange(token.priceChange1h)}
                        </Link>
                      </td>
                      <td className='text-sm px-6 py-4 text-right'>
                        <Link href={tokenPath} className='block'>
                          {renderPriceChange(token.priceChange24h)}
                        </Link>
                      </td>
                      <td className='text-sm px-6 py-4 text-right text-text-strong-950'>
                        <Link href={tokenPath} className='block'>
                          {formatVolume(token.marketCap)}
                        </Link>
                      </td>
                      <td className='text-sm px-6 py-4 text-right text-text-strong-950'>
                        <Link href={tokenPath} className='block'>
                          {formatVolume(token.volume24h)}
                        </Link>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <Link href={tokenPath} className='block'>
                          <div className='flex justify-end'>
                            <MiniPriceChart
                              data={token.priceHistory}
                              width={96}
                              height={48}
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
