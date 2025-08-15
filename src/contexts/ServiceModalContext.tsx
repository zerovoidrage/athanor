'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import ServiceModalWrapper, { ServiceModalStateProvider } from '@/components/modals/ServiceModalWrapper';

type Ctx = {
  openModal: (serviceId: number) => void;
  closeModal: () => void;
};

const ServiceModalContext = createContext<Ctx | null>(null);

export function ServiceModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceId, setServiceId] = useState<number | null>(null);

  const openModal = useCallback((id: number) => {
    setServiceId(id);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setServiceId(null);
  }, []);

  return (
    <ServiceModalContext.Provider value={{ openModal, closeModal }}>
      <ServiceModalStateProvider 
        isOpen={isOpen} 
        serviceId={serviceId} 
        closeModal={closeModal}
      >
        {children}
        {/* Модалка всегда рядом с body через Portal */}
        <ServiceModalWrapper />
      </ServiceModalStateProvider>
    </ServiceModalContext.Provider>
  );
}

export function useServiceModal() {
  const ctx = useContext(ServiceModalContext);
  if (!ctx) throw new Error('useServiceModal must be used within ServiceModalProvider');
  return ctx;
}
