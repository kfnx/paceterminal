import { NextResponse } from 'next/server';

// Tell Next.js this route should be dynamic
export const dynamic = 'force-dynamic';

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY;
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export interface CryptocurrencyData {
  id: number;
  name: string;
  symbol: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
}

export interface TopCryptocurrenciesResponse {
  cryptocurrencies: CryptocurrencyData[];
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
    // Fetch top 3 cryptocurrencies by market cap
    const response = await fetch(
      `${CMC_BASE_URL}/cryptocurrency/listings/latest?limit=3&sort=market_cap&sort_dir=desc&convert=USD`,
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
          message: 'Failed to fetch top cryptocurrencies from CoinMarketCap',
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Format cryptocurrency data
    const cryptocurrencies: CryptocurrencyData[] = data.data.map(
      (crypto: any) => {
        const quote = crypto.quote.USD;
        return {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          price: quote.price,
          priceChange1h: quote.percent_change_1h || 0,
          priceChange24h: quote.percent_change_24h || 0,
          priceChange7d: quote.percent_change_7d || 0,
          marketCap: quote.market_cap,
          volume24h: quote.volume_24h,
          lastUpdated: crypto.last_updated,
        };
      },
    );

    const formattedData: TopCryptocurrenciesResponse = {
      cryptocurrencies,
      lastUpdated: data.status.timestamp,
    };

    // Return with cache headers
    return NextResponse.json(formattedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Unexpected error fetching top cryptocurrencies:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message:
          'An unexpected error occurred while fetching top cryptocurrencies',
      },
      { status: 500 },
    );
  }
}
