'use client';

import * as React from 'react';
import * as Modal from '@/components/ui/modal';
import * as Button from '@/components/ui/button';
import { atom, useAtom } from 'jotai';
import * as Badge from '@/components/ui/badge';

export const usePaymentModal = () => {
  const [isOpen, setOpen] = React.useState(false);

  return { isOpen, openPaymentModal: () => setOpen(true), closePaymentModal: () => setOpen(false) };
}

export const paymentModalOpenAtom = atom(false);

export function PaymentModal() {
  const [open, setOpen] = useAtom(paymentModalOpenAtom);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Content className='max-w-[480px]'>
        <Modal.Body className='flex flex-col items-center justify-center gap-6 py-12'>
          <p className='text-heading-2xs'>Remove Ads</p>
          <div className='flex flex-row gap-12'>
            <div className='flex flex-col items-center justify-between gap-4'>
              <p className='text-label-xl'>$20 a month</p>
              <Button.Root variant='primary'>
                Pay with Crypto USDC
              </Button.Root>
            </div>
            <div className='flex flex-col items-center justify-between gap-4'>
              <p className='text-label-xl'>$200 a year </p>

              <Badge.Root size='medium' variant='light' color='green' className='mb-8'>
                SAVE $40!
              </Badge.Root>
              <Button.Root variant='primary'>
                Pay with Crypto USDC
              </Button.Root>
            </div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
