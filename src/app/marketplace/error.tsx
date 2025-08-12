'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Marketplace error:', error);
  }, [error]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-white text-xl mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
