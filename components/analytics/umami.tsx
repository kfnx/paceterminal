'use client';

import { useEffect, useRef } from 'react';
import { createUmamiScript, UMANI_SCRIPT_ID, type UmamiConfig } from '@/lib/umami';

interface UmamiProps {
  config: UmamiConfig;
  enabled?: boolean;
}

export function Umami({ config, enabled = true }: UmamiProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    // Check if script already exists
    const existingScript = document.getElementById(UMANI_SCRIPT_ID) as HTMLScriptElement;
    if (existingScript) {
      scriptRef.current = existingScript;
      return;
    }

    // Create and inject the script
    const script = createUmamiScript(config);
    document.head.appendChild(script);
    scriptRef.current = script;

    // Cleanup function
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [config, enabled]);

  // Don't render anything in the DOM
  return null;
}

export default Umami; 