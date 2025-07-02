'use client';

import * as React from 'react';
import IndonesiaFlag from '~/flags/ID.svg';
import UnitedStatesFlag from '~/flags/US.svg';

import { cnExt } from '@/utils/cn';
import * as Select from '@/components/ui/select';

const languages = [
  {
    value: 'id',
    label: 'ID',
    icon: <IndonesiaFlag className='h-4 w-4' />,
  },
  {
    value: 'en',
    label: 'EN',
    icon: <UnitedStatesFlag className='h-4 w-4' />,
  },
];

export function LanguageSelect({ className }: { className?: string }) {
  return (
    <Select.Root variant='inline' defaultValue='id'>
      <Select.Trigger className={cnExt(className)}>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {languages.map((lang) => (
          <Select.Item key={lang.value} value={lang.value}>
            {lang.icon} {lang.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
