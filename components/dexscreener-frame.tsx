'use client';

import { useCallback, useEffect, useState } from 'react';

const defaultToken = '4nor6joBE27cv6GQ7nnrAcSL7yQ6H8sKhbM7ctJDmhrN';

export default function DexScreenerFrame() {
  const [token, setToken] = useState(defaultToken);

  const updateToken = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    setToken(tokenParam || defaultToken);
  }, []);

  useEffect(() => {
    // Initial load
    updateToken();

    // Create a MutationObserver to watch for URL changes
    const observer = new MutationObserver(() => {
      updateToken();
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
    };
  }, [updateToken]);

  return (
    <iframe
      key={token}
      className='min-h-[800px] w-full [grid-column:1/-1]'
      src={`https://dexscreener.com/solana/${token}?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&chartStyle=0&chartType=usd&interval=15`}
    ></iframe>
  );
}
