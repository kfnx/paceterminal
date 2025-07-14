'use client';

import * as React from 'react';
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
      <Modal.Content className='max-w-[480px]'>
        <Modal.Body className='flex flex-col items-center justify-center gap-6 py-12'>
          <p className='text-heading-2xs'>Remove Ads</p>
          <div className='flex flex-row gap-12'>
            <div className='flex flex-col items-center justify-between gap-4'>
              <p className='text-label-xl'>
                ${MEMBERSHIP_PRICE[MEMBERSHIP_DURATION.ONE_MONTH]} a month
              </p>
              <Button.Root
                variant='primary'
                onClick={() => handlePay(MEMBERSHIP_DURATION.ONE_MONTH)}
                disabled={isExecuting}
              >
                Pay with Crypto USDC
              </Button.Root>
            </div>
            <div className='flex flex-col items-center justify-between gap-4'>
              <p className='text-label-xl'>
                $${MEMBERSHIP_PRICE[MEMBERSHIP_DURATION.THREE_MONTHS]} 3 months{' '}
              </p>

              <Badge.Root
                size='medium'
                variant='light'
                color='green'
                className='mb-8'
              >
                SAVE $29!
              </Badge.Root>
              <Button.Root
                variant='primary'
                onClick={() => handlePay(MEMBERSHIP_DURATION.THREE_MONTHS)}
                disabled={isExecuting}
              >
                Pay with Crypto USDC
              </Button.Root>
            </div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
