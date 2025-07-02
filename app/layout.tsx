import { cn } from '@/utils/cn';

import './globals.css';

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import { AnalyticsPageTracker } from '@/components/analytics-page-tracker';
import { GoogleAnalyticsWrapper } from '@/components/google-analytics';
import { PaymentModal } from '@/components/payment-modal';
import { Providers } from '@/app/providers';
import { WalletConnectionProviders } from '@/app/wallet-providers';

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
      lang='en'
      suppressHydrationWarning
      className={cn(fontInter.className, 'antialiased')}
    >
      <body className='bg-bg-white-0'>
        <Providers>
          <WalletConnectionProviders>
            <ThemeProvider
              attribute='class'
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider
                delayDuration={100}
                skipDelayDuration={300}
                disableHoverableContent
              >
                {children}
              </TooltipProvider>
              <PaymentModal />
              <Toaster richColors closeButton />
            </ThemeProvider>
          </WalletConnectionProviders>
        </Providers>
        <GoogleAnalyticsWrapper />
        <AnalyticsPageTracker />
      </body>
    </html>
  );
}
