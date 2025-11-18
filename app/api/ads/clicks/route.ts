import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: adsClicks, error } = await supabase
      .from('ads_clicks')
      .select('*')
      .order('click_count', { ascending: false });

    if (error) {
      console.error('Error fetching ads clicks:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to fetch ads clicks', details: error.message },
        { status: 500 },
      );
    }

    console.log('Fetched ads clicks:', adsClicks?.length || 0, 'records');

    // Calculate totals
    const totalClicks = adsClicks.reduce(
      (sum, record) => sum + record.click_count,
      0,
    );
    const leftClicks = adsClicks
      .filter((record) => record.position === 'left')
      .reduce((sum, record) => sum + record.click_count, 0);
    const rightClicks = adsClicks
      .filter((record) => record.position === 'right')
      .reduce((sum, record) => sum + record.click_count, 0);

    return NextResponse.json({
      adsClicks,
      stats: {
        totalClicks,
        leftClicks,
        rightClicks,
        uniqueAds: adsClicks.length,
      },
    });
  } catch (error) {
    console.error('Error in ads clicks API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
