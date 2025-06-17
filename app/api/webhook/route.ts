import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Validation schema for the request body
const transactionSchema = z.object({
  to: z.string(),
  from: z.string(),
  amount: z.number().min(0),
});

// Your Solana address - replace with your actual address
const SOLANA_PAYMENT_ADDRESS = process.env.SOLANA_PAYMENT_ADDRESS;

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: Request) {
  return NextResponse.json({ message: 'api works!' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('body', body);

    await supabase.from('logs').insert({
      message: JSON.stringify({ ...body, target: SOLANA_PAYMENT_ADDRESS }),
    });

    // Validate the request body
    const result = transactionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const { to, from, amount } = result.data;

    // Check if the transaction is for your address and meets the minimum amount
    if (to === SOLANA_PAYMENT_ADDRESS && amount >= 0.5) {
      console.log('Transaction processed successfully', to, from, amount);

      // Store transaction in transactions table
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          from_address: from,
          amount: amount,
          status: 'completed',
          created_at: new Date().toISOString(),
        });

      if (transactionError) {
        console.error('Error storing transaction:', transactionError);
        return NextResponse.json(
          { error: 'Error storing transaction' },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { message: 'Transaction processed successfully' },
        { status: 200 },
      );
    }

    // Return 204 for transactions that don't meet the criteria
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error processing webhook:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
