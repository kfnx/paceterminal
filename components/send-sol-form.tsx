'use client';

import { useState } from 'react';
import {
  RiGlobalLine,
  RiInformationLine,
  RiRefreshLine,
  RiSendPlaneLine,
} from '@remixicon/react';

import { useNetworkInfo } from '@/hooks/use-network-info';
import { useWalletTransaction } from '@/hooks/use-wallet-transaction';
import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';

import { WalletButton } from './wallet-button';

export function SendSolForm() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const { isExecuting, signature, error, success, sendSol, resetTransaction } =
    useWalletTransaction();

  const networkInfo = useNetworkInfo();

  const handleSendSol = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    if (!recipientAddress.trim()) {
      return;
    }

    await sendSol(numAmount, recipientAddress.trim());
  };

  const handleReset = () => {
    resetTransaction();
    setAmount('');
    setRecipientAddress('');
  };

  const isValidForm = () => {
    const numAmount = parseFloat(amount);
    return recipientAddress.trim() && !isNaN(numAmount) && numAmount > 0;
  };

  return (
    <div className='border-gray-200 shadow-sm rounded-lg border bg-white p-6'>
      <div className='mb-6'>
        <h2 className='text-xl text-gray-900 mb-2 font-semibold'>Send SOL</h2>
        <p className='text-sm text-gray-600'>
          Transfer SOL to any Solana address
        </p>
      </div>

      {/* Network Information */}
      <div className='mb-6'>
        <div className={`rounded-lg border p-3 ${networkInfo.bgColor}`}>
          <div className='flex items-center gap-2'>
            <RiGlobalLine className={networkInfo.color} />
            <span className={`text-sm font-medium ${networkInfo.color}`}>
              {networkInfo.name}
            </span>
          </div>
          <div className='text-xs text-gray-500 mt-1'>
            {networkInfo.description}
          </div>
        </div>
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
          The Solana address that will receive the SOL
        </p>
      </div>

      {/* Amount */}
      <div className='mb-6'>
        <label className='text-sm text-gray-700 mb-2 block font-medium'>
          Amount (SOL) *
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
          Amount in SOL (1 SOL = 1,000,000,000 lamports)
        </p>
      </div>

      {/* Send Button */}
      <Button.Root
        onClick={handleSendSol}
        disabled={isExecuting || !isValidForm()}
        className='mb-4 w-full'
      >
        <Button.Icon as={RiSendPlaneLine} />
        {isExecuting ? 'Sending...' : `Send ${amount || '0'} SOL`}
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
              <li>
                • Ensure you have sufficient SOL for the transfer amount +
                transaction fees
              </li>
              <li>• Transaction fees are typically 0.000005 SOL</li>
              <li>• Double-check addresses before sending</li>
              <li>• Transactions are irreversible</li>
              <li>• SOL transfers are faster than SPL token transfers</li>
              {networkInfo.isDevnet && (
                <li>• You&apos;re on Devnet - use devnet SOL for testing</li>
              )}
              {networkInfo.isMainnet && (
                <li>• You&apos;re on Mainnet - real SOL will be transferred</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
