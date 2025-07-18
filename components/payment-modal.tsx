'use client';

import * as React from 'react';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { atom, useAtom } from 'jotai';
import { toast } from 'sonner';

import { MEMBERSHIP_DURATION, MEMBERSHIP_PRICE } from '@/lib/constants';
import { useMemberStatus } from '@/hooks/use-member-status';
import { useWalletTransaction } from '@/hooks/use-wallet-transaction';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';

export const paymentModalOpenAtom = atom(false);

export function PaymentModal() {
  const [open, setOpen] = useAtom(paymentModalOpenAtom);
  const [paymentType, setPaymentType] =
    React.useState<MEMBERSHIP_DURATION | null>(null);
  const { publicKey } = useWallet();
  const { refetch: refetchMemberStatus } = useMemberStatus();

  const { isExecuting, signature, error, success, payUSDC, resetTransaction } =
    useWalletTransaction();

  const handlePay = (type: MEMBERSHIP_DURATION) => {
    setPaymentType(type);
    payUSDC(type);
  };

  React.useEffect(() => {
    const toastId = 'payment-toast';
    if (isExecuting) {
      toast.loading('Transaction is being processed...', {
        id: toastId,
      });
    } else {
      toast.dismiss(toastId);
    }
  }, [isExecuting]);

  React.useEffect(() => {
    const toastId = 'payment-toast';
    if (error) {
      toast.error(error, {
        id: toastId,
        duration: 5000,
      });
    }
  }, [error]);

  React.useEffect(() => {
    const verifyPayment = async () => {
      const fromAddress = publicKey?.toBase58();
      if (success && signature && fromAddress && paymentType) {
        const toastId = 'payment-toast';
        toast.success('Transaction successful! Verifying...', {
          id: toastId,
          action: {
            label: 'View Transaction',
            onClick: () =>
              window.open(`https://solscan.io/tx/${signature}`, '_blank'),
          },
        });

        try {
          const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              signature,
              fromAddress,
              type: paymentType,
            }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            toast.success('Payment verified!', {
              id: 'verification-toast',
            });

            // Refetch member status to update the UI immediately
            await refetchMemberStatus();

            setOpen(false);
          } else {
            toast.error(result.message || 'Payment verification failed.', {
              id: 'verification-toast',
            });
          }
        } catch (e) {
          toast.error('An error occurred during verification.', {
            id: 'verification-toast',
          });
        }
      }
    };

    verifyPayment();
  }, [
    success,
    signature,
    publicKey,
    paymentType,
    setOpen,
    refetchMemberStatus,
  ]);

  React.useEffect(() => {
    // When the modal closes, reset the transaction state
    if (!open) {
      resetTransaction();
    }
  }, [open, resetTransaction]);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Content className='max-w-[800px]'>
        <Modal.Body>
          <div className='mb-2 border-b border-stroke-soft-200 pb-2 text-center'>
            <h2 className='text-xl text-gray-900 font-semibold'>
              Choose a plan
            </h2>
          </div>

          <div className='flex flex-col gap-4 p-2 sm:flex-row'>
            <div className='flex flex-1 flex-col rounded-xl border border-stroke-soft-200 bg-white p-6'>
              <div className='mb-2 flex gap-2 sm:mb-6'>
                <div className='text-title-h2 font-bold sm:text-title-h1'>
                  ${MEMBERSHIP_PRICE[MEMBERSHIP_DURATION.ONE_MONTH]}
                </div>
                <div className='self-end pb-2 text-paragraph-lg text-text-sub-600'>
                  a month
                </div>
              </div>

              <div className='mb-4 flex-1 space-y-3'>
                <div className='text-sm text-gray-700 flex'>
                  <span className='mr-3 h-4 w-4 text-black'>•</span>
                  Remove ads
                </div>
                <div className='text-sm text-gray-700 flex'>
                  <span className='mr-3 h-4 w-4 text-black'>•</span>
                  Premium contents
                </div>
                <div className='text-sm text-gray-700 flex'>
                  <span className='mr-3 h-4 w-4 text-black'>•</span>
                  Tierlist curated tokens
                </div>
              </div>

              <Button.Root
                variant='neutral'
                mode='stroke'
                className='w-full'
                onClick={() => handlePay(MEMBERSHIP_DURATION.ONE_MONTH)}
                disabled={isExecuting}
              >
                Pay with Crypto
              </Button.Root>
            </div>

            <div className='relative flex flex-1 flex-col rounded-xl border border-stroke-soft-200 p-6'>
              <div className='absolute right-4 top-3'>
                <Badge.Root size='medium' variant='lighter' color='green'>
                  <Badge.Icon as={RiCheckboxCircleFill} />
                  BEST SELLER
                </Badge.Root>
              </div>

              <div className='mb-2 flex gap-2 sm:mb-6'>
                <div className='text-title-h2 font-bold sm:text-title-h1'>
                  ${MEMBERSHIP_PRICE[MEMBERSHIP_DURATION.THREE_MONTHS]}
                </div>
                <div className='self-end pb-2 text-paragraph-lg text-text-sub-600'>
                  for 3 months
                </div>
              </div>

              <div className='mb-4 flex-1 space-y-3'>
                <div className='text-sm text-gray-700 flex'>
                  <span className='mr-3 h-4 w-4 text-black'>•</span>
                  Save 33%
                </div>
                <div className='text-sm text-gray-700 flex'>
                  <span className='mr-3 h-4 w-4 text-black'>•</span>
                  Remove ads
                </div>
                <div className='text-sm text-gray-700 flex'>
                  <span className='mr-3 h-4 w-4 text-black'>•</span>
                  Premium contents
                </div>
                <div className='text-sm text-gray-700 flex'>
                  <span className='mr-3 h-4 w-4 text-black'>•</span>
                  Tierlist curated tokens
                </div>
              </div>

              <Button.Root
                variant='primary'
                className='w-full'
                onClick={() => handlePay(MEMBERSHIP_DURATION.THREE_MONTHS)}
                disabled={isExecuting}
              >
                Pay with Crypto
              </Button.Root>
            </div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
