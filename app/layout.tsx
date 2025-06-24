import { cn } from '@/utils/cn';

import './globals.css';

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ThemeProvider } from 'next-themes';
import { WalletConnectionProviders } from '@/app/wallet-providers';
import { GoogleAnalyticsWrapper } from '@/components/google-analytics';
import { AnalyticsPageTracker } from '@/components/analytics-page-tracker';
import { PaymentModal } from '@/components/payment-modal';
import { Toaster } from 'sonner';

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
        <WalletConnectionProviders>
          <ThemeProvider attribute='class'>
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
        <GoogleAnalyticsWrapper />
        <AnalyticsPageTracker />
      </body>
    </html>
  );
}
