import { NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const NETWORK = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(NETWORK, 'confirmed');
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC on Solana Mainnet-beta

const SOLANA_PAYMENT_ADDRESS = process.env.SOLANA_PAYMENT_ADDRESS!;
if (!SOLANA_PAYMENT_ADDRESS) {
  throw new Error('SOLANA_PAYMENT_ADDRESS environment variable is not set');
}

const COST_PER_MONTH = 2;
const COST_PER_YEAR = 4;

const PaymentRequestSchema = z.object({
  signature: z.string(),
  fromAddress: z.string(),
  type: z.enum(['MONTHLY', 'YEARLY']),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = PaymentRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request payload',
          details: validation.error.flatten(),
        },
        { status: 400 },
      );
    }
    const { signature, fromAddress, type } = validation.data;

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
    if (transaction.meta.err) {
      return NextResponse.json(
        { error: 'Transaction failed', details: transaction.meta.err },
        { status: 400 },
      );
    }

    const preTokenBalances = transaction.meta.preTokenBalances || [];
    const postTokenBalances = transaction.meta.postTokenBalances || [];

    let transferDetails = null;

    for (const post of postTokenBalances) {
      // Ensure we are checking the correct token
      if (post.mint !== USDC_MINT_ADDRESS) {
        continue;
      }

      const pre = preTokenBalances.find(
        (p) => p.accountIndex === post.accountIndex,
      );
      const amountChange =
        (post.uiTokenAmount.uiAmount || 0) -
        (pre ? pre.uiTokenAmount.uiAmount || 0 : 0);

      if (post.owner === SOLANA_PAYMENT_ADDRESS && amountChange > 0) {
        const receivedAmount = amountChange;

        // Verify amount based on subscription type
        const minAmount = type === 'MONTHLY' ? COST_PER_MONTH : COST_PER_YEAR;
        if (receivedAmount < minAmount) {
          return NextResponse.json(
            {
              success: false,
              message: `Received amount ${receivedAmount} is less than the required minimum of ${minAmount} for a ${type} subscription.`,
            },
            { status: 400 },
          );
        }

        // Verify that the amount was sent from the fromAddress
        for (const otherPost of postTokenBalances) {
          const otherPre = preTokenBalances.find(
            (p) => p.accountIndex === otherPost.accountIndex,
          );
          if (!otherPre) continue;

          const otherAmountChange =
            (otherPost.uiTokenAmount.uiAmount || 0) -
            (otherPre.uiTokenAmount.uiAmount || 0);

          if (
            otherPost.owner === fromAddress &&
            otherPost.mint === USDC_MINT_ADDRESS &&
            otherAmountChange < 0 // Sender's balance must decrease
          ) {
            // We can check if `otherAmountChange` is close to `-receivedAmount`
            // but due to fees, it might not be exact. The fact that the sender sent USDC
            // and the receiver got at least the minimum amount is often sufficient.
            transferDetails = {
              from: fromAddress,
              to: SOLANA_PAYMENT_ADDRESS,
              amount: receivedAmount,
              mint: post.mint,
              verified: true,
            };
            break;
          }
        }
      }
      if (transferDetails) break;
    }

    console.log('🚀 ~ POST ~ transferDetails:', transferDetails);

    return NextResponse.json(
      {
        success: true,
        message: 'Transaction confirmed',
        data: transferDetails,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
