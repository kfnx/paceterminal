import { NextResponse } from 'next/server';

// Tell Next.js this route should be dynamic
export const dynamic = 'force-dynamic';

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY;
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export interface GlobalMetricsResponse {
  totalMarketCap: number;
  totalMarketCapChange24h: number;
  totalVolume24h: number;
  btcDominance: number;
  btcDominanceChange24h: number;
  ethDominance: number;
  ethDominanceChange24h: number;
  activeCryptocurrencies: number;
  totalExchanges: number;
  lastUpdated: string;
}

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
    // Fetch global metrics from CoinMarketCap
    const response = await fetch(
      `${CMC_BASE_URL}/global-metrics/quotes/latest`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          Accept: 'application/json',
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('CoinMarketCap API error:', errorData);
      return NextResponse.json(
        {
          error: 'API error',
          message: 'Failed to fetch global metrics from CoinMarketCap',
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Extract USD quote data
    const quote = data.data.quote.USD;
    const btcDominance = data.data.btc_dominance;
    const ethDominance = data.data.eth_dominance;

    // Format response
    const formattedData: GlobalMetricsResponse = {
      totalMarketCap: quote.total_market_cap,
      totalMarketCapChange24h: quote.total_market_cap_yesterday_percentage_change,
      totalVolume24h: quote.total_volume_24h,
      btcDominance: btcDominance,
      btcDominanceChange24h: data.data.btc_dominance_yesterday_percentage_change || 0,
      ethDominance: ethDominance,
      ethDominanceChange24h: data.data.eth_dominance_yesterday_percentage_change || 0,
      activeCryptocurrencies: data.data.active_cryptocurrencies,
      totalExchanges: data.data.active_exchanges,
      lastUpdated: data.data.last_updated,
    };

    // Return with cache headers
    return NextResponse.json(formattedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Unexpected error fetching global metrics:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching global metrics',
      },
      { status: 500 },
    );
  }
}
