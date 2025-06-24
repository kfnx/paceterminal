import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

// Tell Next.js this route should be dynamic
export const dynamic = 'force-dynamic';

// Server-side Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * Validates if a string is a valid Solana address
 */
function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  // Check if address parameter is provided
  if (!address) {
    return NextResponse.json(
      {
        error: 'Address is required',
        message: 'Please provide a Solana address in the address parameter',
      },
      { status: 400 },
    );
  }

  // Validate Solana address format
  if (!isValidSolanaAddress(address)) {
    return NextResponse.json(
      {
        error: 'Invalid Solana address',
        message: 'The provided address is not a valid Solana address format',
      },
      { status: 400 },
    );
  }

  try {
    // Query the members table for this address
    const { data, error } = await supabase
      .from('members')
      .select('solana_address, expired_at, created_at')
      .eq('solana_address', address)
      .single();

    // Handle database errors
    if (error) {
      // PGRST116 means no rows found - user is not a member
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          isMember: false,
          isActive: false,
          message: 'Address is not registered as a member',
          data: null,
        });
      }

      // Other database errors
      console.error('Database error:', error);
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Failed to check membership status',
        },
        { status: 500 },
      );
    }

    // If we have data, check if membership is still active
    if (data && data.expired_at) {
      const expiryDate = new Date(data.expired_at);
      const now = new Date();
      const isActive = expiryDate > now;

      return NextResponse.json({
        isMember: true,
        isActive,
        message: isActive ? 'Membership is active' : 'Membership has expired',
        data: {
          solana_address: data.solana_address,
          expired_at: data.expired_at,
          created_at: data.created_at,
          expires_in_days: isActive
            ? Math.ceil(
                (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
              )
            : 0,
        },
      });
    }

    // Edge case: member exists but no expiry date
    return NextResponse.json({
      isMember: true,
      isActive: false,
      message: 'Member found but no expiry date set',
      data: {
        solana_address: data.solana_address,
        expired_at: null,
        created_at: data.created_at,
        expires_in_days: 0,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while checking membership',
      },
      { status: 500 },
    );
  }
}
