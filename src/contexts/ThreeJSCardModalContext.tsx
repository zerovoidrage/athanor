'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ThreeJSCardModalContextType {
  isThreeJSCardModalOpen: boolean;
  openThreeJSCardModal: () => void;
  closeThreeJSCardModal: () => void;
}

const ThreeJSCardModalContext = createContext<ThreeJSCardModalContextType | undefined>(undefined);

export const useThreeJSCardModal = () => {
  const context = useContext(ThreeJSCardModalContext);
  if (context === undefined) {
    throw new Error('useThreeJSCardModal must be used within a ThreeJSCardModalProvider');
  }
  return context;
};

interface ThreeJSCardModalProviderProps {
  children: React.ReactNode;
}

export const ThreeJSCardModalProvider: React.FC<ThreeJSCardModalProviderProps> = ({ children }) => {
  const [isThreeJSCardModalOpen, setIsThreeJSCardModalOpen] = useState(false);

  const openThreeJSCardModal = useCallback(() => {
    setIsThreeJSCardModalOpen(true);
  }, []);

  const closeThreeJSCardModal = useCallback(() => {
    setIsThreeJSCardModalOpen(false);
  }, []);

  return (
    <ThreeJSCardModalContext.Provider value={{ isThreeJSCardModalOpen, openThreeJSCardModal, closeThreeJSCardModal }}>
      {children}
    </ThreeJSCardModalContext.Provider>
  );
};
