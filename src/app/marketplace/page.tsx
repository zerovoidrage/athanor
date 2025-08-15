'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import HammerIcon from '@/components/ui/HammerIcon';
import Spinner from '@/components/ui/Spinner';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useServiceModal } from '@/contexts/ServiceModalContext';
import ServiceHoverImage from '@/components/ui/ServiceHoverImage';

import { ALL_SERVICES as allServices, BaseService as Service } from '@/data/marketplaceServices';

// Массив изображений для услуг
const marketplaceImages = [
  '/img/marketplace/jpg/1.jpg',
  '/img/marketplace/jpg/2.jpg',
  '/img/marketplace/jpg/3.jpg',
  '/img/marketplace/jpg/4.jpg',
  '/img/marketplace/jpg/5.jpg',
  '/img/marketplace/jpg/6.jpg',
  '/img/marketplace/jpg/7.jpg',
  '/img/marketplace/jpg/8.jpg',
  '/img/marketplace/jpg/9.jpg',
  '/img/marketplace/jpg/10.jpg',
  '/img/marketplace/jpg/11.jpg'
];

// Функция для получения изображения по ID услуги (детерминированная)
const getServiceImage = (serviceId: number): string => {
  const imageIndex = (serviceId - 1) % marketplaceImages.length;
  return marketplaceImages[imageIndex];
};


// Основной компонент контента
function MarketplaceContentComponent() {
  // Получаем выбранную категорию из контекста
  const { selectedCategory } = useMarketplace();
  const [hoverImage, setHoverImage] = useState<{ isVisible: boolean; x: number; y: number }>({
    isVisible: false,
    x: 0,
    y: 0
  });

  // Фильтрация и сортировка услуг по категории
  const filteredServices = (selectedCategory === 'all' 
    ? allServices 
    : allServices.filter(service => 
        service.categories.some(category => 
          category.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
  ).sort((a, b) => b.deliveries - a.deliveries);

  // Состояние загрузки изображений
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [isPageReady, setIsPageReady] = useState(false);

  // Предзагрузка изображений
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = marketplaceImages.map((src, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded(prev => new Set(prev).add(index));
            resolve();
          };
          img.onerror = () => {
            // Если изображение не загрузилось, все равно считаем его загруженным
            setImagesLoaded(prev => new Set(prev).add(index));
            resolve();
          };
          img.src = src;
        });
      });

      await Promise.all(imagePromises);
      setIsPageReady(true);
    };

    loadImages();
  }, []);

  // Заголовки для каждой категории
  const getCategoryTitle = (category: string) => {
    const serviceCount = selectedCategory === 'all' 
      ? allServices.length 
      : allServices.filter(service => 
          service.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
        ).length;

    switch (category) {
      case 'all':
        return `${serviceCount} Curated Offers for Founders`;
      case 'fundraising':
        return `${serviceCount} Offers to Raise Smarter`;
      case 'pr & marketing':
        return `${serviceCount} Services to Get You Noticed`;
      case 'mvp building':
        return `${serviceCount} Fast Tools to Build & Launch`;
      case 'legal & compliance':
        return `${serviceCount} Offers to Set It Up Right`;
      case 'infrastructure':
        return `${serviceCount} Services to Power Your Stack`;
      case 'growth':
        return `${serviceCount} Offers to Scale Your Reach`;
      default:
        return `${serviceCount} Services`;
    }
  };

  // Нумерация услуг в категории
  const getServiceNumber = (service: Service, index: number) => {
    if (selectedCategory === 'all') {
      return service.id;
    }
    // Для конкретной категории - последовательная нумерация
    return index + 1;
  };

  // Упрощенная логика hover-эффекта
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Состояние модального окна
  const { openModal } = useServiceModal();

  const createMouseEnterHandler = (serviceId: number) => (e: React.MouseEvent) => {
    setHoveredService(serviceId);
    setMousePosition({ 
      x: e.pageX, 
      y: e.pageY 
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredService !== null) {
      setMousePosition({ 
        x: e.pageX, 
        y: e.pageY 
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredService(null);
  };

  // Сбрасываем hover состояние при изменении категории
  useEffect(() => {
    setHoveredService(null);
  }, [selectedCategory]);

  // Глобальные слушатели для сброса hover при скролле/колесе/таче
  useEffect(() => {
    const clearHover = () => setHoveredService(null);
    window.addEventListener('scroll', clearHover, { passive: true });
    window.addEventListener('wheel', clearHover, { passive: true });
    window.addEventListener('touchmove', clearHover, { passive: true });
    window.addEventListener('resize', clearHover);

    return () => {
      window.removeEventListener('scroll', clearHover);
      window.removeEventListener('wheel', clearHover);
      window.removeEventListener('touchmove', clearHover);
      window.removeEventListener('resize', clearHover);
    };
  }, []);



  // Обработчик открытия модального окна
  const handleServiceClick = (serviceId: number) => {
    openModal(serviceId);
  };

  // Показываем загрузку пока страница не готова
  if (!isPageReady) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Hover Image (не перехватывает события) */}
      {hoveredService && (
        <div className="pointer-events-none fixed inset-0 z-40">
          <ServiceHoverImage
            isVisible={hoveredService !== null}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
            imageUrl={getServiceImage(hoveredService)}
            serviceTitle={allServices.find(s => s.id === hoveredService)?.title || ''}
            deliveries={0}
            category={''}
          />
        </div>
      )}



      {/* Контент страницы */}
      <div className="relative z-50 pt-20" style={{ marginTop: '30vh' }}>
        <Suspense fallback={
          <div className="w-full p-5 pb-20 flex items-center justify-center">
            <Spinner size="md" />
          </div>
        }>
          <div className="w-full p-5 pb-20">
            {/* Заголовок */}
            <div className="mb-12">
              <motion.h1 
                className="text-display font-regular text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {getCategoryTitle(selectedCategory)}
              </motion.h1>
            </div>

            {/* Список услуг */}
            <div 
              className="relative z-50"
              onMouseLeave={handleMouseLeave}
            >
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.05,
                    ease: "easeOut" 
                  }}
                  className="group cursor-pointer service-item relative z-50"
                  data-service-id={service.id}
                  onMouseEnter={createMouseEnterHandler(service.id)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div 
                    className="grid grid-cols-[40px_auto_1fr_auto_auto] gap-6 py-3 transition-all duration-200"
                    onClick={() => handleServiceClick(service.id)}
                  >
                    {/* Номер */}
                    <div className="text-display text-white-700 group-hover:text-white-900 transition-colors">
                      {getServiceNumber(service, index)}
                    </div>

                    {/* Изображение услуги */}
                    <div className="flex items-center">
                      <img
                        src={getServiceImage(service.id)}
                        alt={service.title}
                        className="w-6 h-4 object-cover"
                        style={{ borderRadius: 0, objectPosition: 'center' }}
                        onError={(e) => {
                          // Если изображение не загрузилось, скрываем его
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Название */}
                    <div>
                      <h3 className="text-display text-white-700 group-hover:text-white-900 transition-colors">
                        {service.title}
                      </h3>
                    </div>

                    {/* Лейблы категорий */}
                    <div className="text-left">
                      {service.categories.map((category) => (
                        <span 
                          key={category}
                          className="text-heading text-white-700 group-hover:text-white-900 transition-colors"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Количество сделок */}
                    <div className="flex items-center gap-2 text-heading text-white-700 group-hover:text-white-900 transition-colors justify-self-end">
                      <HammerIcon className="w-3 h-3 text-white-700 group-hover:text-white-900 transition-colors" />
                      <span>{service.deliveries} delivered</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

// Основной экспорт с обработкой ошибок
export default function Marketplace() {
  return (
    <ErrorBoundary>
      <MarketplaceContentComponent />
    </ErrorBoundary>
  );
}

// Компонент для обработки ошибок
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Marketplace error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="text-white text-lg">Something went wrong. Please try again.</div>
        </div>
      );
    }

    return this.props.children;
  }
}
