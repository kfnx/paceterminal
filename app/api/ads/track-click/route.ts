import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase';

const trackClickSchema = z.object({
  target_url: z.string().url(),
  position: z.enum(['left', 'right']),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    // Validate request body
    const validation = trackClickSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 },
      );
    }

    const { target_url, position } = validation.data;

    // Check if record exists for this target_url and position
    const { data: existingRecord } = await supabase
      .from('ads_clicks')
      .select('*')
      .eq('target_url', target_url)
      .eq('position', position)
      .single();

    if (existingRecord) {
      // Increment click count
      const { data: updatedRecord, error: updateError } = await supabase
        .from('ads_clicks')
        .update({
          click_count: existingRecord.click_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRecord.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating ad click count:', updateError);
        return NextResponse.json(
          { error: 'Failed to update click count' },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        click_count: updatedRecord.click_count,
      });
    } else {
      // Create new record with click_count = 1
      const { data: newRecord, error: insertError } = await supabase
        .from('ads_clicks')
        .insert({
          target_url,
          position,
          click_count: 1,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating ad click record:', insertError);
        return NextResponse.json(
          { error: 'Failed to create click record' },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        click_count: newRecord.click_count,
      });
    }
  } catch (error) {
    console.error('Error in track-click API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
