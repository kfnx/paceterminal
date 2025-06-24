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

import {
  ONE_MONTH_USDC_AMOUNT,
  ONE_YEAR_USDC_AMOUNT,
  PAYMENT_RECIPIENT,
  USDC_DEVNET,
  USDC_MAINNET,
} from '@/lib/constants';

export interface WalletTransactionState {
  isExecuting: boolean;
  signature: string | null;
  error: string | null;
  success: boolean;
}

export interface WalletTransactionActions {
  sendSol: (amount: number, recipient: string) => Promise<string | null>;
  sendToken: (
    amount: number,
    recipient: string,
    tokenMint: string,
  ) => Promise<string | null>;
  payUSDC: (type: 'ONE_MONTH' | 'ONE_YEAR') => Promise<string | null>;
  resetTransaction: () => void;
}

export interface UseWalletTransactionOptions {
  defaultTokenMint?: string; // Default token mint address
}

export function useWalletTransaction(
  options: UseWalletTransactionOptions = {},
): WalletTransactionState & WalletTransactionActions {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [isExecuting, setIsExecuting] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get token decimals based on mint address
  const getTokenDecimals = useCallback((mint: PublicKey) => {
    // USDC has 6 decimals, most other tokens have 9
    if (
      mint.equals(new PublicKey(USDC_MAINNET)) ||
      mint.equals(new PublicKey(USDC_DEVNET))
    ) {
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

  // Send token transaction (generic for any SPL token)
  const sendToken = useCallback(
    async (
      amount: number,
      recipient: string,
      tokenMint: string,
    ): Promise<string | null> => {
      if (!publicKey || !sendTransaction || !signTransaction) {
        setError('Wallet not connected or missing required functions');
        return null;
      }
      console.log('connection', connection.rpcEndpoint);
      console.log('sender address', publicKey.toBase58());
      console.log('receiver address', recipient);
      console.log('token address', tokenMint);

      try {
        setIsExecuting(true);
        setError(null);
        setSuccess(false);

        const recipientPubkey = new PublicKey(recipient);
        const mint = new PublicKey(tokenMint);
        const decimals = getTokenDecimals(mint);

        // Get sender's token account
        const senderTokenAccount = await getAssociatedTokenAddress(
          mint,
          publicKey,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        console.log('sender ATA:', senderTokenAccount.toBase58());

        // Get recipient's token account
        const recipientTokenAccount = await getAssociatedTokenAddress(
          mint,
          recipientPubkey,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        console.log('recipient ATA:', recipientTokenAccount.toBase58());

        const transaction = new Transaction();

        // Check if recipient token account exists
        try {
          await getAccount(connection, recipientTokenAccount);
        } catch (e: any) {
          console.log('recipient token account does not exist:', e);
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
    [publicKey, sendTransaction, signTransaction, connection, getTokenDecimals],
  );

  const payUSDC = useCallback(
    async (type: 'ONE_MONTH' | 'ONE_YEAR'): Promise<string | null> => {
      if (!publicKey || !sendTransaction || !signTransaction) {
        setError('Wallet not connected or missing required functions');
        return null;
      }
      console.log('connection', connection.rpcEndpoint);
      console.log('sender address', publicKey.toBase58());
      console.log('receiver address', PAYMENT_RECIPIENT);
      console.log('token address', USDC_MAINNET);

      try {
        setIsExecuting(true);
        setError(null);
        setSuccess(false);

        const recipientPubkey = new PublicKey(PAYMENT_RECIPIENT);
        const mint = new PublicKey(USDC_MAINNET);
        const decimals = getTokenDecimals(mint);

        // Get sender's token account
        const senderTokenAccount = await getAssociatedTokenAddress(
          mint,
          publicKey,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        console.log('sender ATA:', senderTokenAccount.toBase58());

        // Get recipient's token account
        const recipientTokenAccount = await getAssociatedTokenAddress(
          mint,
          recipientPubkey,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        console.log('recipient ATA:', recipientTokenAccount.toBase58());

        const transaction = new Transaction();

        // Check if recipient token account exists
        try {
          await getAccount(connection, recipientTokenAccount);
        } catch (e: any) {
          console.log('recipient token account does not exist:', e);
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

        const amount =
          type === 'ONE_MONTH'
            ? ONE_MONTH_USDC_AMOUNT * Math.pow(10, decimals)
            : ONE_YEAR_USDC_AMOUNT * Math.pow(10, decimals); // Convert to token units

        // Add transfer instruction
        transaction.add(
          createTransferInstruction(
            senderTokenAccount,
            recipientTokenAccount,
            publicKey,
            amount,
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
    [publicKey, sendTransaction, signTransaction, connection, getTokenDecimals],
  );

  return {
    // State
    isExecuting,
    signature,
    error,
    success,

    // Actions
    sendSol,
    sendToken,
    payUSDC,
    resetTransaction,
  };
}
