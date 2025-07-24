'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import IndonesiaFlag from '~/flags/ID.svg';
import UnitedStatesFlag from '~/flags/US.svg';
import { useLocale } from 'next-intl';

import { cnExt } from '@/utils/cn';
import * as Select from '@/components/ui/select';

const languages = [
  {
    value: 'id',
    label: 'INA',
    icon: <IndonesiaFlag className='h-4 w-4' />,
  },
  {
    value: 'en',
    label: 'ENG',
    icon: <UnitedStatesFlag className='h-4 w-4' />,
  },
];

export function LanguageSelect({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <Select.Root
      variant='inline'
      value={locale}
      onValueChange={handleLanguageChange}
    >
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
