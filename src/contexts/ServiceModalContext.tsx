'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ServiceModalContextType {
  isOpen: boolean;
  serviceId: number | null;
  openModal: (serviceId: number) => void;
  closeModal: () => void;
}

const ServiceModalContext = createContext<ServiceModalContextType | undefined>(undefined);

export const useServiceModal = () => {
  const context = useContext(ServiceModalContext);
  if (context === undefined) {
    throw new Error('useServiceModal must be used within a ServiceModalProvider');
  }
  return context;
};

interface ServiceModalProviderProps {
  children: ReactNode;
}

export const ServiceModalProvider: React.FC<ServiceModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceId, setServiceId] = useState<number | null>(null);

  const openModal = (id: number) => {
    setServiceId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setServiceId(null);
  };

  return (
    <ServiceModalContext.Provider value={{
      isOpen,
      serviceId,
      openModal,
      closeModal
    }}>
      {children}
    </ServiceModalContext.Provider>
  );
};
