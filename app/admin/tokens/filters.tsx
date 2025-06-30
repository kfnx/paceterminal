'use client';

import { RiFilter3Fill, RiSearch2Line, RiSortDesc } from '@remixicon/react';
import { atom, useAtom } from 'jotai';
import React from 'react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

type TokenTier = 'all' | 's' | 'a' | 'b' | 'c';
type SortField = 'name' | 'created_at' | 'tier';
type SortOrder = 'asc' | 'desc';

export const tokenSearchAtom = atom<string>('');
export const tokenTierFilterAtom = atom<TokenTier>('all');
export const tokenSortFieldAtom = atom<SortField>('created_at');
export const tokenSortOrderAtom = atom<SortOrder>('desc');

export function Filters() {
  const [search, setSearch] = useAtom(tokenSearchAtom);
  const [localSearch, setLocalSearch] = React.useState(search);
  const [tierFilter, setTierFilter] = useAtom(tokenTierFilterAtom);
  const [sortField, setSortField] = useAtom(tokenSortFieldAtom);
  const [sortOrder, setSortOrder] = useAtom(tokenSortOrderAtom);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const handleClearFilters = () => {
    setLocalSearch('');
    setSearch('');
    setTierFilter('all');
    setSortField('created_at');
    setSortOrder('desc');
  };

  const hasActiveFilters = localSearch || tierFilter !== 'all';

  return (
    <div className='flex flex-col justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3'>
      <Input.Root className='lg:hidden'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input
            placeholder='Search tokens...'
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {hasActiveFilters && (
            <button
              type='button'
              onClick={handleClearFilters}
              className='hover:text-text-soft-600 text-text-soft-400'
            >
              <RiFilter3Fill className='size-5' />
            </button>
          )}
        </Input.Wrapper>
      </Input.Root>

      <SegmentedControl.Root
        value={tierFilter}
        onValueChange={(v) => setTierFilter(v as TokenTier)}
        className='lg:w-80'
      >
        <SegmentedControl.List>
          <SegmentedControl.Trigger value='all'>All</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='s'>S</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='a'>A</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='b'>B</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='c'>C</SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>

      <div className='hidden flex-wrap gap-3 min-[560px]:flex-nowrap lg:flex'>
        <Input.Root size='small' className='w-[300px]'>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input
              placeholder='Search tokens by name or address...'
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <Kbd.Root>
              <IconCmd className='size-2.5' />1
            </Kbd.Root>
          </Input.Wrapper>
        </Input.Root>

        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          className='flex-1 min-[560px]:flex-none'
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
        >
          <Button.Icon as={RiFilter3Fill} />
          Clear Filters
        </Button.Root>

        <Select.Root
          size='small'
          value={sortField}
          onValueChange={(value) => setSortField(value as SortField)}
        >
          <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
            <Select.TriggerIcon as={RiSortDesc} />
            <Select.Value placeholder='Sort by' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='name'>Name</Select.Item>
            <Select.Item value='created_at'>Created Date</Select.Item>
            <Select.Item value='tier'>Tier</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root
          size='small'
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as SortOrder)}
        >
          <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
            <Select.Value placeholder='Order' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='asc'>Ascending</Select.Item>
            <Select.Item value='desc'>Descending</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
}
