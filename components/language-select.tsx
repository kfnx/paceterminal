'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/translation-context';
import IndonesiaFlag from '~/flags/ID.svg';
import UnitedStatesFlag from '~/flags/US.svg';

import { type Locale } from '@/lib/i18n';
import { cnExt } from '@/utils/cn';
import * as Select from '@/components/ui/select';

const languages = [
  {
    value: 'id' as Locale,
    label: 'ID',
    name: 'Bahasa Indonesia',
    icon: <IndonesiaFlag className='h-4 w-4' />,
  },
  {
    value: 'en' as Locale,
    label: 'EN',
    name: 'English',
    icon: <UnitedStatesFlag className='h-4 w-4' />,
  },
];

export function LanguageSelect({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  // Extract current locale from pathname
  const currentLocale = pathname.startsWith('/id') ? 'id' : 'en';

  const handleLanguageChange = (locale: string) => {
    // Remove current locale from pathname if it exists
    const cleanPathname = pathname.replace(/^\/(en|id)/, '') || '/';

    // Construct new path with selected locale
    const newPath =
      locale === 'en' ? cleanPathname : `/${locale}${cleanPathname}`;

    router.push(newPath);
  };

  return (
    <Select.Root
      variant='inline'
      value={currentLocale}
      onValueChange={handleLanguageChange}
    >
      <Select.Trigger className={cnExt(className)}>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {languages.map((lang) => (
          <Select.Item key={lang.value} value={lang.value}>
            <div className='flex items-center gap-2'>
              {lang.icon}
              <span className='font-medium'>{lang.label}</span>
            </div>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
