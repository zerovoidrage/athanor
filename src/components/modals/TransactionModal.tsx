'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Xmark, ArrowUpRight, ArrowDownRight, Coins, Minus, Dollar, PiggyBank, Plus, Undo, CoinsSwap } from 'iconoir-react';
import { createPortal } from 'react-dom';
import { usePageScrollLock } from '@/hooks/usePageScrollLock';

interface Transaction {
  id: number;
  type: 'investment' | 'return' | 'dividends';
  projectName: string;
  amount: string;
  status: string;
  date: string;
  projectImage: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, transaction }) => {
  usePageScrollLock(!!isOpen);

  // Закрытие по клику на backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  // Функция для получения иконки по типу транзакции
  const getTransactionIcon = (type: string, title: string) => {
    switch (type) {
      case 'investment':
        return <Plus className="w-5 h-5 text-white" />;
      case 'return':
        return <Undo className="w-5 h-5 text-white" />;
      case 'dividends':
        return <CoinsSwap className="w-5 h-5 text-white" />;
      default:
        // Дополнительная логика по названию транзакции
        if (title.toLowerCase().includes('dividend')) return <CoinsSwap className="w-5 h-5 text-white" />;
        if (title.toLowerCase().includes('return')) return <Undo className="w-5 h-5 text-white" />;
        if (title.toLowerCase().includes('investment')) return <Plus className="w-5 h-5 text-white" />;
        return <Dollar className="w-5 h-5 text-white" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'investment':
        return 'text-green-400';
      case 'return':
        return 'text-white-900';
      case 'dividends':
        return 'text-yellow-400';
      default:
        return 'text-white-900';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'investment':
        return 'Investment';
      case 'return':
        return 'Return';
      case 'dividends':
        return 'Dividends';
      default:
        return 'Transaction';
    }
  };

  return createPortal(
    <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md"
          onClick={handleBackdropClick}
          style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
          data-modal="true"
        />

        <motion.div
          key="panel"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 200,
            duration: 0.5
          }}
          className="fixed right-0 top-0 w-1/3 h-full p-2"
          style={{ zIndex: 100000 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="transaction-modal-title"
          data-modal="true"
        >
          <div className="w-full h-full bg-[#1A1A1A] rounded-lg overflow-y-auto">
            <div className="p-6" style={{ paddingTop: '24px' }}>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white-700 hover:text-white transition-colors duration-200"
                aria-label="Close modal"
              >
                <Xmark width={20} height={20} />
              </button>
              
              {/* Project Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-onsurface-900 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-onsurface-700">
                  {getTransactionIcon(transaction.type, transaction.projectName)}
                </div>
                <div className="space-y-2">
                  <h3 className="text-subheading2 text-white-900">{transaction.projectName}</h3>
                  <p className="text-caption text-white-700">{getTypeLabel(transaction.type)}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4 my-8">
                <div className="flex justify-between items-center">
                  <span className="text-caption text-white-700">Amount</span>
                  <span className={`text-caption ${getTypeColor(transaction.type)}`}>
                    {transaction.amount}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-caption text-white-700">Status</span>
                  <span className="text-caption text-white-700">{transaction.status}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-caption text-white-700">Date</span>
                  <span className="text-caption text-white-700">{transaction.date}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-caption text-white-700">Transaction ID</span>
                  <span className="text-caption text-white-700">#{transaction.id}</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-onsurface-900 rounded-lg p-4">
                <h4 className="text-caption text-white-700 mb-2">Transaction Hash</h4>
                <p className="text-caption text-white-700 font-mono">
                  0x1234...5678
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>,
    document.body
  );
};

export default TransactionModal;
