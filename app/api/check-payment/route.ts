import { NextResponse } from 'next/server';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

// Initialize Solana connection (using devnet for testing)
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SOLANA_PAYMENT_ADDRESS = process.env.SOLANA_PAYMENT_ADDRESS!;

export async function POST(request: Request) {
  try {
    const { signature } = await request.json();

    if (!signature) {
      return NextResponse.json(
        { error: 'Transaction signature is required' },
        { status: 400 },
      );
    }

    // Get transaction details
    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction || !transaction.meta) {
      return NextResponse.json(
        { error: 'Transaction not found or invalid' },
        { status: 404 },
      );
    }

    // Check if the transaction is successful
    if (!transaction.meta.err) {
      // Get the post-balance of the recipient address
      const recipientPubkey = new PublicKey(SOLANA_PAYMENT_ADDRESS);
      const postBalance = transaction.meta.postBalances[0];
      const preBalance = transaction.meta.preBalances[0];

      // Calculate the amount received in SOL
      const amountReceived = (postBalance - preBalance) / LAMPORTS_PER_SOL;

      // Check if the amount received is 0.5 SOL
      if (amountReceived === 0.5) {
        // Get the sender's address from the transaction
        const accountKeys = transaction.transaction.message.getAccountKeys();
        const senderAddress = accountKeys.get(0)?.toString();

        if (!senderAddress) {
          return NextResponse.json(
            { error: 'Could not determine sender address' },
            { status: 400 },
          );
        }

        // Add sender to whitelist table
        const { error: whitelistError } = await supabase
          .from('whitelist')
          .upsert(
            {
              address: senderAddress,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'address',
            },
          );

        if (whitelistError) {
          console.error('Error adding to whitelist:', whitelistError);
          return NextResponse.json(
            { error: 'Error adding to whitelist' },
            { status: 500 },
          );
        }

        return NextResponse.json({
          success: true,
          message:
            'Address received exactly 0.5 SOL and sender added to whitelist',
          amount: amountReceived,
          sender: senderAddress,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Address did not receive exactly 0.5 SOL',
          amount: amountReceived,
        });
      }
    } else {
      return NextResponse.json(
        { error: 'Transaction failed' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Error checking transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
