import * as React from 'react';
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiUserStarLine,
} from '@remixicon/react';

import type { Member } from '@/hooks/use-member';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';

export const memberStatus = (expiredAt: string | null) => {
  if (!expiredAt) return 'Unknown';
  return new Date(expiredAt).getTime() > Date.now() ? 'Active' : 'Expired';
};

export function MembersTable({ data: members }: { data: Member[] }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Solana Address</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Created</Table.Head>
          <Table.Head>Expired</Table.Head>
          <Table.Head>Updated</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members.map((member) => (
          <Table.Row key={member.id}>
            <Table.Cell>
              <div className='flex items-center gap-3'>
                <div className='bg-primary-50 rounded-full'>
                  <RiUserStarLine className='size-4 text-primary-base' />
                </div>
                <div className='font-medium text-text-strong-950'>
                  {member.solana_address}
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className='text-paragraph-sm text-text-sub-600'>
              {memberStatus(member.expired_at) === 'Active' ? (
                <Badge.Root variant='filled' color='green'>
                  Active
                </Badge.Root>
              ) : (
                <Badge.Root variant='filled' color='orange'>
                  Expired
                </Badge.Root>
              )}
            </Table.Cell>
            <Table.Cell className='text-paragraph-sm text-text-sub-600'>
              {formatDate(member.created_at)}
            </Table.Cell>
            <Table.Cell className='text-paragraph-sm text-text-sub-600'>
              {formatDate(member.expired_at)}
            </Table.Cell>
            <Table.Cell className='text-paragraph-sm text-text-sub-600'>
              {formatDate(member.updated_at)}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export function MemberTablePagination({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}) {
  const handlePageChange = (page: number) => {
    const maxPages = totalPages || 1;
    if (page >= 1 && page <= maxPages && onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    if (onPageSizeChange) {
      onPageSizeChange(parseInt(newPageSize, 10));
    }
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;
    const maxPages = totalPages || 1;

    if (maxPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= maxPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // Show pages 2-5, then ellipsis, then last page
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(maxPages);
      } else if (currentPage >= maxPages - 3) {
        // Show first page, ellipsis, then last 4 pages
        pages.push('...');
        for (let i = maxPages - 4; i <= maxPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(maxPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className='mt-auto'>
      <div className='mt-4 flex items-center justify-between py-4 lg:hidden'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button.Root>
        <span className='whitespace-nowrap text-center text-paragraph-sm text-text-sub-600'>
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
          disabled={currentPage >= (totalPages || 1)}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button.Root>
      </div>
      <div className='mt-10 hidden items-center gap-3 lg:flex'>
        <span className='flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
          Page {currentPage} of {totalPages || 1} ({total} total items)
        </span>

        <Pagination.Root>
          <Pagination.NavButton
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(1)}
          >
            <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <Pagination.NavIcon as={RiArrowLeftSLine} />
          </Pagination.NavButton>

          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className='px-2 text-paragraph-sm text-text-sub-600'>
                  ...
                </span>
              ) : (
                <Pagination.Item
                  current={page === currentPage}
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </Pagination.Item>
              )}
            </React.Fragment>
          ))}

          <Pagination.NavButton
            disabled={currentPage >= (totalPages || 1)}
            onClick={() => handlePageChange(totalPages || 1)}
          >
            <Pagination.NavIcon as={RiArrowRightDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton
            disabled={currentPage >= (totalPages || 1)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <Pagination.NavIcon as={RiArrowRightSLine} />
          </Pagination.NavButton>
        </Pagination.Root>

        <div className='flex flex-1 justify-end'>
          <Select.Root
            size='xsmall'
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <Select.Trigger className='w-auto'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={'10'}>10 / page</Select.Item>
              <Select.Item value={'15'}>15 / page</Select.Item>
              <Select.Item value={'25'}>25 / page</Select.Item>
              <Select.Item value={'50'}>50 / page</Select.Item>
              <Select.Item value={'100'}>100 / page</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
  );
}
