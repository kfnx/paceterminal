'use client';

import { useState } from 'react';

import { cnExt } from '@/utils/cn';
import * as SegmentedControl from '@/components/ui/segmented-control';

export default function TokenTabs({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selectedTab, setSelectedTab] = useState('chart');

  return (
    <SegmentedControl.Root
      value={selectedTab}
      onValueChange={(v) => setSelectedTab(v)}
      // className='lg:w-80'
      className={cnExt(className)}
    >
      <SegmentedControl.List>
        <SegmentedControl.Trigger value='chart'>Chart</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='metric'>
          Metrics
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='team'>Team</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='flywheels'>
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
