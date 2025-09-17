'use client';

import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RiAddLine,
  RiBarChartLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFireLine,
} from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import * as Alert from '@/components/ui/alert';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Table from '@/components/ui/table';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Token name is required')
    .max(20, 'Token name must be less than 20 characters'),
  percentage: z
    .number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage must be at most 100'),
});

type FormData = z.infer<typeof formSchema>;

interface ChartEntry {
  name: string;
  percentage: number | null;
}

export default function BurnScreenerPage() {
  const [entries, setEntries] = useState<ChartEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ChartEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<ChartEntry | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/burn-screener');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch chart data');
      }

      setEntries(result.data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to fetch chart data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editingEntry) {
        // Update existing entry
        const response = await fetch('/api/admin/burn-screener', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingEntry.name,
            percentage: data.percentage,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update entry');
        }

        toast.success('Entry updated successfully');
      } else {
        // Create new entry
        const response = await fetch('/api/admin/burn-screener', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            toast.error('Token name already exists');
            return;
          }
          throw new Error(result.error || 'Failed to create entry');
        }

        toast.success('Entry created successfully');
      }

      setIsModalOpen(false);
      reset();
      setEditingEntry(null);
      fetchEntries();
    } catch (error: any) {
      console.error('Error saving entry:', error);
      toast.error(error.message || 'Failed to save entry');
    }
  };

  const handleEdit = (entry: ChartEntry) => {
    setEditingEntry(entry);
    setValue('name', entry.name);
    setValue('percentage', entry.percentage || 0);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingEntry) return;

    try {
      const response = await fetch(
        `/api/admin/burn-screener?name=${encodeURIComponent(deletingEntry.name)}`,
        { method: 'DELETE' },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete entry');
      }

      toast.success('Entry deleted successfully');
      setIsDeleteModalOpen(false);
      setDeletingEntry(null);
      fetchEntries();
    } catch (error: any) {
      console.error('Error deleting entry:', error);
      toast.error(error.message || 'Failed to delete entry');
    }
  };

  const handleAdd = () => {
    reset();
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const totalPercentage = entries.reduce(
    (sum, entry) => sum + (entry.percentage || 0),
    0,
  );

  const formatPercentage = (percentage: number | null) => {
    if (percentage === null) return '0.00%';
    return `${percentage.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Loading burn chart data...
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-title-h2 text-text-strong-950'>
            Burn Screener Management
          </h1>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Manage token burned/buyback percentages for the chart display
          </p>
        </div>
        <Button.Root onClick={handleAdd}>
          <Button.Icon as={RiAddLine} />
          Add Token
        </Button.Root>
      </div>

      {entries.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <RiFireLine className='text-text-sub-400 mb-4 size-12' />
          <h3 className='mb-2 text-title-h5 text-text-strong-950'>
            No burn data found
          </h3>
          <p className='mb-4 text-paragraph-sm text-text-sub-600'>
            Get started by adding your first token burn percentage
          </p>
          <Button.Root onClick={handleAdd}>
            <Button.Icon as={RiAddLine} />
            Add Token
          </Button.Root>
        </div>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Token</Table.Head>
              <Table.Head>Burn Percentage</Table.Head>
              <Table.Head className='w-[120px]'>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {entries.map((entry) => (
              <Table.Row key={entry.name}>
                <Table.Cell>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-50'>
                      <RiFireLine className='size-4 text-orange-600' />
                    </div>
                    <div className='font-medium text-text-strong-950'>
                      {entry.name}
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className='flex items-center gap-2'>
                    <span className='text-paragraph-sm font-medium text-text-strong-950'>
                      {formatPercentage(entry.percentage)}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className='flex items-center gap-1'>
                    <Button.Root
                      size='small'
                      variant='neutral'
                      mode='stroke'
                      onClick={() => handleEdit(entry)}
                    >
                      <Button.Icon as={RiEditLine} />
                    </Button.Root>
                    <Button.Root
                      size='small'
                      variant='error'
                      mode='stroke'
                      onClick={() => {
                        setDeletingEntry(entry);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Button.Icon as={RiDeleteBinLine} />
                    </Button.Root>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {/* Add/Edit Modal */}
      <Modal.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              {editingEntry ? 'Edit Entry' : 'Add New Entry'}
            </Modal.Title>
            <Modal.Description>
              {editingEntry
                ? 'Update the percentage for this token'
                : 'Add a new token to the burn screener chart'}
            </Modal.Description>
          </Modal.Header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4 px-6 py-4'>
              <div className='space-y-1'>
                <Label.Root htmlFor='name'>Token Name</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id='name'
                      {...register('name')}
                      disabled={!!editingEntry}
                      placeholder='e.g., DUPE'
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.name && (
                  <p className='text-sm mt-1 text-red-600'>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className='space-y-1'>
                <Label.Root htmlFor='percentage'>Percentage (%)</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id='percentage'
                      type='number'
                      step='0.01'
                      {...register('percentage', { valueAsNumber: true })}
                      placeholder='e.g., 21.32'
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.percentage && (
                  <p className='text-sm mt-1 text-red-600'>
                    {errors.percentage.message}
                  </p>
                )}
              </div>
            </div>
            <Modal.Footer>
              <Button.Root
                type='button'
                variant='neutral'
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button.Root>
              <Button.Root type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? editingEntry
                    ? 'Updating...'
                    : 'Creating...'
                  : editingEntry
                    ? 'Update'
                    : 'Create'}
              </Button.Root>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Root>

      {/* Delete Confirmation Modal */}
      <Modal.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Delete Entry</Modal.Title>
            <Modal.Description>
              Are you sure you want to delete the entry for &quot;
              {deletingEntry?.name}&quot;? This action cannot be undone.
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Button.Root
              variant='neutral'
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button.Root>
            <Button.Root variant='error' onClick={handleDelete}>
              Delete
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
