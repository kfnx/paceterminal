'use client';

import * as React from 'react';
import { useTranslation } from '@/contexts/translation-context';
import { RiCloseLine, RiSaveLine } from '@remixicon/react';
import { toast } from 'sonner';

import type { Alpha } from '@/hooks/use-alpha';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
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
  const { locale } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Default fields (Indonesian)
  const [title, setTitle] = React.useState(alpha?.title || '');
  const [text, setText] = React.useState(alpha?.text || '');

  // English fields
  const [titleEn, setTitleEn] = React.useState(alpha?.title_en || '');
  const [textEn, setTextEn] = React.useState(alpha?.text_en || '');

  React.useEffect(() => {
    setTitle(alpha?.title || '');
    setText(alpha?.text || '');
    setTitleEn(alpha?.title_en || '');
    setTextEn(alpha?.text_en || '');
  }, [alpha]);

  const handleClose = () => {
    onClose();
    // Reset form
    setTitle('');
    setText('');
    setTitleEn('');
    setTextEn('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least the default title is provided
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = alpha ? '/api/alpha/update' : '/api/alpha/create';
      const method = alpha ? 'PUT' : 'POST';

      const requestBody: any = {
        ...(alpha && { id: alpha.id }),
        address: tokenAddress,
        title: title.trim(),
        text: text.trim() || null,
      };

      // Add English fields if they exist
      if (titleEn.trim()) {
        requestBody.title_en = titleEn.trim();
      }
      if (textEn.trim()) {
        requestBody.text_en = textEn.trim();
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
        <Modal.Header>
          <Modal.Title>{alpha ? 'Edit Alpha' : 'Add Alpha'}</Modal.Title>
          <Modal.Description>
            {alpha
              ? 'Update the alpha information for this token.'
              : 'Add new alpha content for this token.'}
          </Modal.Description>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-6'>
            {/* Default Title (Indonesian) */}
            <div className='flex flex-col gap-2'>
              <Label.Root>
                Title (Indonesian) <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter alpha title in Indonesian...'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            {/* Default Content (Indonesian) */}
            <div className='flex flex-col gap-2'>
              <Label.Root>Alpha Content (Indonesian)</Label.Root>
              <Textarea.Root
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Enter alpha content, insights, analysis in Indonesian...'
                rows={6}
                disabled={isSubmitting}
              />
            </div>

            {/* English Title */}
            <div className='flex flex-col gap-2'>
              <Label.Root>Title (English)</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder='Enter alpha title in English...'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            {/* English Content */}
            <div className='flex flex-col gap-2'>
              <Label.Root>Alpha Content (English)</Label.Root>
              <Textarea.Root
                value={textEn}
                onChange={(e) => setTextEn(e.target.value)}
                placeholder='Enter alpha content, insights, analysis in English...'
                rows={6}
                disabled={isSubmitting}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <RiCloseLine className='size-4' />
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              disabled={isSubmitting || !title.trim()}
              variant='primary'
            >
              <RiSaveLine className='size-4' />
              {isSubmitting
                ? 'Saving...'
                : alpha
                  ? 'Update Alpha'
                  : 'Create Alpha'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
