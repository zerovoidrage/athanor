'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Transaction {
  id: number;
  type: 'investment' | 'return' | 'dividends';
  projectName: string;
  amount: string;
  status: string;
  date: string;
  projectImage: string;
}

interface TransactionModalContextType {
  isOpen: boolean;
  transaction: Transaction | null;
  openModal: (transaction: Transaction) => void;
  closeModal: () => void;
}

const TransactionModalContext = createContext<TransactionModalContextType | undefined>(undefined);

export const useTransactionModal = () => {
  const context = useContext(TransactionModalContext);
  if (context === undefined) {
    throw new Error('useTransactionModal must be used within a TransactionModalProvider');
  }
  return context;
};

interface TransactionModalProviderProps {
  children: ReactNode;
}

export const TransactionModalProvider: React.FC<TransactionModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const openModal = (transactionData: Transaction) => {
    setTransaction(transactionData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTransaction(null);
  };

  return (
    <TransactionModalContext.Provider value={{
      isOpen,
      transaction,
      openModal,
      closeModal
    }}>
      {children}
    </TransactionModalContext.Provider>
  );
};
