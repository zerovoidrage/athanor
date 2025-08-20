'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AbyssContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const AbyssContext = createContext<AbyssContextType | undefined>(undefined);

export function AbyssProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Обработка ошибок в контексте
  const handleError = (error: Error) => {
    console.error('AbyssContext error:', error);
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
    <AbyssContext.Provider value={{ 
      selectedCategory, 
      setSelectedCategory: safeSetSelectedCategory 
    }}>
      {children}
    </AbyssContext.Provider>
  );
}

export function useAbyss() {
  const context = useContext(AbyssContext);
  if (context === undefined) {
    throw new Error('useAbyss must be used within an AbyssProvider');
  }
  return context;
}
