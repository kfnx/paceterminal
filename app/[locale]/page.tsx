import Header from '@/components/header';
import HeaderMobile from '@/components/header-mobile';
import Sidebar from '@/components/sidebar';

export default function PageHome() {
  return (
    <div className='flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto,minmax(0,1fr)]'>
      <Sidebar />
      <HeaderMobile />
      <div className='mx-auto flex w-full flex-1 flex-col self-stretch'>
        <Header />
        <div className='-mt-32 flex h-screen flex-col items-center justify-center space-y-4'>
          <img src='/images/semar.png' alt='logo' className='h-64 w-64' />
          <h1 className='text-2xl font-bold'>Monggo Dipilih</h1>
          <p className='text-sm text-gray-500'>
            Monggo Klik Token Yang Jenengan Ingin Pelajari
          </p>
        </div>
      </div>
    </div>
  );
}
