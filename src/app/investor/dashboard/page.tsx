'use client';

import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionModal } from '@/contexts/TransactionModalContext';
import TransactionModal from '@/components/modals/TransactionModal';
import { transactionItemStyles } from '@/styles/transactionItem';
import { ArrowUpRight, ArrowDownRight, Coins, Wallet, Dollar, Bank, PiggyBank, Plus, Minus, Undo, CoinsSwap, Compass, AppleWallet, Clock } from 'iconoir-react';
import ThreeJSCard from '@/components/ThreeJSCard';
import PrimaryButtonReverse from '@/components/ui/PrimaryButtonReverse';

// Компонент плавающих табов
function FloatingTabs({
  indicator, tabs, currentSection, goTo, navWrapRef, navRowRef,
  tabRefs, onReady,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const id = requestAnimationFrame(() => onReady?.());
      return () => cancelAnimationFrame(id);
    }
  }, [mounted, onReady]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-x-0 flex justify-center z-[10000] pointer-events-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
    >
      <div
        ref={navWrapRef}
        className="px-0 py-0 pointer-events-auto"
      >
        <div className="flex items-center gap-2 relative" ref={navRowRef}>
          <motion.div
            className="absolute bg-onsurface-800 rounded-md"
            style={{ top: 2, left: 0, height: 'calc(100% - 4px)', pointerEvents: 'none', zIndex: 0 }}
            animate={{ x: indicator.x, width: indicator.w }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
          {tabs.map((t, i) => {
            const isActive = currentSection === i;
            return (
              <button
                key={t.key}
                ref={(el) => { if (el) tabRefs.current[i] = el; }}
                onClick={() => goTo(i)}
                className={`px-4 py-2 text-caption transition-colors rounded-full relative z-10 flex items-center justify-center ${
                  isActive ? 'text-white' : 'text-white-700 hover:text-white-900'
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {t.icon && <img src={t.icon} alt={t.label} className="w-4 h-4 object-cover" />}
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function InvestorDashboardPage() {
  const { displayName } = useAuth();
  const { openModal, isOpen, transaction, closeModal } = useTransactionModal();
  
  // Константы
  const NAV_SAFE = 72; // фиксированная высота пилюли с внешними отступами
  
  const [currentSection, setCurrentSection] = useState(0);
  const [prevSection, setPrevSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  


  // таймеры для переключений, чтобы можно было прервать и запустить новую анимацию
  const halfTimerRef = useRef<number | null>(null);
  const endTimerRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // NEW: refs & state for indicator geometry
  const tabRefs = useRef<HTMLButtonElement[]>([]);
  const navRowRef = useRef<HTMLDivElement>(null);
  const navWrapRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number }>({ x: 0, w: 0 });
  const [occluderH, setOccluderH] = useState(96); // дефолт, потом пересчитаем

  // Конфиг вкладок
  const tabs = [
    { key: 'vault', label: 'vault' },
    { key: 'card', label: 'my card' },
    { key: 'museum', label: 'museum', icon: '/img/threejs/abyss/icon2.jpg' },
    { key: 'tx', label: 'transactions' },
  ];

  // NEW: стабильные рефы для лока и актуального индекса
  const isAnimatingRef = useRef(false);
  const currentSectionRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  // NEW: рефы для высоты и ресайза
  const viewportRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [cubeSide, setCubeSide] = useState(800); // разумное значение по умолчанию

  // синхронизируем реф при каждом ререндере
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);



  const measureTabs = () => {
    const row = navRowRef.current;
    if (!row) return;
    const rowRect = row.getBoundingClientRect();

    const meta = tabs.map((_, i) => {
      const el = tabRefs.current[i];
      if (!el) return { x: 0, w: 0 };
      const r = el.getBoundingClientRect();
      return { x: r.left - rowRect.left, w: r.width };
    });

    // keep for quick access
    (measureTabs as any)._meta = meta;
    const cur = meta[currentSectionRef.current] || { x: 0, w: 0 };
    setIndicator(cur);
  };

  // На хард-рефреше гарантируем позицию скролла до запуска анимаций
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Запускаем анимацию только один раз при первой загрузке
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // cubeSide считаем один раз синхронно (до первого кадра) по реально отрендеренной высоте сцены
  useLayoutEffect(() => {
    const calc = () => {
      const h = sceneRef.current?.offsetHeight ?? (window.innerHeight - 72);
      setCubeSide(Math.round(h * 0.9));
    };
    calc();
    // Если нужна реакция только на смену ориентации:
    const onOrient = () => setTimeout(calc, 50);
    window.addEventListener('orientationchange', onOrient);
    return () => window.removeEventListener('orientationchange', onOrient);
  }, []);

  // update indicator when section changes
  useEffect(() => {
    const meta = (measureTabs as any)._meta as Array<{ x: number; w: number }> | undefined;
    if (!meta) { measureTabs(); return; }
    const cur = meta[currentSection] || { x: 0, w: 0 };
    setIndicator(cur);
  }, [currentSection]);

  useEffect(() => {
    const calcOffsets = () => {
      const navH = navWrapRef.current?.offsetHeight ?? 64;
      // Шторка как была
      setOccluderH(Math.max(84, navH + 36));
    };
    calcOffsets();
    window.addEventListener('resize', calcOffsets);
    return () => window.removeEventListener('resize', calcOffsets);
  }, []);

  // recalc on mount & resize
  useEffect(() => {
    measureTabs();
    window.addEventListener('resize', measureTabs);
    return () => window.removeEventListener('resize', measureTabs);
  }, []);

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (halfTimerRef.current) clearTimeout(halfTimerRef.current);
      if (endTimerRef.current)  clearTimeout(endTimerRef.current);
    };
  }, []);

  const getFaceOpacity = (index: number) => {
    if (currentSection === index) return 1;
    if (isAnimating && prevSection === index) {
      // если идём ВНИЗ (prev < current), подсвечиваем старую грань
      if (prevSection < currentSection) return 1;
      // если идём ВВЕРХ (prev > current), сразу гасим
      return 0;
    }
    return 0;
  };

  const goTo = (section: number) => {
    const max = tabs.length - 1;
    const idx = Math.max(0, Math.min(section, max));
    if (idx === currentSectionRef.current && !isAnimatingRef.current) return;

    // сбрасываем старые таймеры, чтобы можно было кликать в процессе
    if (halfTimerRef.current) { clearTimeout(halfTimerRef.current); halfTimerRef.current = null; }
    if (endTimerRef.current)  { clearTimeout(endTimerRef.current);  endTimerRef.current  = null; }

    isAnimatingRef.current = true;
    setIsAnimating(true);
    const prev = currentSectionRef.current;
    setPrevSection(prev);
    setCurrentSection(idx);

    const DURATION = 800;
    const HALF = DURATION / 2;

    halfTimerRef.current = window.setTimeout(() => {
      setPrevSection(idx);
    }, HALF);

    endTimerRef.current = window.setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
      setPrevSection(idx);
    }, DURATION);
  };

  // === СЕКЦИОННЫЙ СКРОЛЛ (устойчивые слушатели) ===
  useEffect(() => {
    if (!viewportRef.current) return;

    const container = viewportRef.current;
    const sections = 4;
    const ANIM_LOCK_MS = 800; // время блокировки анимации
    const SWIPE_THRESHOLD = 50; // px
    const WHEEL_THRESHOLD = 20; // отфильтровать мелкий тачпад-шум

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const goToInEffect = (nextIndex: number) => {
      const idx = Math.max(0, Math.min(nextIndex, tabs.length - 1));
      goTo(idx); // логика одна, клик работает даже в процессе анимации
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
  }, []); // <— без currentSection!

  const handleTransactionClick = (transaction: any) => {
    openModal(transaction);
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
            <FloatingTabs
              indicator={indicator}
              tabs={tabs}
              currentSection={currentSection}
              goTo={goTo}
              navWrapRef={navWrapRef}
              navRowRef={navRowRef}
              tabRefs={tabRefs}
              onReady={measureTabs}
            />

            {/* Контент dashboard */}
            <div
              ref={viewportRef}
              className="relative overflow-hidden use-vh"
              style={{
                height: '100svh',
                perspective: 1400,
                perspectiveOrigin: '50% 55%',
                overscrollBehavior: 'none',
              }}
            >
              {/* фон под слайдером, не перехватывает клики */}
              <div style={{
                position:'absolute', left:0, right:0, bottom:0,
                height: 72, background:'black', zIndex:0, pointerEvents:'none'
              }} />
              {/* Подсветка под слайдером */}
              <div
                style={{
                  position: 'absolute',
                  left: 0, right: 0, bottom: 0,
                  height: NAV_SAFE + 24,
                  background: 'linear-gradient(to top, rgba(255,255,255,0.06) 40%, transparent 100%)',
                  zIndex: 5, // выше сцены, ниже портала
                  pointerEvents: 'none',
                }}
              />
              <div
                ref={sceneRef}
                style={{
                  position:'absolute', top:0, left:0, right:0,
                  height: 'calc(100svh - 72px)',
                  transformStyle:'preserve-3d',
                  transform: `translateZ(-${Math.max(cubeSide,1)/2}px)`,
                  zIndex: 2, willChange:'transform'
                }}
              >
                <motion.div
                  initial={false}
                  animate={{ rotateX: currentSection * -90 }}
                  transition={{ duration: 0.8, ease: [0.2,0.8,0.2,1] }}
                  style={{
                    position:'relative', width:'100%', height:'100%',
                    transformStyle:'preserve-3d', transformOrigin:'50% 50% 0'
                  }}
                >
                  {/* FACE 0 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transformOrigin: '50% 50%',
                      transform: `rotateX(0deg) translateZ(${cubeSide / 2}px)`,
                    }}
                  >
                    {/* Vault Section */}
                    <div className="h-full flex items-start justify-center pt-8">
                      <div className="flex w-full max-w-7xl mx-auto px-6">
                        <div className="w-1/5 flex-shrink-0">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
                          >
                            <h2 className="text-subheading text-white mb-4">Vault</h2>
                            <p className="text-caption text-white-700 max-w-[200px]">
                              Your investment portfolio<br />
                              overview and total<br />
                              capital allocation
                            </p>
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <motion.div 
                            className="bg-white-900 rounded-lg p-4 h-[70vh] flex flex-col justify-between w-full"
                            initial={{ opacity: 0, y: 30 }}
                            animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.4 }}
                          >
                            <motion.div 
                              className="text-largetitle text-black"
                              initial={{ opacity: 0, y: 15 }}
                              animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.6 }}
                            >
                              <div>Hey</div>
                              <div>{displayName},</div>
                              <div>you've got</div>
                              <div>5 000,43 USDT in play</div>
                            </motion.div>
                            <div className="flex justify-start items-end">
                              <motion.div 
                                className="text-caption text-black font-largetitle" 
                                style={{ opacity: 0.5 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={hasAnimated ? { opacity: 0.5, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1], delay: 0.8 }}
                              >
                                Capital invested across active projects.
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FACE 1 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transformOrigin: '50% 50%',
                      transform: `rotateX(90deg) translateZ(${cubeSide / 2}px)`,
                    }}
                  >
                    {/* My Card Section */}
                    <div className="h-full flex items-start justify-center pt-8">
                      <div className="flex w-full max-w-7xl mx-auto px-6">
                        <div className="w-1/5 flex-shrink-0">
                          <h2 className="text-subheading text-white mb-4">My Card</h2>
                          <p className="text-caption text-white-700 max-w-[200px]">
                            Athanor Investor Card —<br />
                            exclusive access to invest<br />
                            in curated projects
                          </p>
                        </div>
                        <div className="flex-1">
                                                                                <div 
                            className="rounded-lg h-[70vh] overflow-hidden relative w-full"
                            style={{ 
                              backgroundImage: 'url(/gpt.png)',
                              backgroundSize: '120%',
                              backgroundPosition: '44% center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          >
                                                          <ThreeJSCard width="100%" height="100%" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FACE 2 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transformOrigin: '50% 50%',
                      transform: `rotateX(180deg) translateZ(${cubeSide / 2}px)`,
                    }}
                  >
                    {/* Museum Section */}
                    <div className="h-full flex items-start justify-center pt-8">
                      <div className="flex w-full max-w-7xl mx-auto px-6">
                        <div className="w-1/5 flex-shrink-0">
                          <h2 className="text-subheading text-white mb-4">Museum</h2>
                          <p className="text-caption text-white-700 max-w-[200px]">
                            Curated collection of<br />
                            high-potential projects<br />
                            with detailed analytics
                          </p>
                        </div>
                        <div className="flex-1">
                                                      <div className="bg-onsurface-900 rounded-lg p-4 h-[70vh] flex flex-col justify-between relative overflow-hidden group cursor-pointer">
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ 
                                backgroundImage: 'url(/img/threejs/abyss/icon2.jpg)',
                                filter: 'blur(28px)'
                              }}
                            />
                            <div className="absolute inset-0 bg-surface-800 opacity-90 group-hover:opacity-70 transition-opacity duration-200"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                              <img
                                src="/img/threejs/abyss/icon2.jpg"
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
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transformOrigin: '50% 50%',
                      transform: `rotateX(270deg) translateZ(${cubeSide / 2}px)`,
                    }}
                  >
                    {/* Transactions Section */}
                    <div className="h-full flex items-start justify-center pt-8">
                      <div className="flex w-full max-w-7xl mx-auto px-6">
                        <div className="w-1/5 flex-shrink-0">
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
                                projectImage: '/img/threejs/abyss/icon2.jpg'
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
            </div>
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