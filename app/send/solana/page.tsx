import { ConnectionWidget } from '@/components/connection-widget';
import { SendSolForm } from '@/components/send-sol-form';

export default function SendSolPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-8'>
          <h1 className='text-3xl mb-4 font-bold text-text-strong-950'>
            Send SOL
          </h1>
          <p className='text-lg text-text-sub-600'>
            Transfer SOL to any Solana address quickly and securely.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <SendSolForm />
          </div>

          <div className='space-y-6'>
            <div className='rounded-lg border border-information-light bg-information-lighter p-6'>
              <h3 className='text-lg mb-3 font-semibold text-information-dark'>
                SOL Transfer Benefits
              </h3>
              <div className='text-sm space-y-3'>
                <div>
                  <p className='font-medium text-text-strong-950'>
                    Fast Transactions
                  </p>
                  <p className='text-xs text-text-sub-600'>
                    SOL transfers are processed in seconds with minimal fees
                  </p>
                </div>
                <div>
                  <p className='font-medium text-text-strong-950'>Low Fees</p>
                  <p className='text-xs text-text-sub-600'>
                    Typical transaction fee is only ~0.000005 SOL
                  </p>
                </div>
                <div>
                  <p className='font-medium text-text-strong-950'>
                    No Token Accounts
                  </p>
                  <p className='text-xs text-text-sub-600'>
                    SOL transfers don&apos;t require associated token accounts
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-lg border border-success-light bg-success-lighter p-6'>
              <h3 className='text-lg mb-3 font-semibold text-success-dark'>
                Network Information
              </h3>
              <div className='text-sm space-y-3'>
                <div>
                  <p className='font-medium text-text-strong-950'>
                    Solana Mainnet
                  </p>
                  <p className='text-xs text-text-sub-600'>
                    Production network with real SOL
                  </p>
                </div>
                <div>
                  <p className='font-medium text-text-strong-950'>
                    Solana Devnet
                  </p>
                  <p className='text-xs text-text-sub-600'>
                    Test network for development
                  </p>
                </div>
              </div>
            </div>
            <ConnectionWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
