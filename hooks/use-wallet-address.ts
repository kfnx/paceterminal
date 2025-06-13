import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function useWalletAddress() {
  const { connected, publicKey, connecting, disconnecting } = useWallet();
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(connecting || disconnecting);
  }, [connecting, disconnecting]);

  useEffect(() => {
    if (publicKey) {
      const pubKeyString = publicKey.toString();
      setFormattedAddress(
        `${pubKeyString.slice(0, 4)}...${pubKeyString.slice(-4)}`,
      );
    } else {
      setFormattedAddress('');
    }
  }, [publicKey]);

  return {
    connected,
    publicKey,
    formattedAddress,
    isLoading,
  };
}
