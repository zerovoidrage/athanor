'use client';

import { Suspense } from 'react';
import Spinner from '@/components/ui/Spinner';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="relative w-full h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      {children}
    </Suspense>
  );
}
