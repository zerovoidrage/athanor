'use client';

import { ReactNode } from 'react';
import { useDropdown } from '@/contexts/DropdownContext';

interface ContentWrapperProps {
  children: ReactNode;
}

export default function ContentWrapper({ children }: ContentWrapperProps) {
  const { isAnyDropdownOpen } = useDropdown();

  return (
    <div 
      className={`min-h-screen transition-transform duration-200 ease-out ${
        isAnyDropdownOpen ? 'scale-97' : 'scale-100'
      }`}
      style={{
        transformOrigin: 'center top',
        transform: isAnyDropdownOpen ? 'scale(0.98)' : 'scale(1)'
      }}
    >
      {children}
    </div>
  );
}
