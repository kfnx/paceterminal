'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiCoinLine,
  RiExpandUpDownFill,
  RiMore2Line,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { atom, useSetAtom } from 'jotai';

import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date-formatter';
import type { Token } from '@/hooks/use-tokens';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';

import { TokenDetailDrawer } from './token-detail-drawer';

export const tokenDetailModalOpenAtom = atom(false);

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

function ActionCell({ row }: { row: any }) {
  const setDetailModalOpen = useSetAtom(tokenDetailModalOpenAtom);
  return (
    <Button.Root
      variant='neutral'
      mode='ghost'
      size='xsmall'
      onClick={() => setDetailModalOpen(true)}
    >
      <Button.Icon as={RiMore2Line} />
    </Button.Root>
  );
}

const columns: ColumnDef<Token>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Token Name
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const token = row.original;

      return (
        <div className='flex items-center gap-3'>
          {token.image ? (
            <Avatar.Root size='32'>
              <Avatar.Image src={token.image} />
            </Avatar.Root>
          ) : (
            <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiCoinLine className='size-5 text-text-sub-600' />
            </div>
          )}
          <div className='flex flex-col'>
            <div className='text-paragraph-sm text-text-strong-950'>
              {token.name}
            </div>
            {token.label && (
              <div className='text-paragraph-xs text-text-sub-600'>
                {token.label}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Address
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='font-mono text-paragraph-sm text-text-sub-600'>
        {row.original.address.slice(0, 8)}...{row.original.address.slice(-6)}
      </div>
    ),
  },
  {
    id: 'tier',
    accessorKey: 'tier',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Tier
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.tier || 'N/A'}
      </div>
    ),
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Description
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='max-w-xs truncate text-paragraph-sm text-text-sub-600'>
        {row.original.description || 'No description'}
      </div>
    ),
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Created
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {formatDate(row.original.created_at)}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ActionCell,
    meta: {
      className: 'px-5 w-0',
    },
  },
];

export function TokensTable({ data: tableData }: { data: Token[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      sorting: [
        {
          id: 'created_at',
          desc: true,
        },
      ],
    },
  });

  return (
    <>
      <TokenDetailDrawer />

      <Table.Root className='relative left-1/2 w-screen -translate-x-1/2 px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[860px]'>
        <Table.Header className='whitespace-nowrap'>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.Head
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Head>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows?.length > 0 &&
            table.getRowModel().rows.map((row, i, arr) => (
              <React.Fragment key={row.id}>
                <Table.Row data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell
                      key={cell.id}
                      className={cn(
                        'h-12',
                        cell.column.columnDef.meta?.className,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
                {i < arr.length - 1 && <Table.RowDivider />}
              </React.Fragment>
            ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}

export function TokenTablePagination() {
  return (
    <div className='mt-auto'>
      <div className='mt-4 flex items-center justify-between py-4 lg:hidden'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
        >
          Previous
        </Button.Root>
        <span className='whitespace-nowrap text-center text-paragraph-sm text-text-sub-600'>
          Page 2 of 16
        </span>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
        >
          Next
        </Button.Root>
      </div>
      <div className='mt-10 hidden items-center gap-3 lg:flex'>
        <span className='flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
          Page 2 of 16
        </span>

        <Pagination.Root>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowLeftSLine} />
          </Pagination.NavButton>
          <Pagination.Item>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item>3</Pagination.Item>
          <Pagination.Item current>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
          <Pagination.Item>...</Pagination.Item>
          <Pagination.Item>16</Pagination.Item>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowRightDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowRightSLine} />
          </Pagination.NavButton>
        </Pagination.Root>

        <div className='flex flex-1 justify-end'>
          <Select.Root size='xsmall' defaultValue='7'>
            <Select.Trigger className='w-auto'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={'7'}>7 / page</Select.Item>
              <Select.Item value={'15'}>15 / page</Select.Item>
              <Select.Item value={'50'}>50 / page</Select.Item>
              <Select.Item value={'100'}>100 / page</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
  );
}
