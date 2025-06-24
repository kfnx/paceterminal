import { SendSolForm } from '@/components/send-sol-form';
import { ConnectionWidget } from '@/components/connection-widget';

export default function SendSolPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-4 font-bold">
            Send SOL
          </h1>
          <p className="text-lg text-gray-600">
            Transfer SOL to any Solana address quickly and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SendSolForm />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h3 className="text-lg mb-3 font-semibold text-blue-900">
                SOL Transfer Benefits
              </h3>
              <div className="text-sm space-y-3">
                <div>
                  <p className="text-gray-700 font-medium">Fast Transactions</p>
                  <p className="text-gray-600 text-xs">
                    SOL transfers are processed in seconds with minimal fees
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Low Fees</p>
                  <p className="text-gray-600 text-xs">
                    Typical transaction fee is only ~0.000005 SOL
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">No Token Accounts</p>
                  <p className="text-gray-600 text-xs">
                    SOL transfers don&apos;t require associated token accounts
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-6">
              <h3 className="text-lg mb-3 font-semibold text-green-900">
                Network Information
              </h3>
              <div className="text-sm space-y-3">
                <div>
                  <p className="text-gray-700 font-medium">Solana Mainnet</p>
                  <p className="text-gray-600 text-xs">
                    Production network with real SOL
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Solana Devnet</p>
                  <p className="text-gray-600 text-xs">
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