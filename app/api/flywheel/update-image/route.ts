import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * Updates or creates flywheel record in database
 */
async function updateFlywheelRecord(tokenAddress: string, imageUrl: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('flywheels')
    .upsert(
      {
        address: tokenAddress,
        image: imageUrl,
      },
      {
        onConflict: 'address',
      },
    )
    .select()
    .single();

  if (error) {
    console.error('Error updating flywheel record:', error);
    throw new Error('Failed to update flywheel record in database.');
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const tokenAddress = formData.get('tokenAddress') as string | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (!tokenAddress) {
      return NextResponse.json(
        { error: 'Token address is required' },
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 },
      );
    }

    // Update database record
    const flywheelRecord = await updateFlywheelRecord(tokenAddress, imageUrl);

    return NextResponse.json({
      success: true,
      flywheel: flywheelRecord,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Flywheel update API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Update failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}