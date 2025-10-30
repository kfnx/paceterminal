import Header from '@/components/header';
import HeaderMobile from '@/components/header-mobile';
import { MobileAd } from '@/components/mobile-ad';
import { PaceTokenBanner } from '@/components/pace-token-banner';
import { RightSideAd } from '@/components/right-side-ad';
import Sidebar from '@/components/sidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto,minmax(0,1fr)]'>
      <Sidebar />
      <HeaderMobile />
      <div className='mx-auto flex w-full flex-1 flex-col self-stretch'>
        <PaceTokenBanner />
        <Header />
        <div className='flex flex-1'>
          <div className='min-w-0 flex-1'>{children}</div>
          <RightSideAd />
        </div>
      </div>
      <MobileAd />
    </div>
  );
}
