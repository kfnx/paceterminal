import {
  RiAddLine,
  RiCoinLine,
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react';

import type { TechnicalAnalysis } from '@/hooks/use-technical-analysis';
import * as Button from '@/components/ui/button';

interface TechnicalAnalysisCardProps {
  technicalAnalysis: TechnicalAnalysis[];
  loading: boolean;
  error: string | null;
  onAdd: () => void;
  onEdit: (analysis: TechnicalAnalysis) => void;
  onDelete: (id: number) => void;
}

export function TechnicalAnalysisCard({
  technicalAnalysis,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
}: TechnicalAnalysisCardProps) {
  return (
    <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
          Technical Analysis
        </h3>
        <Button.Root
          variant='neutral'
          mode='stroke'
          onClick={onAdd}
          size='xsmall'
        >
          <RiAddLine className='size-4' />
        </Button.Root>
      </div>
      {loading ? (
        <div className='text-paragraph-sm text-text-sub-600'>
          Loading technical analysis...
        </div>
      ) : error ? (
        <div className='text-paragraph-sm text-red-600'>
          Error loading technical analysis: {error}
        </div>
      ) : technicalAnalysis.length > 0 ? (
        <div className='space-y-6'>
          {technicalAnalysis.map((analysis: TechnicalAnalysis) => (
            <div key={analysis.id} className='space-y-3'>
              <div className='flex items-start justify-between'>
                <div className='flex-1 space-y-3'>
                  <div className='w-full'>
                    <img
                      src={analysis.image}
                      alt='Technical Analysis Chart'
                      className='h-full w-full rounded-lg object-cover'
                    />
                  </div>
                  <div className='bg-bg-soft-100 rounded-lg p-4'>
                    <p className='whitespace-pre-wrap break-words text-paragraph-sm text-text-strong-950'>
                      {analysis.description}
                    </p>
                  </div>
                  <div className='text-paragraph-xs text-text-sub-600'>
                    Created:{' '}
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className='ml-3 flex flex-col gap-2'>
                  <Button.Root
                    variant='neutral'
                    mode='stroke'
                    onClick={() => onEdit(analysis)}
                    size='xsmall'
                  >
                    <RiEditLine className='size-4' />
                  </Button.Root>
                  <Button.Root
                    variant='error'
                    mode='stroke'
                    onClick={() => onDelete(analysis.id)}
                    size='xsmall'
                  >
                    <RiDeleteBinLine className='size-4' />
                  </Button.Root>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center gap-4 py-8'>
          <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiCoinLine className='size-8 text-text-sub-600' />
          </div>
          <div className='text-center'>
            <p className='text-paragraph-sm text-text-sub-600'>
              No technical analysis found for this token.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
