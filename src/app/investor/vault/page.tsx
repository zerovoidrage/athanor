'use client';

import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionModal } from '@/contexts/TransactionModalContext';
import { useThreeJSCardModal } from '@/contexts/ThreeJSCardModalContext';
import TransactionModal from '@/components/modals/TransactionModal';
import { transactionItemStyles } from '@/styles/transactionItem';
import { ArrowUpRight, ArrowDownRight, Coins, Wallet, Dollar, Bank, PiggyBank, Plus, Minus, Undo, CoinsSwap, Compass, AppleWallet, Clock } from 'iconoir-react';
import ThreeJSCard from '@/components/ThreeJSCard';

export default function InvestorDashboardPage() {
  const { displayName } = useAuth();
  const { openModal, isOpen, transaction, closeModal } = useTransactionModal();
  const { openThreeJSCardModal } = useThreeJSCardModal();
  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Конфиг вкладок
  const tabs = [
    { key: 'vault', label: 'vault' },
    { key: 'card', label: 'my card' },
    { key: 'museum', label: 'museum', icon: '/img/threejs/abyss/icon11.jpg' },
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
    const sections = 4;
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
    const sections = 4;
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
                  {/* FACE 0 */}
                  <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateX(0deg) translateZ(${viewportH / 2}px)`,
                    }}
                  >
                    {/* Vault Section */}
                    <div className="h-full flex items-start justify-center pt-8">
                      <div className="flex w-full max-w-7xl mx-auto px-4">
                        <div className="w-1/4 flex-shrink-0">
                          <h2 className="text-subheading text-white mb-4">Vault</h2>
                          <p className="text-caption text-white-700 max-w-[200px]">
                            Your investment portfolio<br />
                            overview and total<br />
                            capital allocation
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white-900 rounded-lg p-4 h-[70vh] flex flex-col justify-between w-full">
                            <div className="text-largetitle text-black">
                              <div>Hey</div>
                              <div>{displayName},</div>
                              <div>you've got</div>
                              <div>5 000,43 USDT in play</div>
                            </div>
                            <div className="text-caption text-black font-largetitle" style={{ opacity: 0.5 }}>
                              Capital invested across active projects.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FACE 1 */}
                  <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateX(90deg) translateZ(${viewportH / 2}px)`,
                    }}
                  >
                    {/* My Card Section */}
                    <div className="h-full flex items-start justify-center pt-8">
                      <div className="flex w-full max-w-7xl mx-auto px-4">
                        <div className="w-1/4 flex-shrink-0">
                          <h2 className="text-subheading text-white mb-4">My Card</h2>
                          <p className="text-caption text-white-700 max-w-[200px]">
                            Your personal investment<br />
                            card with 3D visualization<br />
                            and portfolio details
                          </p>
                        </div>
                        <div className="flex-1">
                          <div 
                            className="rounded-lg h-[70vh] overflow-hidden relative group cursor-pointer w-full"
                            style={{ 
                              background: 'linear-gradient(134deg, #D6B2FF 0.45%, #FFFBD9 98.38%)'
                            }}
                            onClick={openThreeJSCardModal}
                          >
                            <ThreeJSCard width="100%" height="100%" />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FACE 2 */}
                  <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateX(180deg) translateZ(${viewportH / 2}px)`,
                    }}
                  >
                    {/* Museum Section */}
                    <div className="h-full flex items-start justify-center pt-8">
                      <div className="flex w-full max-w-7xl mx-auto px-4">
                        <div className="w-1/4 flex-shrink-0">
                          <h2 className="text-subheading text-white mb-4">Museum</h2>
                          <p className="text-caption text-white-700 max-w-[200px]">
                            Your active investment<br />
                            projects and their<br />
                            current performance
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="bg-onsurface-900 rounded-lg p-4 h-[70vh] flex flex-col justify-between relative overflow-hidden group cursor-pointer">
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ 
                                backgroundImage: 'url(/img/threejs/abyss/icon11.jpg)',
                                filter: 'blur(28px)'
                              }}
                            />
                            <div className="absolute inset-0 bg-surface-800 opacity-90 group-hover:opacity-70 transition-opacity duration-200"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                              <img
                                src="/img/threejs/abyss/icon11.jpg"
                                alt="Project"
                                className="w-16 h-16 object-cover"
                                style={{ objectPosition: 'center' }}
                              />
                              <div className="text-subheading text-white mb-4 mt-8">Museum</div>
                              <div className="text-caption text-white-900 opacity-50">5 000,43 USDT invested</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FACE 3 */}
                  <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateX(270deg) translateZ(${viewportH / 2}px)`,
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
                                projectName: 'Museum',
                                amount: '+3 200,00 USDT',
                                status: 'Completed',
                                date: '1 day ago',
                                projectImage: '/img/threejs/abyss/icon7.jpg'
                              })}
                            >
                              {/* Иконка транзакции */}
                              <div className="w-12 h-12 bg-onsurface-900 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-onsurface-700">
                                {getTransactionIcon('return', 'Return from Museum')}
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
                                projectName: 'Museum',
                                amount: '+420,00 USDT',
                                status: 'Completed',
                                date: '3 hours ago',
                                projectImage: '/img/threejs/abyss/icon2.jpg'
                              })}
                            >
                              {/* Иконка транзакции */}
                              <div className="w-12 h-12 bg-onsurface-900 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-onsurface-700">
                                {getTransactionIcon('dividends', 'Dividends from Museum')}
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
                                projectName: 'Museum',
                                amount: '-5 000,00 USDT',
                                status: 'Completed',
                                date: '2 days ago',
                                projectImage: '/img/threejs/abyss/icon2.jpg'
                              })}
                            >
                              {/* Иконка транзакции */}
                              <div className="w-12 h-12 bg-onsurface-900 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-onsurface-700">
                                {getTransactionIcon('investment', 'Investment in Museum')}
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
