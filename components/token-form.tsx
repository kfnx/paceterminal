'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  RiAddLine,
  RiCloseLine,
  RiCoinLine,
  RiSaveLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';
import type { Token } from '@/hooks/use-tokens';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';

interface TokenFormProps {
  token?: Token | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  label: string;
  address: string;
  description: string;
  tier: number | null;
  image: string;
  ordering: number | null;
}

const initialFormData: FormData = {
  name: '',
  label: '',
  address: '',
  description: '',
  tier: null,
  image: '',
  ordering: null,
};

const tierOptions = [
  { value: 1, label: 'S Tier' },
  { value: 2, label: 'A Tier' },
  { value: 3, label: 'B Tier' },
  { value: 4, label: 'C Tier' },
];

export function TokenForm({
  token,
  isOpen,
  onClose,
  onSuccess,
}: TokenFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!token;

  useEffect(() => {
    if (token) {
      setFormData({
        name: token.name || '',
        label: token.label || '',
        address: token.address || '',
        description: token.description || '',
        tier: token.tier,
        image: token.image || '',
        ordering: token.ordering,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [token, isOpen]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Token name is required');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Token address is required');
      return false;
    }
    if (!formData.tier) {
      toast.error('Token tier is required');
      return false;
    }
    if (formData.ordering !== null && formData.ordering < 0) {
      toast.error('Ordering must be 0 or greater');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const tokenData = {
        name: formData.name.trim(),
        label: formData.label.trim() || null,
        address: formData.address.trim(),
        description: formData.description.trim() || null,
        tier: formData.tier,
        image: formData.image.trim() || null,
        ordering: formData.ordering,
        updated_at: new Date().toISOString(),
      };

      if (isEditing && token) {
        // Update existing token
        const { error: updateError } = await supabase
          .from('tokens')
          .update(tokenData)
          .eq('address', token.address);

        if (updateError) throw updateError;
      } else {
        // Create new token
        const { error: insertError } = await supabase.from('tokens').insert({
          ...tokenData,
          created_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;
      }

      toast.success(`Token ${isEditing ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err) {
      console.error('Error saving token:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to save token');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <Modal.Header>
          <Modal.Title>
            {isEditing ? 'Edit Token' : 'Add New Token'}
          </Modal.Title>
          <Modal.Description>
            {isEditing
              ? 'Update the token information below.'
              : 'Fill in the details to create a new token.'}
          </Modal.Description>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-6'>
            {/* Token Image */}
            <div className='flex items-center gap-4'>
              {formData.image ? (
                <Avatar.Root size='64'>
                  <Avatar.Image src={formData.image} />
                </Avatar.Root>
              ) : (
                <div className='flex size-16 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                  <RiCoinLine className='size-8 text-text-sub-600' />
                </div>
              )}
              <div className='flex w-full flex-col gap-1'>
                <Label.Root htmlFor='image'>Image URL</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      type='url'
                      placeholder='https://example.com/token-image.png'
                      value={formData.image}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('image', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            {/* Token Name and Label */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='name'>Name</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      placeholder='Enter token name'
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('name', e.target.value)
                      }
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='label'>Label</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      placeholder='Enter token label'
                      value={formData.label}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('label', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            {/* Token Address */}
            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='address'>Address</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    placeholder='Enter Solana token address'
                    value={formData.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('address', e.target.value)
                    }
                    required
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            {/* Tier and Ordering */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div className='flex flex-col gap-1'>
                <Label.Root>Tier</Label.Root>
                <Select.Root
                  value={formData.tier?.toString() || ''}
                  onValueChange={(value) =>
                    handleInputChange('tier', value ? parseInt(value) : null)
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder='Select tier' />
                  </Select.Trigger>
                  <Select.Content>
                    {tierOptions.map((option) => (
                      <Select.Item
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='ordering'>Ordering</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      type='number'
                      min='0'
                      placeholder='Display order (optional)'
                      value={formData.ordering?.toString() || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          'ordering',
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            {/* Description */}
            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='description'>Description</Label.Root>
              <Textarea.Root
                placeholder='Enter token description'
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('description', e.target.value)
                }
                rows={4}
              >
                <Textarea.CharCounter max={512} />
              </Textarea.Root>
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
              <Button.Icon as={RiCloseLine} />
              Cancel
            </Button.Root>
            <Button.Root type='submit' disabled={isSubmitting}>
              <Button.Icon as={isEditing ? RiSaveLine : RiAddLine} />
              {isEditing ? 'Update Token' : 'Create Token'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
