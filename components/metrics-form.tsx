'use client';

import * as React from 'react';
import { useTranslation } from '@/contexts/translation-context';
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
  const { locale } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Default fields (ID)
  const [label, setLabel] = React.useState(metric?.label || '');
  const [value, setValue] = React.useState(metric?.value || '');
  const [description, setDescription] = React.useState(
    metric?.description || '',
  );

  // EN fields
  const [labelEn, setLabelEn] = React.useState(metric?.label_en || '');
  const [valueEn, setValueEn] = React.useState(metric?.value_en || '');
  const [descriptionEn, setDescriptionEn] = React.useState(
    metric?.description_en || '',
  );

  const [source, setSource] = React.useState(metric?.source || '');
  const [order, setOrder] = React.useState(metric?.ordering?.toString() || '');

  // Reset form when metric changes
  React.useEffect(() => {
    setLabel(metric?.label || '');
    setValue(metric?.value || '');
    setDescription(metric?.description || '');
    setLabelEn(metric?.label_en || '');
    setValueEn(metric?.value_en || '');
    setDescriptionEn(metric?.description_en || '');
    setSource(metric?.source || '');
    setOrder(metric?.ordering?.toString() || '');
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

      const requestBody: any = {
        ...(metric && { id: metric.id }),
        address: tokenAddress,
        label: label.trim(),
        value: value.trim(),
        description: description.trim() || null,
        source: source.trim() || null,
        ordering: order.trim() ? parseInt(order.trim(), 10) : null,
      };

      // Add EN fields if they exist
      if (labelEn.trim()) {
        requestBody.label_en = labelEn.trim();
      }
      if (valueEn.trim()) {
        requestBody.value_en = valueEn.trim();
      }
      if (descriptionEn.trim()) {
        requestBody.description_en = descriptionEn.trim();
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
      setLabelEn('');
      setValueEn('');
      setDescriptionEn('');
      setSource('');
      setOrder('');
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
          <Modal.Body className='space-y-4'>
            {/* Label (ID) */}
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='flex flex-col gap-1'>
                <Label.Root>
                  Label (ID) <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      value={label}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLabel(e.target.value)
                      }
                      placeholder='Enter metric label in ID (e.g., Market Cap, Volume)'
                      disabled={isSubmitting}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              {/* Value (ID) */}
              <div className='flex flex-col gap-1'>
                <Label.Root>
                  Value (ID) <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      value={value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue(e.target.value)
                      }
                      placeholder='Enter metric value in ID (e.g., $1.2M, 150K)'
                      disabled={isSubmitting}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              {/* Label (EN) */}
              <div className='flex flex-col gap-1'>
                <Label.Root>Label (EN)</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      value={labelEn}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLabelEn(e.target.value)
                      }
                      placeholder='Enter metric label in EN (e.g., Market Cap, Volume)'
                      disabled={isSubmitting}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              {/* Value (EN) */}
              <div className='flex flex-col gap-1'>
                <Label.Root>Value (EN)</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      value={valueEn}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValueEn(e.target.value)
                      }
                      placeholder='Enter metric value in EN (e.g., $1.2M, 150K)'
                      disabled={isSubmitting}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            {/* Order */}
            <div className='flex flex-col gap-1'>
              <Label.Root>Order</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    type='number'
                    value={order}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOrder(e.target.value)
                    }
                    placeholder='Enter display order (e.g., 1, 2, 3)'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            {/* Description (ID) */}
            <div className='flex flex-col gap-1'>
              <Label.Root>Description (ID)</Label.Root>
              <Textarea.Root
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter additional description or context in ID...'
                disabled={isSubmitting}
              />
            </div>

            {/* Description (EN) */}
            <div className='flex flex-col gap-1'>
              <Label.Root>Description (EN)</Label.Root>
              <Textarea.Root
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder='Enter additional description or context in EN...'
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
