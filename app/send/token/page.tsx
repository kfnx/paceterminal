import { ConnectionWidget } from '@/components/connection-widget';
import { SendTokensForm } from '@/components/send-tokens-form';

export default function SendTokensPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-4 font-bold">
            Send SPL Tokens
          </h1>
          <p className="text-lg text-gray-600">
            Transfer any SPL token to any Solana address.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SendTokensForm />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h3 className="text-lg mb-3 font-semibold text-blue-900">
                Popular Token Addresses
              </h3>
              <div className="text-sm space-y-3">
                <div>
                  <p className="text-gray-700 font-medium">USDC (Mainnet)</p>
                  <p className="text-gray-600 text-xs break-all font-mono">
                    EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">USDC (Devnet)</p>
                  <p className="text-gray-600 text-xs break-all font-mono">
                    4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
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