import { cn } from '@/utils/cn';

import './globals.css';

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { LocaleProvider } from '@/components/locale-provider';

const fontInter = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'PACETERMINAL',
  description: 'PACETERMINAL',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      className={cn(fontInter.className, 'antialiased')}
    >
      <body className='bg-bg-white-0'>
        <LocaleProvider />
        {children}
      </body>
    </html>
  );
}
