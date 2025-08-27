'use client';

import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionModal } from '@/contexts/TransactionModalContext';

import TransactionModal from '@/components/modals/TransactionModal';
import { transactionItemStyles } from '@/styles/transactionItem';
import { ArrowUpRight, ArrowDownRight, Coins, Wallet, Dollar, Bank, PiggyBank, Plus, Minus, Undo, CoinsSwap, Compass, AppleWallet, Clock, ArrowRight } from 'iconoir-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function CleanInvestorVaultPage() {
  const router = useRouter();
  const { displayName } = useAuth();
  const { openModal, isOpen, transaction, closeModal } = useTransactionModal();

  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Конфиг вкладок - БЕЗ vault и museum
  const tabs = [
    { key: 'card', label: 'my card' },
    { key: 'tx', label: 'transactions' },
  ];

  // NEW: стабильные рефы для лока и актуального индекса
  const isAnimatingRef = useRef(false);
  const currentSectionRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  // NEW: рефы для высоты и ресайза
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportH, setViewportH] = useState(0);

  // синхронизируем реф при каждом ререндере
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  // На хард-рефреше гарантируем позицию скролла до запуска анимаций
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Выполняем входную анимацию после mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const calc = () => {
      if (!viewportRef.current) return;
      setViewportH(viewportRef.current.clientHeight);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Функция перехода к секции
  const goTo = (nextIndex: number) => {
    const sections = 2; // Изменено с 3 на 2 (убрали vault)
    const ANIM_LOCK_MS = 1000;
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));
    
    const idx = clamp(nextIndex, 0, sections - 1);
    if (idx === currentSectionRef.current) return;
    isAnimatingRef.current = true;
    setCurrentSection(idx);
    window.setTimeout(() => { isAnimatingRef.current = false; }, ANIM_LOCK_MS);
  };

  // === СЕКЦИОННЫЙ СКРОЛЛ (устойчивые слушатели) ===
  useEffect(() => {
    if (!mounted || !viewportRef.current) return;

    const container = viewportRef.current;
    const sections = 2; // Изменено с 3 на 2 (убрали vault)
    const ANIM_LOCK_MS = 1000; // было 900
    const SWIPE_THRESHOLD = 50; // px
    const WHEEL_THRESHOLD = 20; // отфильтровать мелкий тачпад-шум

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const goToInEffect = (nextIndex: number) => {
      const idx = clamp(nextIndex, 0, sections - 1);
      if (idx === currentSectionRef.current) return;
      isAnimatingRef.current = true;
      setCurrentSection(idx);
      window.setTimeout(() => { isAnimatingRef.current = false; }, ANIM_LOCK_MS);
    };

    // wheel
    const onWheel = (e: WheelEvent) => {
      // предотвращаем нативную прокрутку контейнера
      e.preventDefault();
      if (isAnimatingRef.current) return;

      const dy = e.deltaY;
      if (Math.abs(dy) < WHEEL_THRESHOLD) return;

      const dir = dy > 0 ? 1 : -1;
      goToInEffect(currentSectionRef.current + dir);
    };

    // touch
    const onTouchStart = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      if (touchStartYRef.current == null) return;

      const endY = e.changedTouches[0].clientY;
      const delta = touchStartYRef.current - endY; // >0 = свайп вверх (листать вниз)
      touchStartYRef.current = null;

      if (Math.abs(delta) < SWIPE_THRESHOLD) return;

      const dir = delta > 0 ? 1 : -1;
      goToInEffect(currentSectionRef.current + dir);
    };

    // вешаем на сам контейнер
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // отключим нативный «проскролл» страницы под контейнером
    const preventPageScroll = (e: WheelEvent) => {
      if (e.target && container.contains(e.target as Node)) e.preventDefault();
    };
    window.addEventListener('wheel', preventPageScroll, { passive: false });

    return () => {
      container.removeEventListener('wheel', onWheel as any);
      container.removeEventListener('touchstart', onTouchStart as any);
      container.removeEventListener('touchend', onTouchEnd as any);
      window.removeEventListener('wheel', preventPageScroll as any);
    };
  }, [mounted]); // <— без currentSection!

  const handleTransactionClick = (transactionData: any) => {
    openModal(transactionData);
  };

  // Функция для получения иконки по типу транзакции
  const getTransactionIcon = (type: string, title: string) => {
    switch (type) {
      case 'investment':
        return <Plus className="w-4 h-4 text-white" />;
      case 'return':
        return <Undo className="w-4 h-4 text-white" />;
      case 'dividends':
        return <CoinsSwap className="w-4 h-4 text-white" />;
      default:
        // Дополнительная логика по названию транзакции
        if (title.toLowerCase().includes('dividend')) return <CoinsSwap className="w-4 h-4 text-white" />;
        if (title.toLowerCase().includes('return')) return <Undo className="w-4 h-4 text-white" />;
        if (title.toLowerCase().includes('investment')) return <Plus className="w-4 h-4 text-white" />;
        return <Dollar className="w-4 h-4 text-white" />;
    }
  };

  return (
    <>
      <div className="relative w-full">
        <div className="relative z-10 mt-[60px]">
          <div className="w-full px-2 py-2 overflow-hidden">

            {/* Фиксированный слайдер-навигация */}
            <div className="fixed bottom-20 left-0 right-0 z-50">
              <div className="w-full px-4">
                <div className="flex items-center gap-4">
                  {tabs.map((t, i) => {
                    const isActive = currentSection === i;
                    return (
                      <button
                        key={t.key}
                        onClick={() => goTo(i)}
                        className={`flex-1 text-left px-8 py-4 text-caption transition-colors rounded-md h-8 flex items-center justify-center group ${
                          isActive 
                            ? 'bg-onsurface-800 text-white' 
                            : 'text-white-700 hover:bg-onsurface-800 hover:text-white-900'
                        }`}
                        aria-pressed={isActive}
                      >
                        <span className="inline-flex items-center gap-2">
                          {t.icon && (
                            <img
                              src={t.icon}
                              alt={t.label}
                              className="w-4 h-4 object-cover"
                            />
                          )}
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Контент dashboard */}
            {mounted && (
              /* Вьюпорт: фикс высота, perspective, ОТКЛЮЧЕН скролл (мы управляем index-ом) */
              <div
                ref={viewportRef}
                className="w-full overflow-hidden"
                style={{ height: 'calc(100vh - 60px)', perspective: 1200 }}
              >
                {/* Куб: вращаем его по X */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: currentSection * -90 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4,
                    ease: 'easeOut',
                    rotateX: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* FACE 0 - My Card (было FACE 1) */}
                  <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateX(0deg) translateZ(${viewportH / 2}px)`,
                    }}
                  >
                    {/* My Card Section */}
                    <div className="h-full flex items-start justify-center pt-8">
                      <div className="flex w-full max-w-7xl mx-auto px-4">
                        <div className="w-1/4 flex-shrink-0">
                          <h2 className="text-subheading text-white mb-4">My Card</h2>
                          <p className="text-caption text-white-700 max-w-[200px]">
                            Issue your AtanorCard® for<br />
                            exclusive access to curated<br />
                            investment opportunities
                          </p>
                        </div>
                        <div className="flex-1">
                          <div 
                            className="rounded-lg h-[70vh] overflow-hidden relative w-full flex items-center justify-center"
                            style={{ 
                              background: 'linear-gradient(113deg, #7820B3 0%, #CFB649 100.27%)'
                            }}
                          >
                            <div className="text-center text-white p-8">
                              <h3 className="text-heading mb-4">
                                Issue AthanorCard for Investment
                              </h3>
                              <p className="text-body mb-8 max-w-xs mx-auto" style={{ opacity: 0.6 }}>
                                Get exclusive access to curated investment opportunities with our premium investor card. 
                                Unlock advanced features and priority access to high-potential projects.
                              </p>
                              <div className="flex justify-center">
                                <PrimaryButton
                                  onClick={() => {
                                    router.push('/issue-card');
                                  }}
                                  className="justify-center bg-black text-white"
                                  variant="with-icon"
                                >
                                  Issue Card
                                  <ArrowRight className="w-4 h-4" />
                                </PrimaryButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FACE 1 - Transactions (было FACE 2) */}
                  <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateX(90deg) translateZ(${viewportH / 2}px)`,
                    }}
                  >
                    {/* Transactions Section */}
                    <div className="h-full flex items-center justify-center">
                      <div className="flex w-full max-w-7xl mx-auto px-4">
                        <div className="w-1/4 flex-shrink-0">
                          <h2 className="text-subheading text-white mb-4">Transactions</h2>
                          <p className="text-caption text-white-700 max-w-[200px]">
                            Complete history of<br />
                            your investment<br />
                            activities and returns
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="bg-onsurface-900 rounded-lg p-1 space-y-0">
                            {/* Транзакция 2 - Возврат */}
                            <div 
                              className={transactionItemStyles.container}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.paddingLeft = '20px';
                                e.currentTarget.style.paddingRight = '20px';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.paddingLeft = '16px';
                                e.currentTarget.style.paddingRight = '16px';
                              }}
                              onClick={() => handleTransactionClick({
                                id: 2,
                                type: 'return',
                                projectName: 'Clean Project',
                                amount: '+3 200,00 USDT',
                                status: 'Completed',
                                date: '1 day ago',
                                projectImage: '/img/threejs/abyss/icon7.jpg'
                              })}
                            >
                              {/* Иконка транзакции */}
                              <div className="w-12 h-12 bg-onsurface-900 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-onsurface-700">
                                {getTransactionIcon('return', 'Return from Clean Project')}
                              </div>

                              {/* Описание транзакции */}
                              <div className={transactionItemStyles.descriptionContainer}>
                                <div>
                                  <h3 className={transactionItemStyles.title}>
                                    Return from Clean Project
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
                              onMouseEnter={(e) => {
                                e.currentTarget.style.paddingLeft = '20px';
                                e.currentTarget.style.paddingRight = '20px';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.paddingLeft = '16px';
                                e.currentTarget.style.paddingRight = '16px';
                              }}
                              onClick={() => handleTransactionClick({
                                id: 3,
                                type: 'dividends',
                                projectName: 'Clean Project',
                                amount: '+420,00 USDT',
                                status: 'Completed',
                                date: '3 hours ago',
                                projectImage: '/img/threejs/abyss/icon2.jpg'
                              })}
                            >
                              {/* Иконка транзакции */}
                              <div className="w-12 h-12 bg-onsurface-900 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-onsurface-700">
                                {getTransactionIcon('dividends', 'Dividends from Clean Project')}
                              </div>

                              {/* Описание транзакции */}
                              <div className={transactionItemStyles.descriptionContainer}>
                                <div>
                                  <h3 className={transactionItemStyles.title}>
                                    Dividends from Clean Project
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
                              onMouseEnter={(e) => {
                                e.currentTarget.style.paddingLeft = '20px';
                                e.currentTarget.style.paddingRight = '20px';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.paddingLeft = '16px';
                                e.currentTarget.style.paddingRight = '16px';
                              }}
                              onClick={() => handleTransactionClick({
                                id: 1,
                                type: 'investment',
                                projectName: 'Clean Project',
                                amount: '-5 000,00 USDT',
                                status: 'Completed',
                                date: '2 days ago',
                                projectImage: '/img/threejs/abyss/icon2.jpg'
                              })}
                            >
                              {/* Иконка транзакции */}
                              <div className="w-12 h-12 bg-onsurface-900 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-onsurface-700">
                                {getTransactionIcon('investment', 'Investment in Clean Project')}
                              </div>

                              {/* Описание транзакции */}
                              <div className={transactionItemStyles.descriptionContainer}>
                                <div>
                                  <h3 className={transactionItemStyles.title}>
                                    Investment in Clean Project
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
                  </div>
                </motion.div>
              </div>
            )}
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
