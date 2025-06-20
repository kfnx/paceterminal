import dynamic from 'next/dynamic';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { cn } from '@/utils/cn';
import { config } from '@/lib/config';

import './globals.css';

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ThemeProvider } from 'next-themes';

import { SearchMenu } from '@/components/search';
import { WalletConnectionProviders } from '@/app/wallet-providers';

const InvisibleWalletMultiButtonDynamic = dynamic(
  () =>
    import('@/components/wallet').then((mod) => mod.InvisibleWalletMultiButton),
  { ssr: false },
);

const UmamiDynamic = dynamic(
  () => import('@/components/analytics').then((mod) => ({ default: mod.Umami })),
  { ssr: false },
);

const fontInter = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: config.app.name,
  description: config.app.description,
  // robots: {
  //   index: false,
  //   follow: false,
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(fontInter.className, 'antialiased')}
    >
      <body className='bg-bg-white-0'>
        <NuqsAdapter>
          <WalletConnectionProviders>
            <ThemeProvider attribute='class'>
              <TooltipProvider
                delayDuration={100}
                skipDelayDuration={300}
                disableHoverableContent
              >
                {children}
                <InvisibleWalletMultiButtonDynamic />
              </TooltipProvider>
              <SearchMenu />
            </ThemeProvider>
          </WalletConnectionProviders>
        </NuqsAdapter>

        {/* Umami Analytics */}
        {config.analytics.umami.enabled && (
          <UmamiDynamic
            config={{
              websiteId: config.analytics.umami.websiteId,
              url: config.analytics.umami.url,
              autoTrack: config.analytics.umami.autoTrack,
              doNotTrack: config.analytics.umami.doNotTrack,
            }}
            enabled={config.analytics.umami.enabled}
          />
        )}
      </body>
    </html>
  );
}
