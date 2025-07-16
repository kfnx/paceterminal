'use client';

import { RiUserStarLine } from '@remixicon/react';

import { useMembers } from '@/hooks/use-member';
import * as Badge from '@/components/ui/badge';
import * as Table from '@/components/ui/table';

export default function AdminMembersPage() {
  const { members, loading, refetch } = useMembers();

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

  const memberStatus = (expiredAt: string | null) => {
    if (!expiredAt) return 'Unknown';
    return new Date(expiredAt).getTime() > Date.now() ? 'Active' : 'Expired';
  };

  const activeMemberCount = members.filter(
    (member) => memberStatus(member.expired_at) === 'Active',
  ).length;

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
            <Badge.Root variant='filled' color='green'>
              {members.length}
            </Badge.Root>
          </div>
          <div>
            Active:{' '}
            <Badge.Root variant='filled' color='green'>
              {activeMemberCount}
            </Badge.Root>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='text-paragraph-sm text-text-sub-600'>
            Loading members...
          </div>
        </div>
      ) : members.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <RiUserStarLine className='text-text-sub-400 mb-4 size-12' />
          <h3 className='mb-2 text-title-h5 text-text-strong-950'>
            No members found
          </h3>
        </div>
      ) : (
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
      )}
    </div>
  );
}
