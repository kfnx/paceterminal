'use client';

// import { Suspense } from 'react';
import { useParams } from 'next/navigation';

import { useDescription } from '@/hooks/use-description';
// import { RiFileChartLine, RiInformationLine } from '@remixicon/react';
// import { useTheme } from 'next-themes';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetDescription({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const { description, loading } = useDescription(address);

  return (
    // <WidgetBox.Root {...rest} id='chart'>
    //   <WidgetBox.Header>
    //     <WidgetBox.HeaderIcon as={RiInformationLine} />
    //     Description
    //   </WidgetBox.Header>
    <div className='text-paragraph-sm text-text-sub-600'>
      {loading ? (
        <div className='flex items-center justify-center py-4'>
          <LoadingSpinner className='h-8 w-8' />
        </div>
      ) : description ? (
        description
      ) : (
        'No description available for this token.'
      )}
    </div>
    // </WidgetBox.Root>
  );
}
