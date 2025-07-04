'use client';

import * as React from 'react';
import { RiCloseLine, RiSaveLine } from '@remixicon/react';

import type { Metric } from '@/hooks/use-metrics';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Textarea from '@/components/ui/textarea';

interface MetricsFormProps {
  metric?: Metric;
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MetricsForm({
  metric,
  tokenAddress,
  isOpen,
  onClose,
  onSuccess,
}: MetricsFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [label, setLabel] = React.useState(metric?.label || '');
  const [value, setValue] = React.useState(metric?.value || '');
  const [description, setDescription] = React.useState(
    metric?.description || '',
  );
  const [source, setSource] = React.useState(metric?.source || '');

  // Reset form when metric changes
  React.useEffect(() => {
    setLabel(metric?.label || '');
    setValue(metric?.value || '');
    setDescription(metric?.description || '');
    setSource(metric?.source || '');
  }, [metric]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!label.trim() || !value.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = metric ? '/api/metrics/update' : '/api/metrics/create';
      const method = metric ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(metric && { id: metric.id }),
          address: tokenAddress,
          label: label.trim(),
          value: value.trim(),
          description: description.trim() || null,
          source: source.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save metric');
      }

      onSuccess();
      onClose();
      // Reset form
      setLabel('');
      setValue('');
      setDescription('');
      setSource('');
    } catch (error) {
      console.error('Error saving metric:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <Modal.Header>
          <Modal.Title>{metric ? 'Edit Metric' : 'Add Metric'}</Modal.Title>
          <Modal.Description>
            {metric
              ? 'Update the metric information for this token.'
              : 'Add a new metric for this token.'}
          </Modal.Description>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-6'>
            {/* Label */}
            <div className='flex flex-col gap-1'>
              <Label.Root>
                Label <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={label}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLabel(e.target.value)
                    }
                    placeholder='Enter metric label (e.g., Market Cap, Volume)'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            {/* Value */}
            <div className='flex flex-col gap-1'>
              <Label.Root>
                Value <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setValue(e.target.value)
                    }
                    placeholder='Enter metric value (e.g., $1.2M, 150K)'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            {/* Description */}
            <div className='flex flex-col gap-1'>
              <Label.Root>Description</Label.Root>
              <Textarea.Root
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter additional description or context...'
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Source */}
            <div className='flex flex-col gap-1'>
              <Label.Root>Source</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={source}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSource(e.target.value)
                    }
                    placeholder='Enter data source (e.g., CoinGecko, DexScreener)'
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
              disabled={isSubmitting || !label.trim() || !value.trim()}
            >
              <Button.Icon as={RiSaveLine} />
              {isSubmitting
                ? 'Saving...'
                : metric
                  ? 'Save Changes'
                  : 'Add Metric'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
