'use client';

import * as React from 'react';
import { RiSaveLine } from '@remixicon/react';
import { toast } from 'sonner';

import { useAds, useCreateOrUpdateAd, useDeleteAd } from '@/hooks/use-ads';
import { AdImageUploader } from '@/components/ui/ad-image-uploader';
import * as Button from '@/components/ui/button';

export default function ManageAdsPage() {
  const { ads, loading, error } = useAds();
  const createOrUpdateAd = useCreateOrUpdateAd();
  const deleteAd = useDeleteAd();

  // Find left and right ads
  const leftAd = ads.find((ad) => ad.position === 'left');
  const rightAd = ads.find((ad) => ad.position === 'right');

  const [pendingChanges, setPendingChanges] = React.useState<{
    left?: { image_url: string; target_url?: string };
    right?: { image_url: string; target_url?: string };
  }>({});

  const handleImageUpload = React.useCallback(
    (position: 'left' | 'right', imageUrl: string) => {
      setPendingChanges((prev) => ({
        ...prev,
        [position]: {
          ...prev[position],
          image_url: imageUrl,
        },
      }));
    },
    [],
  );

  const handleTargetUrlChange = React.useCallback(
    (position: 'left' | 'right', targetUrl: string) => {
      setPendingChanges((prev) => ({
        ...prev,
        [position]: {
          ...prev[position],
          image_url:
            prev[position]?.image_url ||
            (position === 'left' ? leftAd?.image_url : rightAd?.image_url) ||
            '',
          target_url: targetUrl,
        },
      }));
    },
    [leftAd?.image_url, rightAd?.image_url],
  );

  const handleImageRemove = React.useCallback(
    async (position: 'left' | 'right') => {
      try {
        await deleteAd.mutateAsync(position);
        setPendingChanges((prev) => {
          const updated = { ...prev };
          delete updated[position];
          return updated;
        });
        toast.success(`${position} ad removed successfully!`);
      } catch (error) {
        toast.error(`Failed to remove ${position} ad`);
      }
    },
    [deleteAd],
  );

  const handleSave = React.useCallback(async () => {
    const savePromises = Object.entries(pendingChanges).map(
      ([position, data]) =>
        createOrUpdateAd.mutateAsync({
          position,
          image_url: data.image_url,
          target_url: data.target_url,
        }),
    );

    try {
      await Promise.all(savePromises);
      setPendingChanges({});
      toast.success('Ads updated successfully!');
    } catch (error) {
      toast.error('Failed to save ads');
    }
  }, [pendingChanges, createOrUpdateAd]);

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;
  const isSaving = createOrUpdateAd.isPending || deleteAd.isPending;

  if (loading) {
    return (
      <div className='flex items-center justify-center p-24'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary-base'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center p-24'>
        <div className='text-center text-error-base'>
          <p className='text-lg mb-2 font-medium'>Failed to load ads</p>
          <p className='text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl space-y-8 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-text-strong-950'>
            Manage Ads
          </h1>
          <p className='mt-1 text-text-sub-600'>
            Manage homepage left and right sidebar advertisements
          </p>
        </div>

        {hasPendingChanges && (
          <Button.Root
            onClick={handleSave}
            disabled={isSaving}
            variant='primary'
          >
            <Button.Icon as={RiSaveLine} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button.Root>
        )}
      </div>

      {/* Ad Management Grid */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Left Side Ad */}
        <div className='rounded-lg border border-stroke-soft-200 bg-white p-6'>
          <AdImageUploader
            position='left'
            currentImageUrl={
              pendingChanges.left?.image_url || leftAd?.image_url || undefined
            }
            currentTargetUrl={
              pendingChanges.left?.target_url || leftAd?.target_url || undefined
            }
            onImageUploaded={(imageUrl) => handleImageUpload('left', imageUrl)}
            onTargetUrlChanged={(targetUrl) =>
              handleTargetUrlChange('left', targetUrl)
            }
            onImageRemoved={() => handleImageRemove('left')}
            disabled={isSaving}
          />
          {leftAd?.updated_at && (
            <div className='text-xs text-text-sub-400 mt-8 text-right'>
              Last updated: {new Date(leftAd.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Right Side Ad */}
        <div className='rounded-lg border border-stroke-soft-200 bg-white p-6'>
          <AdImageUploader
            position='right'
            currentImageUrl={
              pendingChanges.right?.image_url || rightAd?.image_url || undefined
            }
            currentTargetUrl={
              pendingChanges.right?.target_url ||
              rightAd?.target_url ||
              undefined
            }
            onImageUploaded={(imageUrl) => handleImageUpload('right', imageUrl)}
            onTargetUrlChanged={(targetUrl) =>
              handleTargetUrlChange('right', targetUrl)
            }
            onImageRemoved={() => handleImageRemove('right')}
            disabled={isSaving}
          />
          {rightAd?.updated_at && (
            <div className='text-xs text-text-sub-400 mt-8 text-right'>
              Last updated: {new Date(rightAd.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
