'use client';

import { useState } from 'react';

import { cnExt } from '@/utils/cn';
import * as SegmentedControl from '@/components/ui/segmented-control';
import { useParams } from 'next/navigation';

export function NavigationTabs({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const params = useParams();
  const address = params.address as string;
  const [selectedTab, setSelectedTab] = useState('chart');

  if (!address) {
    return <div className='hidden lg:flex' />;
  }

  const handleValueChange = (value: string) => {
    setSelectedTab(value);
    document.getElementById(value)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <SegmentedControl.Root
      value={selectedTab}
      onValueChange={handleValueChange}
      // className='lg:w-80'
      className={cnExt(className)}
    >
      <SegmentedControl.List>
        <SegmentedControl.Trigger value='chart'>Chart</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='metrics'>
          Metrics
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='team'>Team</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='flywheel'>
          Flywheel
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='technical'>
          Technical
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='alpha'>Alpha</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='updates'>
          Updates
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
}
