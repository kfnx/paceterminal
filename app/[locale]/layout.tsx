import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import { AnalyticsPageTracker } from '@/components/analytics-page-tracker';
import { GoogleAnalyticsWrapper } from '@/components/google-analytics';
import { PaymentModal } from '@/components/payment-modal';

import { Providers } from './providers';
import { WalletConnectionProviders } from './wallet-providers';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  console.log('locale', locale, locales, !locales.includes(locale as any));
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    return notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
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
            <Toaster richColors closeButton position='top-center' />
          </ThemeProvider>
        </WalletConnectionProviders>
      </Providers>
      <GoogleAnalyticsWrapper />
      <AnalyticsPageTracker />
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
