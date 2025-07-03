'use client';

import * as React from 'react';
import { RiCloseLine, RiSaveLine } from '@remixicon/react';

import type { Update } from '@/hooks/use-updates';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Textarea from '@/components/ui/textarea';

interface UpdatesFormProps {
  update?: Update;
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdatesForm({
  update,
  tokenAddress,
  isOpen,
  onClose,
  onSuccess,
}: UpdatesFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [title, setTitle] = React.useState(update?.title || '');
  const [description, setDescription] = React.useState(
    update?.description || '',
  );
  const [link, setLink] = React.useState(update?.link || '');
  const [image, setImage] = React.useState(update?.image || '');

  // Reset form when update changes
  React.useEffect(() => {
    setTitle(update?.title || '');
    setDescription(update?.description || '');
    setLink(update?.link || '');
    setImage(update?.image || '');
  }, [update]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSuccess = () => {
    onSuccess();
    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setLink('');
    setImage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !link.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (update) {
        // Update existing update
        const response = await fetch('/api/updates/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: update.id,
            title: title.trim(),
            description: description.trim(),
            link: link.trim(),
            image: image.trim() || null,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update update');
        }
      } else {
        // Create new update
        const response = await fetch('/api/updates/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: tokenAddress,
            title: title.trim(),
            description: description.trim(),
            link: link.trim(),
            image: image.trim() || null,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create update');
        }
      }

      handleSuccess();
    } catch (error) {
      console.error('Error submitting update:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <Modal.Header>
          <Modal.Title>{update ? 'Edit Update' : 'Add Update'}</Modal.Title>
          <Modal.Description>
            {update
              ? 'Update the information for this update.'
              : 'Add a new update for this token.'}
          </Modal.Description>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-6'>
            {/* Title */}
            <div className='flex flex-col gap-2'>
              <Label.Root>
                Title <span className='text-red-500'>*</span>
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter update title...'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            {/* Description */}
            <div className='flex flex-col gap-2'>
              <Label.Root>
                Description <span className='text-red-500'>*</span>
              </Label.Root>
              <Textarea.Root
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter update description...'
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Link */}
            <div className='flex flex-col gap-2'>
              <Label.Root>
                Link <span className='text-red-500'>*</span>
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder='Enter update link (URL)...'
                    type='url'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            {/* Image (optional) */}
            <div className='flex flex-col gap-2'>
              <Label.Root>Image URL (optional)</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder='Enter image URL...'
                    type='url'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
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
              disabled={
                isSubmitting ||
                !title.trim() ||
                !description.trim() ||
                !link.trim()
              }
            >
              <Button.Icon as={RiSaveLine} />
              {isSubmitting
                ? 'Saving...'
                : update
                  ? 'Save Changes'
                  : 'Add Update'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
