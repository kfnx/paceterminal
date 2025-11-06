import { NextRequest, NextResponse } from 'next/server';

// Force dynamic route (no static generation)
export const dynamic = 'force-dynamic';

const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN;
const X_API_BASE_URL = 'https://api.x.com/2';

// TypeScript interface for X API response
export interface XUserResponse {
  id: string;
  username: string;
  name: string;
  profile_image_url: string;
  description: string;
  verified: boolean;
  pinned_tweet_id: string | null;
}

export async function GET(request: NextRequest) {
  // 1. Validate Bearer token
  if (!X_BEARER_TOKEN) {
    return NextResponse.json(
      {
        error: 'Configuration error',
        message: 'X Bearer token is not configured',
      },
      { status: 500 },
    );
  }

  // 2. Extract username from query params
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      {
        error: 'Validation error',
        message: 'Username parameter is required',
      },
      { status: 400 },
    );
  }

  try {
    // 3. Fetch from X API
    const userFields = [
      'id',
      'username',
      'name',
      'profile_image_url',
      'description',
      'verified',
      'pinned_tweet_id',
    ].join(',');

    const response = await fetch(
      `${X_API_BASE_URL}/users/by/username/${username}?user.fields=${userFields}`,
      {
        headers: {
          Authorization: `Bearer ${X_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      },
    );

    // 4. Handle X API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('X API error:', errorData);

      // Handle specific X API errors
      if (response.status === 404) {
        return NextResponse.json(
          {
            error: 'Not found',
            message: `User @${username} not found`,
          },
          { status: 404 },
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'Rate limit',
            message: 'X API rate limit exceeded. Please try again later.',
          },
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          error: 'API error',
          message: 'Failed to fetch user data from X API',
        },
        { status: response.status },
      );
    }

    // 5. Parse and format response
    const data = await response.json();

    if (!data.data) {
      return NextResponse.json(
        {
          error: 'Invalid response',
          message: 'X API returned invalid data',
        },
        { status: 500 },
      );
    }

    const userData: XUserResponse = {
      id: data.data.id,
      username: data.data.username,
      name: data.data.name,
      profile_image_url: data.data.profile_image_url || '',
      description: data.data.description || '',
      verified: data.data.verified || false,
      pinned_tweet_id: data.data.pinned_tweet_id || null,
    };

    // 6. Return with cache headers
    return NextResponse.json(userData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Unexpected error fetching X user:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}
