'use client';

import * as React from 'react';
import { RiUserStarLine } from '@remixicon/react';

import { useMembers } from '@/hooks/use-member';
import * as Alert from '@/components/ui/alert';
import * as Badge from '@/components/ui/badge';
import {
  MembersTable,
  memberStatus,
  MemberTablePagination,
} from '@/components/member-table';

export default function AdminMembersPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { members, total, page, totalPages, loading, error, refetch } =
    useMembers(currentPage, pageSize);

  const activeMemberCount = members.filter(
    (member) => memberStatus(member.expired_at) === 'Active',
  ).length;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Loading members...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Alert.Root status='error' variant='light'>
          <Alert.Icon />

          <div>Failed to load members: {error}</div>
        </Alert.Root>
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-title-h2 text-text-strong-950'>
            Member Management
          </h1>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Manage member and their status
          </p>
        </div>
        <div className='flex-col text-right text-paragraph-md text-text-sub-600'>
          <div>
            Total Members:{' '}
            <Badge.Root square variant='filled' color='green'>
              {members.length}
            </Badge.Root>
          </div>
          <div>
            Active:{' '}
            <Badge.Root square variant='filled' color='green'>
              {activeMemberCount}
            </Badge.Root>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <RiUserStarLine className='text-text-sub-400 mb-4 size-12' />
          <h3 className='mb-2 text-title-h5 text-text-strong-950'>
            No members found
          </h3>
        </div>
      ) : (
        <>
          <MembersTable data={members} />
          <MemberTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
}
