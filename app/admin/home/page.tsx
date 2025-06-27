import WidgetAdminTokens from '@/components/widgets/widget-admin-tokens';

export default function PageHome() {
  return (
    <div className='flex flex-col gap-6 overflow-hidden px-4 pb-6 lg:p-8'>
      <h3 className='text-2xl font-bold'>Token Management</h3>
      <WidgetAdminTokens />
    </div>
  );
}
