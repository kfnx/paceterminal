import { ManageToken } from './content';

export default async function AdminSolanaTokenPage({
  params,
}: {
  params: { address: string };
}) {
  const { address } = params;

  return (
    <div className='container mx-auto px-4 py-6'>
      <ManageToken address={address} />
    </div>
  );
}
