import HeaderMobile from '@/components/header-mobile';

import { AuthProvider } from '../auth-provider';
import Header from './header';
import Sidebar from './sidebar-admin';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className='flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto,minmax(0,1fr)]'>
        <Sidebar />
        <HeaderMobile />
        <div className='mx-auto flex w-full flex-1 flex-col self-stretch'>
          <Header />
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
