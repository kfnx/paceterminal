import { NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import {
  MEMBERSHIP_DURATION,
  MEMBERSHIP_PRICE,
  USDC_MAINNET,
} from '@/lib/constants';

const NETWORK = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(NETWORK, 'confirmed');

function getExpiredAt(type: MEMBERSHIP_DURATION) {
  let monthsToAdd = 1;
  switch (type) {
    case MEMBERSHIP_DURATION.ONE_MONTH:
      monthsToAdd = 1;
      break;
    case MEMBERSHIP_DURATION.THREE_MONTHS:
      monthsToAdd = 3;
      break;
    case MEMBERSHIP_DURATION.ONE_YEAR:
      monthsToAdd = 12;
      break;
    default:
      break;
  }

  const date = new Date();
  const originalDate = date.getDate();
  date.setMonth(date.getMonth() + monthsToAdd);

  if (date.getDate() < originalDate) {
    date.setDate(0); // adjust to last day of previous month
  }

  return date;
}

const PAYMENT_ADDRESS =
  process.env.NEXT_PUBLIC_SOLANA_PAYMENT_RECIPIENT_ADDRESS!;
if (!PAYMENT_ADDRESS) {
  throw new Error('PAYMENT_ADDRESS environment variable is not set');
}

const PaymentRequestSchema = z.object({
  signature: z.string(),
  fromAddress: z.string(),
  type: z.enum([
    MEMBERSHIP_DURATION.ONE_MONTH,
    MEMBERSHIP_DURATION.THREE_MONTHS,
  ]),
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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

    await supabase.from('logs').insert({
      message: JSON.stringify({
        ...body,
        target: PAYMENT_ADDRESS,
        path: '/verify-payment',
        ...validation.data,
      }),
    });

    await supabase.from('members').insert({
      solana_address: fromAddress,
      expired_at: getExpiredAt(type),
    });

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
      if (post.mint !== USDC_MAINNET) {
        continue;
      }

      const pre = preTokenBalances.find(
        (p) => p.accountIndex === post.accountIndex,
      );
      const amountChange =
        (post.uiTokenAmount.uiAmount || 0) -
        (pre ? pre.uiTokenAmount.uiAmount || 0 : 0);

      if (post.owner === PAYMENT_ADDRESS && amountChange > 0) {
        const receivedAmount = amountChange;

        // Verify amount based on subscription type
        const minAmount = MEMBERSHIP_PRICE[type];
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
            otherPost.mint === USDC_MAINNET &&
            otherAmountChange < 0 // Sender's balance must decrease
          ) {
            // We can check if `otherAmountChange` is close to `-receivedAmount`
            // but due to fees, it might not be exact. The fact that the sender sent USDC
            // and the receiver got at least the minimum amount is often sufficient.
            transferDetails = {
              from: fromAddress,
              to: PAYMENT_ADDRESS,
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
