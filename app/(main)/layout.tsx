import Header from '@/components/header';
import HeaderMobile from '@/components/header-mobile';
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
        <Header />
        <div className='mx-auto flex w-full flex-1 flex-col self-stretch'></div>
        <div className='flex'>
          {children}
          <RightSideAd />
        </div>
      </div>
    </div>
  );
}
