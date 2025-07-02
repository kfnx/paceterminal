'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiDeleteBinLine,
  RiMailLine,
  RiRefreshLine,
  RiUserLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useDeleteUser } from '@/hooks/use-delete-user';
import { useInviteUser } from '@/hooks/use-invite-user';
import { useResendInvitation } from '@/hooks/use-resend-invitation';
import { useUsers } from '@/hooks/use-users';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Table from '@/components/ui/table';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed_at: string | null;
}

export default function AdminUsersPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

  const { users, loading, refetch } = useUsers();
  const { inviteUser, loading: inviting } = useInviteUser();
  const { resendInvitation, loading: resending } = useResendInvitation();
  const { deleteUser, loading: deleting } = useDeleteUser();

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const result = await inviteUser({ email: inviteEmail });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Invitation sent successfully');
      setIsInviteModalOpen(false);
      setInviteEmail('');
    }
  };

  const handleResendInvitation = async (email: string) => {
    const result = await resendInvitation({ email });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Invitation resent successfully');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    const result = await deleteUser({ userId: userToDelete.id });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

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
    <div className='flex flex-1 flex-col p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-title-h2 text-text-strong-950'>
            User Management
          </h1>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Manage users and their permissions
          </p>
        </div>
        <Button.Root onClick={() => setIsInviteModalOpen(true)}>
          <Button.Icon as={RiAddLine} />
          Invite User
        </Button.Root>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='text-paragraph-sm text-text-sub-600'>
            Loading users...
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <RiUserLine className='text-text-sub-400 mb-4 size-12' />
          <h3 className='mb-2 text-title-h5 text-text-strong-950'>
            No users found
          </h3>
          <p className='mb-4 text-paragraph-sm text-text-sub-600'>
            Get started by inviting your first user
          </p>
          <Button.Root onClick={() => setIsInviteModalOpen(true)}>
            <Button.Icon as={RiAddLine} />
            Invite User
          </Button.Root>
        </div>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>User</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Created</Table.Head>
              <Table.Head>Last Sign In</Table.Head>
              <Table.Head>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user: User) => (
              <Table.Row key={user.id}>
                <Table.Cell>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary-50 flex h-8 w-8 items-center justify-center rounded-full'>
                      <RiUserLine className='size-4 text-primary-base' />
                    </div>
                    <div>
                      <div className='font-medium text-text-strong-950'>
                        {user.email}
                      </div>
                      <div className='text-paragraph-xs text-text-sub-600'>
                        ID: {user.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {user.confirmed_at ? (
                    <Badge.Root variant='filled' color='green'>
                      Confirmed
                    </Badge.Root>
                  ) : (
                    <Badge.Root variant='filled' color='orange'>
                      Pending
                    </Badge.Root>
                  )}
                </Table.Cell>
                <Table.Cell className='text-paragraph-sm text-text-sub-600'>
                  {formatDate(user.created_at)}
                </Table.Cell>
                <Table.Cell className='text-paragraph-sm text-text-sub-600'>
                  {formatDate(user.last_sign_in_at)}
                </Table.Cell>
                <Table.Cell>
                  <div className='flex items-center gap-2'>
                    {!user.confirmed_at && (
                      <Button.Root
                        variant='neutral'
                        mode='stroke'
                        size='small'
                        onClick={() => handleResendInvitation(user.email)}
                        disabled={resending}
                      >
                        <Button.Icon
                          as={resending ? undefined : RiRefreshLine}
                        />
                        {resending ? 'Sending...' : 'Resend'}
                      </Button.Root>
                    )}
                    <Button.Root
                      variant='error'
                      mode='stroke'
                      size='small'
                      onClick={() => openDeleteModal(user)}
                      disabled={deleting}
                    >
                      <Button.Icon
                        as={deleting ? undefined : RiDeleteBinLine}
                      />
                      {deleting ? 'Deleting...' : 'Delete'}
                    </Button.Root>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {/* Invite User Modal */}
      <Modal.Root open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <Modal.Content className='sm:max-w-md'>
          <Modal.Header>
            <Modal.Title>Invite New User</Modal.Title>
            <Modal.Description>
              Send an invitation email to a new user. They will receive a link
              to set up their account.
            </Modal.Description>
          </Modal.Header>

          <Modal.Body className='space-y-4'>
            <div className='space-y-2'>
              <Label.Root htmlFor='email'>Email Address</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='email'
                    type='email'
                    placeholder='user@example.com'
                    value={inviteEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInviteEmail(e.target.value)
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        handleInviteUser();
                      }
                    }}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button.Root
              variant='neutral'
              mode='stroke'
              onClick={() => setIsInviteModalOpen(false)}
              disabled={inviting}
            >
              Cancel
            </Button.Root>
            <Button.Root onClick={handleInviteUser} disabled={inviting}>
              <Button.Icon as={inviting ? undefined : RiMailLine} />
              {inviting ? 'Sending...' : 'Send Invitation'}
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      {/* Delete User Modal */}
      <Modal.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal.Content className='sm:max-w-md'>
          <Modal.Header>
            <Modal.Title>Delete User</Modal.Title>
            <Modal.Description>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </Modal.Description>
          </Modal.Header>

          <Modal.Body>
            {userToDelete && (
              <div className='rounded-lg bg-bg-weak-50 p-4'>
                <div className='font-medium text-text-strong-950'>
                  {userToDelete.email}
                </div>
                <div className='text-paragraph-sm text-text-sub-600'>
                  ID: {userToDelete.id}
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button.Root
              variant='neutral'
              mode='stroke'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant='error'
              mode='filled'
              onClick={handleDeleteUser}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete User'}
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
