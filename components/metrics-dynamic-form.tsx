'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSaveLine,
} from '@remixicon/react';

import type {
  MetricDynamic,
  MetricDynamicValue,
} from '@/hooks/use-metrics-dynamic';
import { useDeleteDynamicMetricValue } from '@/hooks/use-metrics-dynamic';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import { formatDateDMY } from '@/utils/date-formatter';
import { toast } from 'sonner';

interface MetricsDynamicFormProps {
  metric?: MetricDynamic;
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MetricsDynamicForm({
  metric,
  tokenAddress,
  isOpen,
  onClose,
  onSuccess,
}: MetricsDynamicFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const deleteValueMutation = useDeleteDynamicMetricValue();

  // Form fields for metric definition
  const [label, setLabel] = React.useState(metric?.label || '');
  const [labelEn, setLabelEn] = React.useState(metric?.label_en || '');
  const [order, setOrder] = React.useState(metric?.ordering?.toString() || '');
  const [unit, setUnit] = React.useState(metric?.unit || '');
  const [unitEn, setUnitEn] = React.useState(metric?.unit_en || '');

  // Form fields for adding values
  const [value, setValue] = React.useState('');
  const [time, setTime] = React.useState('');

  // State to track if metric was just created (for showing add value section)
  const [isMetricCreated, setIsMetricCreated] = React.useState(false);
  const [createdMetricId, setCreatedMetricId] = React.useState<string | null>(
    null,
  );

  // State to track existing values
  const [existingValues, setExistingValues] = React.useState<
    MetricDynamicValue[]
  >([]);
  const [loadingValues, setLoadingValues] = React.useState(false);

  // State for inline editing
  const [editingValue, setEditingValue] = React.useState<{
    index: number;
    value: string;
    time: string;
  } | null>(null);

  // Fetch existing values when editing
  React.useEffect(() => {
    if (metric?.id) {
      fetchExistingValues(metric.id);
    } else {
      setExistingValues([]);
    }
  }, [metric?.id]);

  const fetchExistingValues = async (metricId: string) => {
    setLoadingValues(true);
    try {
      const response = await fetch(
        `/api/metrics-dynamic/values?metric_id=${metricId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setExistingValues(data.values || []);
      }
    } catch (error) {
      console.error('Error fetching existing values:', error);
    } finally {
      setLoadingValues(false);
    }
  };

  // Reset form when metric changes
  React.useEffect(() => {
    setLabel(metric?.label || '');
    setLabelEn(metric?.label_en || '');
    setOrder(metric?.ordering?.toString() || '');
    setUnit(metric?.unit || '');
    setUnitEn(metric?.unit_en || '');
    setValue('');
    setTime('');
    setIsMetricCreated(false);
    setCreatedMetricId(null);
  }, [metric]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!label.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = metric
        ? '/api/metrics-dynamic/update'
        : '/api/metrics-dynamic/create';
      const method = metric ? 'PUT' : 'POST';

      const requestBody: any = {
        ...(metric && { id: metric.id }),
        address: tokenAddress,
        label: label.trim(),
        label_en: labelEn.trim() || null,
        ordering: order.trim() ? parseInt(order.trim(), 10) : null,
        unit: unit.trim() || null,
        unit_en: unitEn.trim() || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to save dynamic metric');
      }

      const result = await response.json();

      // If this was a new metric creation, store the ID and show add value section
      if (!metric && result.data?.id) {
        setCreatedMetricId(result.data.id);
        setIsMetricCreated(true);
        // Close modal after creating new metric
        onSuccess();
        onClose();
        // Reset form
        setLabel('');
        setLabelEn('');
        setOrder('');
        setValue('');
        setTime('');
      } else {
        // For editing existing metrics, don't close the modal
        // so user can continue adding values
        onSuccess();
        // Don't call onClose() here to keep modal open for adding values
      }
    } catch (error) {
      console.error('Error saving dynamic metric:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddValue = async () => {
    const metricId = metric?.id || createdMetricId;
    if (!metricId || !value.trim() || !time.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/metrics-dynamic/add-value', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric_id: metricId,
          value: parseFloat(value),
          time: new Date(time).toISOString(),
        }),
      });

      if (!response.ok) {
        toast.error('Failed to add metric value');
      } else {
        // Reset value fields and refresh existing values
        setValue('');
        setTime('');
      }


      // Refresh existing values if editing
      if (metric?.id) {
        await fetchExistingValues(metric.id);
      }

      // Refresh existing values for newly created metrics too
      if (isMetricCreated && createdMetricId) {
        await fetchExistingValues(createdMetricId);
      }

      // Don't call onSuccess() when adding values to keep the form open
    } catch (error) {
      console.error('Error adding metric value:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteValue = async (valueTime: string) => {
    if (
      !metric?.id ||
      !confirm('Are you sure you want to delete this value?')
    ) {
      return;
    }

    try {
      await deleteValueMutation.mutateAsync({
        metric_id: metric.id,
        time: valueTime,
      });

      // Refresh existing values
      await fetchExistingValues(metric.id);
      // Don't call onSuccess() when deleting values to keep the form open
    } catch (error) {
      console.error('Error deleting metric value:', error);
    }
  };

  const handleStartEdit = (index: number, value: MetricDynamicValue) => {
    // Convert the time to local timezone for datetime-local input
    const date = new Date(value.time);
    const localTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);

    setEditingValue({
      index,
      value: value.value.toString(),
      time: localTime,
    });
  };

  const handleCancelEdit = () => {
    setEditingValue(null);
  };

  const handleSaveEdit = async () => {
    if (!editingValue || !metric?.id) return;

    const { index, value, time } = editingValue;
    if (!value.trim() || !time.trim()) return;

    setIsSubmitting(true);

    try {
      // Delete the old value
      await deleteValueMutation.mutateAsync({
        metric_id: metric.id,
        time: existingValues[index].time,
      });

      // Convert local time back to UTC for saving
      const localDate = new Date(time);
      const utcTime = new Date(
        localDate.getTime() + localDate.getTimezoneOffset() * 60000,
      ).toISOString();

      // Add the new value
      const response = await fetch('/api/metrics-dynamic/add-value', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric_id: metric.id,
          value: parseFloat(value),
          time: utcTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update metric value');
      }

      // Refresh existing values
      await fetchExistingValues(metric.id);
      setEditingValue(null);
    } catch (error) {
      console.error('Error updating metric value:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if we should show the add value section
  const shouldShowAddValueSection = metric || isMetricCreated;
  const currentMetricId = metric?.id || createdMetricId;

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <Modal.Header>
          <Modal.Title>
            {metric ? 'Edit Dynamic Metric' : 'Add Dynamic Metric'}
          </Modal.Title>
          <Modal.Description>
            {metric
              ? 'Update the dynamic metric information for this token.'
              : 'Add a new dynamic metric for this token.'}
          </Modal.Description>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className='max-h-[75vh] space-y-4 overflow-y-scroll'>
            {/* Metric Definition Section */}
            <div className='space-y-4'>
              <h3 className='text-sm text-gray-900 dark:text-gray-100 font-medium'>
                Metric Definition
              </h3>

              <div className='grid gap-6 md:grid-cols-2'>
                {/* Label (ID) */}
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

              {/* Unit Fields */}
              <div className='grid gap-6 md:grid-cols-2'>
                {/* Unit (ID) */}
                <div className='flex flex-col gap-1'>
                  <Label.Root>Unit (ID)</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        value={unit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setUnit(e.target.value)
                        }
                        placeholder='Enter unit in ID (e.g., Pengguna, Transaksi, %)'
                        disabled={isSubmitting}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                {/* Unit (EN) */}
                <div className='flex flex-col gap-1'>
                  <Label.Root>Unit (EN)</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        value={unitEn}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setUnitEn(e.target.value)
                        }
                        placeholder='Enter unit in EN (e.g., User, Transaction, %)'
                        disabled={isSubmitting}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              </div>
            </div>

            {/* Existing Values Section - Only show when editing */}
            {metric && existingValues.length > 0 && (
              <div className='space-y-4 pt-4'>
                <h3 className='text-sm text-gray-900 dark:text-gray-100 font-medium'>
                  Existing Values ({existingValues.length})
                </h3>

                {loadingValues ? (
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    Loading existing values...
                  </div>
                ) : existingValues.length > 0 ? (
                  <div className='max-h-80 space-y-2 overflow-y-auto'>
                    <div className='grid flex-1 grid-cols-6 gap-4'>
                      <div className='col-span-2 font-bold'>Time</div>
                      <div className='col-span-3 font-bold'>Value</div>
                    </div>

                    {existingValues.map((val, index) => (
                      <div key={index} className='grid grid-cols-6 gap-4'>
                        {editingValue?.index === index ? (
                          // Edit mode
                          <>
                            <Input.Root className='col-span-2'>
                              <Input.Wrapper>
                                <Input.Input
                                  type='date'
                                  value={editingValue.time}
                                  onChange={(e) =>
                                    setEditingValue({
                                      ...editingValue,
                                      time: e.target.value,
                                    })
                                  }
                                  disabled={isSubmitting}
                                />
                              </Input.Wrapper>
                            </Input.Root>
                            <Input.Root className='col-span-3'>
                              <Input.Wrapper>
                                <Input.Input
                                  type='number'
                                  value={editingValue.value}
                                  onChange={(e) =>
                                    setEditingValue({
                                      ...editingValue,
                                      value: e.target.value,
                                    })
                                  }
                                  disabled={isSubmitting}
                                />
                              </Input.Wrapper>
                            </Input.Root>
                          </>
                        ) : (
                          // View mode
                          <>
                            <div className='col-span-2 rounded-lg border border-bg-sub-300 p-2 text-paragraph-sm text-text-sub-600'>
                              {formatDateDMY(new Date(val.time))}
                            </div>
                            <div className='col-span-3 rounded-lg border border-bg-sub-300 p-2 text-paragraph-sm text-text-strong-950'>
                              {val.value.toLocaleString()}
                            </div>
                          </>
                        )}
                        {editingValue?.index === index ? (
                          <div className='col-span-1 space-x-2'>
                            <Button.Root
                              type='button'
                              variant='neutral'
                              mode='stroke'
                              onClick={handleSaveEdit}
                              disabled={isSubmitting}
                              size='medium'
                            >
                              <Button.Icon as={RiSaveLine} />
                            </Button.Root>
                            <Button.Root
                              type='button'
                              variant='neutral'
                              mode='stroke'
                              onClick={handleCancelEdit}
                              disabled={isSubmitting}
                              size='medium'
                            >
                              <Button.Icon as={RiCloseLine} />
                            </Button.Root>
                          </div>
                        ) : (
                          <div className='col-span-1 space-x-2'>
                            <Button.Root
                              type='button'
                              variant='neutral'
                              mode='stroke'
                              onClick={() => handleStartEdit(index, val)}
                              disabled={isSubmitting}
                              size='medium'
                            >
                              <Button.Icon as={RiEditLine} />
                            </Button.Root>
                            <Button.Root
                              type='button'
                              variant='neutral'
                              mode='stroke'
                              onClick={() => handleDeleteValue(val.time)}
                              disabled={deleteValueMutation.isPending}
                              size='medium'
                            >
                              <Button.Icon as={RiDeleteBinLine} />
                            </Button.Root>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    No values added yet. Add your first value below.
                  </div>
                )}
              </div>
            )}
            {/* Add Values Section - Show when editing existing metric or after creating new metric */}
            {shouldShowAddValueSection && (<div className='pt-2'>
              <h3 className='text-sm text-gray-900 dark:text-gray-100 font-medium'>
                Add Metric Value
              </h3>

              <div className='grid grid-cols-6 items-end gap-4 space-y-4'>
                {/* Time */}
                <div className='col-span-2 flex flex-col gap-1'>
                  <Label.Root>
                    Time <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        type='date'
                        value={time}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTime(e.target.value)
                        }
                        disabled={isSubmitting}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                {/* Value */}
                <div className='col-span-3 flex flex-col justify-start gap-1'>
                  <Label.Root>
                    Value <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        type='number'
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setValue(e.target.value)
                        }
                        placeholder='Enter numeric value (e.g., 1000000)'
                        disabled={isSubmitting}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                <div className='col-span-1'>
                  <Button.Root
                    type='button'
                    variant='neutral'
                    mode='stroke'
                    onClick={handleAddValue}
                    disabled={isSubmitting || !value.trim() || !time.trim()}
                  >
                    <Button.Icon as={RiAddLine} />
                    Add
                  </Button.Root>
                </div>
              </div>
            </div>)}
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
            <Button.Root type='submit' disabled={isSubmitting || !label.trim()}>
              <Button.Icon as={RiSaveLine} />
              {isSubmitting
                ? 'Saving...'
                : metric
                  ? 'Save Changes'
                  : 'Add Dynamic Metric'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
