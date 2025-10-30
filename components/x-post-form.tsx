'use client';

import * as React from 'react';
import { RiCloseLine, RiSaveLine } from '@remixicon/react';
import { toast } from 'sonner';

import type { XPost } from '@/hooks/use-x-posts';
import { useCreateOrUpdateXPost } from '@/hooks/use-x-posts';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';

interface XPostFormProps {
  xPost?: XPost;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function XPostForm({
  xPost,
  isOpen,
  onClose,
  onSuccess,
}: XPostFormProps) {
  const createOrUpdateMutation = useCreateOrUpdateXPost();

  const [tweetId, setTweetId] = React.useState(xPost?.tweet_id || '');
  const [username, setUsername] = React.useState(xPost?.username || '');
  const [url, setUrl] = React.useState(xPost?.url || '');
  const [isActive, setIsActive] = React.useState(xPost?.is_active || false);

  React.useEffect(() => {
    setTweetId(xPost?.tweet_id || '');
    setUsername(xPost?.username || '');
    setUrl(xPost?.url || '');
    setIsActive(xPost?.is_active || false);
  }, [xPost]);

  const handleClose = () => {
    onClose();
    // Reset form
    setTweetId('');
    setUsername('');
    setUrl('');
    setIsActive(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!tweetId.trim()) {
      toast.error('Tweet ID is required');
      return;
    }

    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }

    try {
      await createOrUpdateMutation.mutateAsync({
        ...(xPost && { id: xPost.id }),
        tweet_id: tweetId.trim(),
        username: username.trim(),
        url: url.trim() || undefined,
        is_active: isActive,
      });

      onSuccess();
      handleClose();
      toast.success(
        xPost ? 'X post updated successfully!' : 'X post created successfully!',
      );
    } catch (error) {
      console.error('Error saving X post:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save X post',
      );
    }
  };

  const isSubmitting = createOrUpdateMutation.isPending;

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <Modal.Header>
          <Modal.Title>{xPost ? 'Edit X Post' : 'Add X Post'}</Modal.Title>
          <Modal.Description>
            {xPost
              ? 'Update the X post configuration.'
              : 'Add a new X post to display on your site.'}
          </Modal.Description>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-6'>
            {/* Tweet ID */}
            <div className='flex flex-col gap-2'>
              <Label.Root>
                Tweet ID <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={tweetId}
                    onChange={(e) => setTweetId(e.target.value)}
                    placeholder='1975947991518474336'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
              <p className='text-text-sub-500 text-paragraph-xs'>
                The numeric ID of the tweet (e.g., from the tweet URL)
              </p>
            </div>

            {/* Username */}
            <div className='flex flex-col gap-2'>
              <Label.Root>
                Username <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='degenping'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
              <p className='text-text-sub-500 text-paragraph-xs'>
                The X/Twitter username (without @)
              </p>
            </div>

            {/* URL (Optional) */}
            <div className='flex flex-col gap-2'>
              <Label.Root>Full URL (Optional)</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder='https://x.com/degenping/status/1975947991518474336'
                    disabled={isSubmitting}
                  />
                </Input.Wrapper>
              </Input.Root>
              <p className='text-text-sub-500 text-paragraph-xs'>
                The complete URL to the X post
              </p>
            </div>

            {/* Active Status */}
            <div className='flex items-center gap-2'>
              <Checkbox.Root
                id='is_active'
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
                disabled={isSubmitting}
              ></Checkbox.Root>
              <Label.Root htmlFor='is_active' className='cursor-pointer'>
                Set as active post
              </Label.Root>
            </div>
            <p className='text-text-sub-500 text-paragraph-xs'>
              Only one post can be active at a time. Setting this as active will
              deactivate all other posts.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <RiCloseLine className='size-4' />
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              disabled={isSubmitting || !tweetId.trim() || !username.trim()}
              variant='primary'
            >
              <RiSaveLine className='size-4' />
              {isSubmitting
                ? 'Saving...'
                : xPost
                  ? 'Update Post'
                  : 'Create Post'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
