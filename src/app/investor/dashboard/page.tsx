'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionModal } from '@/contexts/TransactionModalContext';
import TransactionModal from '@/components/modals/TransactionModal';
import { transactionItemStyles } from '@/styles/transactionItem';

export default function InvestorDashboardPage() {
  const { displayName } = useAuth();
  const { openModal, isOpen, transaction, closeModal } = useTransactionModal();

  const handleTransactionClick = (transactionData: any) => {
    openModal(transactionData);
  };

  return (
    <>
      <div className="relative w-full">
        <div className="relative z-10" style={{ marginTop: '60px' }}>
          <div className="w-full px-4 py-4">

            {/* Контент dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-12"
            >
              {/* Vault Section */}
              <div className="flex">
                <div className="w-1/4 flex-shrink-0">
                  <h2 className="text-heading text-white mb-4">Vault</h2>
                  <p className="text-caption text-white-700 max-w-[200px]">
                    Your investment portfolio<br />
                    overview and total<br />
                    capital allocation
                  </p>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-[50vh] gap-4">
                    <div className="bg-white-900 rounded-lg p-4 h-full flex flex-col justify-between">
                      <div className="text-largetitle text-black">
                        <div>Hey</div>
                        <div>{displayName},</div>
                        <div>you've got</div>
                        <div>$11,000 in play</div>
                      </div>
                      <div className="text-caption text-black font-largetitle" style={{ opacity: 0.5 }}>
                        Total capital currently invested across all active projects
                      </div>
                    </div>

                                      <div className="bg-onsurface-900 rounded-lg p-4 h-full flex flex-col justify-between relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ 
                        backgroundImage: 'url(/img/threejs/abyss/icon2.jpg)',
                        filter: 'blur(8px)'
                      }}
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                      <img
                        src="/img/threejs/abyss/icon2.jpg"
                        alt="Project"
                        className="w-12 h-12 object-cover rounded mb-3"
                        style={{ objectPosition: 'center' }}
                      />
                      <div className="text-subheading text-white mb-2">Museum</div>
                      <div className="text-caption text-white-900">5 000,43 USDT invested</div>
                    </div>
                  </div>

                  <div className="bg-onsurface-900 rounded-lg p-4 h-full flex flex-col justify-between">
                    <div className="text-heading text-white">threejs_card</div>
                  </div>
                  </div>
                </div>
              </div>



              {/* Transactions Section */}
              <div className="flex">
                <div className="w-1/4 flex-shrink-0">
                  <h2 className="text-heading text-white mb-4">Transactions</h2>
                  <p className="text-caption text-white-700 max-w-[200px]">
                    Complete history of<br />
                    your investment<br />
                    activities and returns
                  </p>
                </div>
                <div className="flex-1">
                  <div className="bg-onsurface-900 rounded-lg p-4">
                    <div className="space-y-0">
                      {/* Транзакция 2 - Возврат */}
                      <div 
                        className={transactionItemStyles.container}
                        style={{ paddingLeft: 0, paddingRight: 0 }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.paddingLeft = '16px';
                          e.currentTarget.style.paddingRight = '16px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.paddingLeft = '0px';
                          e.currentTarget.style.paddingRight = '0px';
                        }}
                        onClick={() => handleTransactionClick({
                          id: 2,
                          type: 'return',
                          projectName: 'Museum',
                          amount: '+3 200,00 USDT',
                          status: 'Completed',
                          date: '1 day ago',
                          projectImage: '/img/threejs/abyss/icon2.jpg'
                        })}
                      >
                        {/* Изображение проекта */}
                        <div className={transactionItemStyles.imageContainer}>
                          <img
                            src="/img/threejs/abyss/icon2.jpg"
                            alt="Project"
                            className={transactionItemStyles.image}
                            style={{ objectPosition: 'center' }}
                          />
                        </div>

                        {/* Описание транзакции */}
                        <div className={transactionItemStyles.descriptionContainer}>
                          <div>
                            <h3 className={transactionItemStyles.title}>
                              Return from Museum
                            </h3>
                            <div className={transactionItemStyles.date}>1 day ago</div>
                          </div>
                        </div>

                        {/* Сумма и статус */}
                        <div className={transactionItemStyles.amountContainer}>
                          <div className={transactionItemStyles.amount.return}>+3 200,00 USDT</div>
                          <div className={transactionItemStyles.status}>Completed</div>
                        </div>
                      </div>

                      {/* Транзакция 3 - Дивиденды */}
                      <div 
                        className={transactionItemStyles.container}
                        style={{ paddingLeft: 0, paddingRight: 0 }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.paddingLeft = '16px';
                          e.currentTarget.style.paddingRight = '16px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.paddingLeft = '0px';
                          e.currentTarget.style.paddingRight = '0px';
                        }}
                        onClick={() => handleTransactionClick({
                          id: 3,
                          type: 'dividends',
                          projectName: 'Museum',
                          amount: '+420,00 USDT',
                          status: 'Completed',
                          date: '3 hours ago',
                          projectImage: '/img/threejs/abyss/icon2.jpg'
                        })}
                      >
                        {/* Изображение проекта */}
                        <div className={transactionItemStyles.imageContainer}>
                          <img
                            src="/img/threejs/abyss/icon2.jpg"
                            alt="Project"
                            className={transactionItemStyles.image}
                            style={{ objectPosition: 'center' }}
                          />
                        </div>

                        {/* Описание транзакции */}
                        <div className={transactionItemStyles.descriptionContainer}>
                          <div>
                            <h3 className={transactionItemStyles.title}>
                              Dividends from Museum
                            </h3>
                            <div className={transactionItemStyles.date}>3 hours ago</div>
                          </div>
                        </div>

                        {/* Сумма и статус */}
                        <div className={transactionItemStyles.amountContainer}>
                          <div className={transactionItemStyles.amount.dividends}>+420,00 USDT</div>
                          <div className={transactionItemStyles.status}>Completed</div>
                        </div>
                      </div>

                      {/* Транзакция 3 - Инвестиция */}
                      <div 
                        className={transactionItemStyles.container}
                        style={{ paddingLeft: 0, paddingRight: 0 }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.paddingLeft = '16px';
                          e.currentTarget.style.paddingRight = '16px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.paddingLeft = '0px';
                          e.currentTarget.style.paddingRight = '0px';
                        }}
                        onClick={() => handleTransactionClick({
                          id: 1,
                          type: 'investment',
                          projectName: 'Museum',
                          amount: '-5 000,00 USDT',
                          status: 'Completed',
                          date: '2 days ago',
                          projectImage: '/img/threejs/abyss/icon2.jpg'
                        })}
                      >
                        {/* Изображение проекта */}
                        <div className={transactionItemStyles.imageContainer}>
                          <img
                            src="/img/threejs/abyss/icon2.jpg"
                            alt="Project"
                            className={transactionItemStyles.image}
                            style={{ objectPosition: 'center' }}
                          />
                        </div>

                        {/* Описание транзакции */}
                        <div className={transactionItemStyles.descriptionContainer}>
                          <div>
                            <h3 className={transactionItemStyles.title}>
                              Investment in Museum
                            </h3>
                            <div className={transactionItemStyles.date}>2 days ago</div>
                          </div>
                        </div>

                        {/* Сумма и статус */}
                        <div className={transactionItemStyles.amountContainer}>
                          <div className={transactionItemStyles.amount.investment}>-5 000,00 USDT</div>
                          <div className={transactionItemStyles.status}>Completed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <TransactionModal
          isOpen={isOpen}
          onClose={closeModal}
          transaction={transaction}
        />
      </div>
    </>
  );
}
