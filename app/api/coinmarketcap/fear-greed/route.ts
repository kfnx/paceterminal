import { NextResponse } from 'next/server';

// Tell Next.js this route should be dynamic
export const dynamic = 'force-dynamic';

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY;
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v3';

export interface FearGreedIndexResponse {
  value: number;
  classification: string;
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
    // Fetch Fear and Greed Index from CoinMarketCap
    const response = await fetch(`${CMC_BASE_URL}/fear-and-greed/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        Accept: 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('CoinMarketCap API error:', errorData);
      return NextResponse.json(
        {
          error: 'API error',
          message: 'Failed to fetch Fear and Greed Index from CoinMarketCap',
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Format response
    const formattedData: FearGreedIndexResponse = {
      value: data.data.value,
      classification: data.data.value_classification,
      lastUpdated: data.data.update_time,
    };

    // Return with cache headers
    return NextResponse.json(formattedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Unexpected error fetching Fear and Greed Index:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message:
          'An unexpected error occurred while fetching Fear and Greed Index',
      },
      { status: 500 },
    );
  }
}
