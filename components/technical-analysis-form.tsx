'use client';

import * as React from 'react';
import { useTranslation } from '@/contexts/translation-context';
import { RiCloseLine, RiSaveLine } from '@remixicon/react';

import type { TechnicalAnalysis } from '@/hooks/use-technical-analysis';
import * as Button from '@/components/ui/button';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import { TechnicalAnalysisEditImageUploader } from '@/components/ui/technical-analysis-edit-image-uploader';
import { TechnicalAnalysisImageUploader } from '@/components/ui/technical-analysis-image-uploader';
import * as Textarea from '@/components/ui/textarea';

interface TechnicalAnalysisFormProps {
  technicalAnalysis?: TechnicalAnalysis;
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TechnicalAnalysisForm({
  technicalAnalysis,
  tokenAddress,
  isOpen,
  onClose,
  onSuccess,
}: TechnicalAnalysisFormProps) {
  const { locale } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');

  // Default fields (Indonesian)
  const [description, setDescription] = React.useState(
    technicalAnalysis?.description || '',
  );

  // English fields
  const [descriptionEn, setDescriptionEn] = React.useState(
    technicalAnalysis?.description_en || '',
  );

  // Reset form when technicalAnalysis changes
  React.useEffect(() => {
    setDescription(technicalAnalysis?.description || '');
    setDescriptionEn(technicalAnalysis?.description_en || '');
    setImageUrl('');
  }, [technicalAnalysis]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
    // For new entries, auto-submit since both image and description are handled by the uploader
    if (!technicalAnalysis) {
      onSuccess();
      onClose();
    } else {
      // For existing entries, trigger a refresh when image is updated
      onSuccess();
    }
  };

  const handleSuccess = () => {
    onSuccess();
    onClose();
    // Reset form
    setImageUrl('');
    setDescription('');
    setDescriptionEn('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      if (technicalAnalysis) {
        // Update existing technical analysis description
        const response = await fetch('/api/technical-analysis/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: technicalAnalysis.id,
            description: description.trim(),
            description_en: descriptionEn.trim() || null,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update technical analysis');
        }

        onSuccess();
        onClose();
        // Reset form
        setImageUrl('');
        setDescription('');
        setDescriptionEn('');
      }
      // For new entries, submission is handled by the image uploader
    } catch (error) {
      console.error('Error updating technical analysis:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <Modal.Header>
          <Modal.Title>
            {technicalAnalysis
              ? 'Edit Technical Analysis'
              : 'Add Technical Analysis'}
          </Modal.Title>
          <Modal.Description>
            {technicalAnalysis
              ? 'Update the technical analysis for this token.'
              : 'Upload a technical analysis chart and add description for this token.'}
          </Modal.Description>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-6'>
            {/* Description (Indonesian) */}
            <div className='flex flex-col gap-1'>
              <Label.Root>
                Description (Indonesian){' '}
                {!technicalAnalysis && <Label.Asterisk />}
              </Label.Root>
              <Textarea.Root
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter technical analysis description in Indonesian...'
                rows={4}
                disabled={isSubmitting}
              />
              {!technicalAnalysis && !description.trim() && (
                <p className='text-xs text-text-sub-600'>
                  Description is required for uploading technical analysis
                  charts.
                </p>
              )}
            </div>

            {/* Description (English) */}
            <div className='flex flex-col gap-1'>
              <Label.Root>Description (English)</Label.Root>
              <Textarea.Root
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder='Enter technical analysis description in English (optional)...'
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Technical Analysis Image Upload for new entries */}
            {!technicalAnalysis && (
              <div className='flex flex-col gap-1'>
                <Label.Root>
                  Technical Analysis Chart <Label.Asterisk />
                </Label.Root>
                <TechnicalAnalysisImageUploader
                  tokenAddress={tokenAddress}
                  description={description}
                  descriptionEn={descriptionEn}
                  onImageUploaded={handleImageUploaded}
                  disabled={isSubmitting || !description.trim()}
                />
              </div>
            )}

            {/* Technical Analysis Image Upload for editing existing entries */}
            {technicalAnalysis && (
              <div className='flex flex-col gap-1'>
                <Label.Root>Technical Analysis Chart</Label.Root>
                <TechnicalAnalysisEditImageUploader
                  technicalAnalysisId={technicalAnalysis.id.toString()}
                  currentImageUrl={technicalAnalysis.image}
                  onImageUploaded={handleImageUploaded}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={onClose}
              disabled={isSubmitting}
            >
              <Button.Icon as={RiCloseLine} />
              Cancel
            </Button.Root>
            {technicalAnalysis && (
              <Button.Root type='submit' disabled={isSubmitting}>
                <Button.Icon as={RiSaveLine} />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button.Root>
            )}
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
