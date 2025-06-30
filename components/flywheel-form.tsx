'use client';

import * as React from 'react';
import { RiCloseLine, RiSaveLine } from '@remixicon/react';

import * as Modal from '@/components/ui/modal';
import * as Label from '@/components/ui/label';
import * as Button from '@/components/ui/button';
import { FlywheelImageUploader } from '@/components/ui/flywheel-image-uploader';
import type { Flywheel } from '@/hooks/use-flywheel';

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
          <Modal.Body className='space-y-6'>
            {/* Flywheel Image Upload */}
            <div className='flex flex-col gap-1'>
              <Label.Root>Flywheel Image</Label.Root>
              <FlywheelImageUploader
                tokenAddress={tokenAddress}
                currentImageUrl={flywheel?.image || undefined}
                onImageUploaded={handleImageUploaded}
                disabled={isSubmitting}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={onClose}
              disabled={isSubmitting}
            >
              <Button.Icon as={RiCloseLine} />
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              disabled={!imageUrl.trim() || isSubmitting}
            >
              <Button.Icon as={RiSaveLine} />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
} 