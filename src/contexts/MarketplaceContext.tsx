'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MarketplaceContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Обработка ошибок в контексте
  const handleError = (error: Error) => {
    console.error('MarketplaceContext error:', error);
  };

  // Безопасная установка категории
  const safeSetSelectedCategory = (category: string) => {
    try {
      setSelectedCategory(category);
    } catch (error) {
      console.error('Error setting category:', error);
      handleError(error as Error);
    }
  };

  return (
    <MarketplaceContext.Provider value={{ 
      selectedCategory, 
      setSelectedCategory: safeSetSelectedCategory 
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
