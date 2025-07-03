'use client';

import * as React from 'react';
import { RiCloseLine } from '@remixicon/react';
import { toast } from 'sonner';

import type { Alpha } from '@/hooks/use-alpha';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Modal from '@/components/ui/modal';
import * as Textarea from '@/components/ui/textarea';

interface AlphaFormProps {
  alpha?: Alpha;
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AlphaForm({
  alpha,
  tokenAddress,
  isOpen,
  onClose,
  onSuccess,
}: AlphaFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [title, setTitle] = React.useState(alpha?.title || '');
  const [text, setText] = React.useState(alpha?.text || '');

  React.useEffect(() => {
    setTitle(alpha?.title || '');
    setText(alpha?.text || '');
  }, [alpha]);

  const handleClose = () => {
    onClose();
    // Reset form
    setTitle('');
    setText('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = alpha ? '/api/alpha/update' : '/api/alpha/create';
      const method = alpha ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(alpha && { id: alpha.id }),
          address: tokenAddress,
          title: title.trim(),
          text: text.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save alpha');
      }

      onSuccess();
      handleClose();
      toast.success(
        alpha ? 'Alpha updated successfully!' : 'Alpha created successfully!',
      );
    } catch (error) {
      console.error('Error saving alpha:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save alpha',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <div className='flex items-center justify-between'>
          <Modal.Title>{alpha ? 'Edit Alpha' : 'Add Alpha'}</Modal.Title>
          <Button.Root
            variant='neutral'
            mode='stroke'
            onClick={handleClose}
            className='size-8 p-0'
          >
            <RiCloseLine className='size-4' />
          </Button.Root>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='title'
              className='block text-paragraph-sm font-medium text-text-strong-950'
            >
              Title *
            </label>
            <Input.Wrapper>
              <Input.Input
                id='title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter alpha title...'
                disabled={isSubmitting}
                required
              />
            </Input.Wrapper>
          </div>

          <div>
            <label
              htmlFor='text'
              className='block text-paragraph-sm font-medium text-text-strong-950'
            >
              Content
            </label>
            <Textarea.Root
              id='text'
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Enter alpha content...'
              rows={8}
              disabled={isSubmitting}
            />
          </div>

          <div className='flex justify-end gap-3'>
            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' disabled={isSubmitting || !title.trim()}>
              {isSubmitting
                ? 'Saving...'
                : alpha
                  ? 'Update Alpha'
                  : 'Create Alpha'}
            </Button.Root>
          </div>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
