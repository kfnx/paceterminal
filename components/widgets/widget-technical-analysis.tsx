'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/contexts/translation-context';
import { RiBarChartLine, RiFlashlightLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import { getTechnicalAnalysisImageUrl } from '@/utils/image-url';
import { useTechnicalAnalysis } from '@/hooks/use-technical-analysis';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetTechnicalAnalysis({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const { technicalAnalysis, loading } = useTechnicalAnalysis(address);
  const { locale } = useTranslation();

  // Helper function to get the appropriate description based on locale
  const getLocalizedDescription = (analysis: any) => {
    // For English locale, try to use description_en if it exists
    if (locale === 'en' && analysis.description_en) {
      return analysis.description_en;
    }

    // For other locales or if description_en doesn't exist, use the default description
    return analysis.description;
  };

  return (
    <WidgetBox.Root {...rest} id='technical-analysis'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiBarChartLine} />
        Technical Analysis
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        <div className='flex w-full flex-col items-center justify-center gap-2 p-2'>
          <img
            src='/images/tradingtown.jpg'
            alt='Trading Town'
            className='h-32 w-32 object-cover'
          />
          <span className='pb-4 text-text-sub-600'>
            Powered By Trading Town
          </span>

          {!loading && technicalAnalysis && technicalAnalysis.length > 0 ? (
            <div className='w-full space-y-4'>
              {technicalAnalysis.map((analysis) => (
                <div key={analysis.id} className='w-full space-y-3'>
                  <div className='w-full'>
                    <img
                      src={getTechnicalAnalysisImageUrl(analysis.image)}
                      alt='Technical Analysis Chart'
                      className='h-full w-full rounded-lg object-cover'
                    />
                  </div>
                  <div className='bg-bg-soft-100 rounded-lg p-3'>
                    <p className='whitespace-pre-wrap break-words text-paragraph-sm text-text-strong-950'>
                      {getLocalizedDescription(analysis)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
              <IllustrationEmptySavedActions className='size-[108px]' />
              <div className='text-center text-paragraph-sm text-text-soft-400'>
                {loading
                  ? 'Loading technical analysis...'
                  : 'Technical analysis empty.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetTechnicalAnalysisEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
      id='team'
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFlashlightLine} />
        Technical Analysis
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptySavedActions className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            Technical Analysis empty.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
