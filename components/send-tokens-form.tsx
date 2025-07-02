'use client';

import { useState } from 'react';
import {
  RiInformationLine,
  RiRefreshLine,
  RiSendPlaneLine,
  RiWallet3Line,
} from '@remixicon/react';

import { useWalletTransaction } from '@/hooks/use-wallet-transaction';
import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';

import { WalletButton } from './wallet-button';

export function SendTokensForm() {
  const [tokenMint, setTokenMint] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(9);

  const {
    isExecuting,
    signature,
    error,
    success,
    sendToken,
    resetTransaction,
  } = useWalletTransaction();

  const handleSendToken = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    if (!tokenMint.trim() || !recipientAddress.trim()) {
      return;
    }

    await sendToken(numAmount, recipientAddress.trim(), tokenMint.trim());
  };

  const handleReset = () => {
    resetTransaction();
    setAmount('');
  };

  const handleTokenMintChange = (value: string) => {
    setTokenMint(value);
    // Auto-detect decimals for known tokens
    if (
      value === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' ||
      value === '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
    ) {
      setTokenDecimals(6); // USDC has 6 decimals
    } else {
      setTokenDecimals(9); // Default for most SPL tokens
    }
  };

  const isValidForm = () => {
    const numAmount = parseFloat(amount);
    return (
      tokenMint.trim() &&
      recipientAddress.trim() &&
      !isNaN(numAmount) &&
      numAmount > 0
    );
  };

  return (
    <div className='border-gray-200 shadow-sm rounded-lg border bg-white p-6'>
      <div className='mb-6'>
        <h2 className='text-xl text-gray-900 mb-2 font-semibold'>
          Send SPL Token
        </h2>
        <p className='text-sm text-gray-600'>
          Transfer any SPL token to any Solana address
        </p>
      </div>

      {/* Wallet Connection */}
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <label className='text-sm text-gray-700 font-medium'>
            Wallet Connection
          </label>
          <WalletButton />
        </div>
      </div>

      {/* Token Mint Address */}
      <div className='mb-4'>
        <label className='text-sm text-gray-700 mb-2 block font-medium'>
          Token Mint Address *
        </label>
        <Input.Root>
          <Input.Wrapper>
            <Input.Input
              type='text'
              value={tokenMint}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTokenMintChange(e.target.value)
              }
              placeholder='Enter token mint address...'
              disabled={isExecuting}
              className='text-sm font-mono'
            />
          </Input.Wrapper>
        </Input.Root>
        <p className='text-xs text-gray-500 mt-1'>
          The mint address of the SPL token you want to send
        </p>
      </div>

      {/* Recipient Address */}
      <div className='mb-4'>
        <label className='text-sm text-gray-700 mb-2 block font-medium'>
          Recipient Address *
        </label>
        <Input.Root>
          <Input.Wrapper>
            <Input.Input
              type='text'
              value={recipientAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRecipientAddress(e.target.value)
              }
              placeholder='Enter recipient Solana address...'
              disabled={isExecuting}
              className='text-sm font-mono'
            />
          </Input.Wrapper>
        </Input.Root>
        <p className='text-xs text-gray-500 mt-1'>
          The Solana address that will receive the tokens
        </p>
      </div>

      {/* Amount */}
      <div className='mb-6'>
        <label className='text-sm text-gray-700 mb-2 block font-medium'>
          Amount *
        </label>
        <Input.Root>
          <Input.Wrapper>
            <Input.Input
              type='number'
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value)
              }
              placeholder='0.00'
              min='0.000001'
              step='0.000001'
              disabled={isExecuting}
            />
          </Input.Wrapper>
        </Input.Root>
        <p className='text-xs text-gray-500 mt-1'>
          Token decimals: {tokenDecimals} (auto-detected for known tokens)
        </p>
      </div>

      {/* Send Button */}
      <Button.Root
        onClick={handleSendToken}
        disabled={isExecuting || !isValidForm()}
        className='mb-4 w-full'
      >
        <Button.Icon as={RiSendPlaneLine} />
        {isExecuting ? 'Sending...' : `Send ${amount || '0'} Tokens`}
      </Button.Root>

      {/* Success Message */}
      {success && signature && (
        <Alert.Root className='mb-4' status='success' variant='light'>
          <Alert.Icon as={RiInformationLine} />
          <div>
            <p className='font-medium'>Transaction Successful!</p>
            <p className='text-sm mt-1'>Transaction signature: {signature}</p>
          </div>
        </Alert.Root>
      )}

      {/* Error Message */}
      {error && (
        <Alert.Root className='mb-4' status='error' variant='light'>
          <Alert.Icon as={RiInformationLine} />
          <div>
            <p className='font-medium'>Transaction Failed</p>
            <p className='text-sm mt-1'>{error}</p>
          </div>
        </Alert.Root>
      )}

      {/* Reset Button */}
      {(success || error) && (
        <Button.Root onClick={handleReset} mode='stroke' className='w-full'>
          <Button.Icon as={RiRefreshLine} />
          Send Another Transaction
        </Button.Root>
      )}

      {/* Info Box */}
      <div className='mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
        <div className='flex items-start'>
          <RiInformationLine className='mr-2 mt-0.5 flex-shrink-0 text-blue-500' />
          <div className='text-sm text-blue-800'>
            <p className='mb-1 font-medium'>Important Information:</p>
            <ul className='text-xs space-y-1'>
              <li>• Ensure you have sufficient SOL for transaction fees</li>
              <li>• Token accounts are created automatically if needed</li>
              <li>• Double-check addresses before sending</li>
              <li>• Transactions are irreversible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
