'use client';

import * as React from 'react';
import { RiCloseLine, RiSaveLine } from '@remixicon/react';

import type { Flywheel } from '@/hooks/use-flywheel';
import * as Button from '@/components/ui/button';
import { FlywheelImageUploader } from '@/components/ui/flywheel-image-uploader';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';

interface FlywheelFormProps {
  flywheel: Flywheel | null;
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FlywheelForm({
  flywheel,
  tokenAddress,
  isOpen,
  onClose,
  onSuccess,
}: FlywheelFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(flywheel?.image || '');

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // The image upload is already handled by the FlywheelImageUploader
      // This form submission is mainly for closing the modal and triggering success callback
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating flywheel:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <Modal.Header>
          <Modal.Title>
            {flywheel?.image ? 'Edit Flywheel Image' : 'Add Flywheel Image'}
          </Modal.Title>
          <Modal.Description>
            {flywheel?.image
              ? 'Update the flywheel image for this token.'
              : 'Upload a flywheel image for this token.'}
          </Modal.Description>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className='max-h-[75vh] space-y-6 overflow-y-scroll'>
            {/* Flywheel Image Upload */}
            <div className='flex flex-col gap-1'>
              <Label.Root>Image Preview</Label.Root>
              <FlywheelImageUploader
                tokenAddress={tokenAddress}
                currentImageUrl={flywheel?.image || undefined}
                onImageUploaded={handleImageUploaded}
                disabled={isSubmitting}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className='flex justify-end'>
            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={onClose}
              disabled={isSubmitting}
            >
              <Button.Icon as={RiCloseLine} />
              Close
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
