'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function FounderProfilePage() {
  const { displayName } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1"></div>
      <div className="p-4 pb-10">
        <h1 className="text-heading text-white-900 mb-6">{displayName}</h1>
        <div className="bg-onsurface-900 rounded-lg p-6">
          <p className="text-body text-white-700">Founder profile settings coming soon...</p>
        </div>
      </div>
    </div>
  );
}
