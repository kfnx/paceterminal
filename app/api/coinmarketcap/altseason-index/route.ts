import { NextResponse } from 'next/server';

// Tell Next.js this route should be dynamic
export const dynamic = 'force-dynamic';

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY;
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export interface AltseasonIndexResponse {
  index: number; // 1-100
  coinsAnalyzed: number;
  coinsOutperforming: number;
  percentageOutperforming: number;
  bitcoinChange90d: number;
  lastUpdated: string;
  methodology: string;
}

// List of stablecoins to exclude (by symbol)
const STABLECOINS = [
  'USDT',
  'USDC',
  'DAI',
  'BUSD',
  'TUSD',
  'USDD',
  'FRAX',
  'USDP',
  'GUSD',
  'PYUSD',
  'FDUSD',
  'LUSD',
  'USDK',
  'USDJ',
  'USDN',
  'RSV',
  'HUSD',
  'SUSD',
  'EURS',
  'EURT',
];

// List of wrapped/asset-backed tokens to exclude (by symbol)
const WRAPPED_TOKENS = [
  'WBTC',
  'stETH',
  'wETH',
  'wstETH',
  'cLINK',
  'aUSDC',
  'cDAI',
  'renBTC',
  'HBTC',
  'tBTC',
  'sBTC',
  'imBTC',
  'pBTC',
  'WBNB',
  'WMATIC',
  'WAVAX',
  'WFTM',
  'WSOL',
  'rETH',
  'cbETH',
  'sETH2',
  'ankrETH',
];

export async function GET() {
  // Validate API key
  if (!CMC_API_KEY) {
    return NextResponse.json(
      {
        error: 'Configuration error',
        message: 'CoinMarketCap API key is not configured',
      },
      { status: 500 },
    );
  }

  try {
    // Fetch top 100 cryptocurrencies by market cap with 90-day performance
    const response = await fetch(
      `${CMC_BASE_URL}/cryptocurrency/listings/latest?limit=100&convert=USD&sort=market_cap`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          Accept: 'application/json',
        },
        next: {
          revalidate: 86400, // Cache for 24 hours (daily refresh)
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('CoinMarketCap API error:', errorData);
      return NextResponse.json(
        {
          error: 'API error',
          message: 'Failed to fetch cryptocurrency data from CoinMarketCap',
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    const cryptos = data.data;

    // Find Bitcoin to get its 90-day performance
    const bitcoin = cryptos.find((crypto: any) => crypto.symbol === 'BTC');
    if (!bitcoin) {
      return NextResponse.json(
        {
          error: 'Data error',
          message: 'Bitcoin data not found in response',
        },
        { status: 500 },
      );
    }

    const bitcoinChange90d = bitcoin.quote.USD.percent_change_90d || 0;

    // Filter out stablecoins, wrapped tokens, and coins without 90-day data
    const validCoins = cryptos.filter((crypto: any) => {
      const symbol = crypto.symbol;
      const change90d = crypto.quote.USD.percent_change_90d;

      // Exclude if no 90-day data
      if (change90d === null || change90d === undefined) {
        return false;
      }

      // Exclude stablecoins
      if (STABLECOINS.includes(symbol)) {
        return false;
      }

      // Exclude wrapped/asset-backed tokens
      if (WRAPPED_TOKENS.includes(symbol)) {
        return false;
      }

      return true;
    });

    // Count how many coins outperform Bitcoin
    const coinsOutperforming = validCoins.filter((crypto: any) => {
      const change90d = crypto.quote.USD.percent_change_90d;
      return change90d > bitcoinChange90d;
    }).length;

    const coinsAnalyzed = validCoins.length;
    const percentageOutperforming = (coinsOutperforming / coinsAnalyzed) * 100;

    // Scale to 1-100 index
    // The percentage directly represents the altseason index
    const altseasonIndex = Math.round(
      Math.min(100, Math.max(1, percentageOutperforming)),
    );

    const formattedData: AltseasonIndexResponse = {
      index: altseasonIndex,
      coinsAnalyzed,
      coinsOutperforming,
      percentageOutperforming: Number(percentageOutperforming.toFixed(2)),
      bitcoinChange90d: Number(bitcoinChange90d.toFixed(2)),
      lastUpdated: data.status.timestamp,
      methodology:
        'Compares 90-day performance of top 100 coins (excluding stablecoins and wrapped tokens) against Bitcoin',
    };

    // Return with cache headers (24-hour cache)
    return NextResponse.json(formattedData, {
      headers: {
        'Cache-Control':
          'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    });
  } catch (error) {
    console.error('Unexpected error calculating Altseason Index:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message:
          'An unexpected error occurred while calculating Altseason Index',
      },
      { status: 500 },
    );
  }
}
