'use client';

import { useState } from 'react';
import {
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiExternalLinkLine,
  RiTwitterXLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useDeleteXPost, useXPosts } from '@/hooks/use-x-posts';
import type { XPost } from '@/hooks/use-x-posts';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';
import * as Table from '@/components/ui/table';
import { XPostForm } from '@/components/x-post-form';

export default function ManageWidgetsPage() {
  const { xPosts, loading, error, refetch } = useXPosts();
  const deleteXPost = useDeleteXPost();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<XPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<XPost | null>(null);

  const handleAddNew = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: XPost) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (post: XPost) => {
    setDeletingPost(post);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPost) return;

    try {
      await deleteXPost.mutateAsync(deletingPost.id);
      toast.success('X post deleted successfully!');
      setIsDeleteModalOpen(false);
      setDeletingPost(null);
    } catch (error) {
      console.error('Error deleting X post:', error);
      toast.error('Failed to delete X post');
    }
  };

  const handleFormSuccess = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Loading Widgets...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center text-error-base'>
          <p className='text-lg mb-2 font-medium'>Failed to load X posts</p>
          <p className='text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-title-h2 text-text-strong-950'>
            X Posts Management
          </h1>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Manage X/Twitter posts displayed on the homepage
          </p>
        </div>
        <Button.Root onClick={handleAddNew}>
          <Button.Icon as={RiAddLine} />
          Add Post
        </Button.Root>
      </div>

      {/* Empty State or Table */}
      {xPosts.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <RiTwitterXLine className='text-text-sub-400 mb-4 size-12' />
          <h3 className='mb-2 text-title-h5 text-text-strong-950'>
            No X posts found
          </h3>
          <p className='mb-4 text-paragraph-sm text-text-sub-600'>
            Get started by adding your first X post to the homepage
          </p>
          <Button.Root onClick={handleAddNew}>
            <Button.Icon as={RiAddLine} />
            Add Post
          </Button.Root>
        </div>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Post Details</Table.Head>
              <Table.Head>Link</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Updated</Table.Head>
              <Table.Head className='w-[120px]'>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {xPosts.map((post) => (
              <Table.Row key={post.id}>
                <Table.Cell>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-50'>
                      <RiTwitterXLine className='size-4 text-blue-600' />
                    </div>
                    <div>
                      <div className='font-medium text-text-strong-950'>
                        @{post.username}
                      </div>
                      <div className='font-mono text-paragraph-sm text-text-sub-600'>
                        {post.tweet_id}
                      </div>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {post.url ? (
                    <div className='flex items-center gap-2'>
                      {post.url}
                      <a
                        href={post.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-paragraph-sm text-primary-base hover:underline'
                      >
                        <RiExternalLinkLine className='size-4 text-blue-600' />
                      </a>
                    </div>
                  ) : (
                    <span className='text-text-sub-400 text-paragraph-sm'>
                      -
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {post.is_active ? (
                    <Badge.Root variant='filled' color='blue'>
                      Active
                    </Badge.Root>
                  ) : (
                    <Badge.Root variant='stroke'>Inactive</Badge.Root>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className='text-paragraph-sm text-text-sub-600'>
                    {post.updated_at
                      ? new Date(post.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className='flex items-center gap-1'>
                    <Button.Root
                      size='small'
                      variant='neutral'
                      mode='stroke'
                      onClick={() => handleEdit(post)}
                    >
                      <Button.Icon as={RiEditLine} />
                    </Button.Root>
                    <Button.Root
                      size='small'
                      variant='error'
                      mode='stroke'
                      onClick={() => handleDeleteClick(post)}
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

      {/* Form Modal */}
      <XPostForm
        xPost={editingPost || undefined}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPost(null);
        }}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Modal.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Delete X Post</Modal.Title>
            <Modal.Description>
              Are you sure you want to delete the post from &quot;@
              {deletingPost?.username}&quot;? This action cannot be undone.
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Button.Root
              variant='neutral'
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingPost(null);
              }}
              disabled={deleteXPost.isPending}
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant='error'
              onClick={handleDeleteConfirm}
              disabled={deleteXPost.isPending}
            >
              <Button.Icon as={RiDeleteBinLine} />
              {deleteXPost.isPending ? 'Deleting...' : 'Delete'}
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
