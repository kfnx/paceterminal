'use client';

import * as React from 'react';
import { RiGlobalLine } from '@remixicon/react';

import * as Select from '@/components/ui/select';
import { cnExt } from '@/utils/cn';

const languages = [
  {
    value: 'id',
    label: 'ID',
  },
  {
    value: 'en',
    label: 'EN',
  },
];

export function LanguageSelect({ className }: { className?: string }) {
  return (
    <Select.Root variant='compact' defaultValue='id'>
      <Select.Trigger className={cnExt(className)}>
        <Select.TriggerIcon as={RiGlobalLine} />
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {languages.map((lang) => (
          <Select.Item key={lang.value} value={lang.value}>
            {lang.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
