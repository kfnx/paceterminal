import { useCallback, useState } from 'react';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

// Default USDC token mint addresses
const USDC_MINT_MAINNET = new PublicKey(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
);
const USDC_MINT_DEVNET = new PublicKey(
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
);

export interface TransactionState {
  isExecuting: boolean;
  signature: string | null;
  error: string | null;
  success: boolean;
}

export interface TransactionActions {
  sendSol: (amount: number, recipient: string) => Promise<string | null>;
  sendUsdc: (
    amount: number,
    recipient: string,
    tokenMint?: string,
  ) => Promise<string | null>;
  sendUsdcToPace: (
    amount: number,
    tokenMint?: string,
  ) => Promise<string | null>;
  resetTransaction: () => void;
}

export interface UseSolanaTransactionOptions {
  defaultTokenMint?: string; // Default token mint address for transfers
  paceAddress?: string; // Custom Pace Terminal address
}

export function useSolanaTransaction(
  options: UseSolanaTransactionOptions = {},
): TransactionState & TransactionActions {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [isExecuting, setIsExecuting] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pace Terminal USDC address (configurable)
  const PACE_USDC_ADDRESS =
    options.paceAddress || 'pace8vZSciSoFhSZJ685YipGPbstTH7FYnrjFMZpjfM';

  // Get USDC mint based on network or custom token mint
  const getUsdcMint = useCallback(() => {
    // If custom token mint is provided, use it
    if (options.defaultTokenMint) {
      return new PublicKey(options.defaultTokenMint);
    }

    // Otherwise use default USDC mint based on network
    const endpoint = connection.rpcEndpoint;
    if (endpoint.includes('devnet')) {
      return USDC_MINT_DEVNET;
    }
    return USDC_MINT_MAINNET;
  }, [connection.rpcEndpoint, options.defaultTokenMint]);

  // Get token decimals based on mint address
  const getTokenDecimals = useCallback((mint: PublicKey) => {
    // USDC has 6 decimals, most other tokens have 9
    if (mint.equals(USDC_MINT_MAINNET) || mint.equals(USDC_MINT_DEVNET)) {
      return 6;
    }
    return 9; // Default for most SPL tokens
  }, []);

  // Reset transaction state
  const resetTransaction = useCallback(() => {
    setSignature(null);
    setError(null);
    setSuccess(false);
  }, []);

  // Send SOL transaction
  const sendSol = useCallback(
    async (amount: number, recipient: string): Promise<string | null> => {
      if (!publicKey || !sendTransaction || !signTransaction) {
        setError('Wallet not connected or missing required functions');
        return null;
      }

      try {
        setIsExecuting(true);
        setError(null);
        setSuccess(false);

        const recipientPubkey = new PublicKey(recipient);
        const lamports = amount * LAMPORTS_PER_SOL;

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubkey,
            lamports,
          }),
        );

        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = publicKey;

        const signedTx = await signTransaction(transaction);
        const txSignature = await connection.sendRawTransaction(
          signedTx.serialize(),
        );

        // Wait for confirmation
        await connection.confirmTransaction({
          signature: txSignature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        setSignature(txSignature);
        setSuccess(true);
        return txSignature;
      } catch (err) {
        console.error('Error sending SOL:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send SOL';
        setError(errorMessage);
        return null;
      } finally {
        setIsExecuting(false);
      }
    },
    [publicKey, sendTransaction, signTransaction, connection],
  );

  // Send USDC transaction
  const sendUsdc = useCallback(
    async (
      amount: number,
      recipient: string,
      tokenMint?: string,
    ): Promise<string | null> => {
      if (!publicKey || !sendTransaction || !signTransaction) {
        setError('Wallet not connected or missing required functions');
        return null;
      }

      try {
        setIsExecuting(true);
        setError(null);
        setSuccess(false);

        const recipientPubkey = new PublicKey(recipient);
        // Use provided token mint or default
        const mint = tokenMint ? new PublicKey(tokenMint) : getUsdcMint();
        const decimals = getTokenDecimals(mint);

        // Get sender's token account
        const senderTokenAccount = await getAssociatedTokenAddress(
          mint,
          publicKey,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        // Get recipient's token account
        const recipientTokenAccount = await getAssociatedTokenAddress(
          mint,
          recipientPubkey,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        const transaction = new Transaction();

        // Check if recipient token account exists
        try {
          await getAccount(connection, recipientTokenAccount);
        } catch {
          // Create recipient token account if it doesn't exist
          transaction.add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              recipientTokenAccount,
              recipientPubkey,
              mint,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID,
            ),
          );
        }

        // Add transfer instruction
        transaction.add(
          createTransferInstruction(
            senderTokenAccount,
            recipientTokenAccount,
            publicKey,
            amount * Math.pow(10, decimals), // Convert to token units
            [],
            TOKEN_PROGRAM_ID,
          ),
        );

        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = publicKey;

        const signedTx = await signTransaction(transaction);
        const txSignature = await connection.sendRawTransaction(
          signedTx.serialize(),
        );

        // Wait for confirmation
        await connection.confirmTransaction({
          signature: txSignature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        setSignature(txSignature);
        setSuccess(true);
        return txSignature;
      } catch (err) {
        console.error('Error sending token:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send token';
        setError(errorMessage);
        return null;
      } finally {
        setIsExecuting(false);
      }
    },
    [
      publicKey,
      sendTransaction,
      signTransaction,
      connection,
      getUsdcMint,
      getTokenDecimals,
    ],
  );

  // Send USDC to Pace Terminal (convenience function)
  const sendUsdcToPace = useCallback(
    async (amount: number, tokenMint?: string): Promise<string | null> => {
      return sendUsdc(amount, PACE_USDC_ADDRESS, tokenMint);
    },
    [sendUsdc, PACE_USDC_ADDRESS],
  );

  return {
    // State
    isExecuting,
    signature,
    error,
    success,

    // Actions
    sendSol,
    sendUsdc,
    sendUsdcToPace,
    resetTransaction,
  };
}
