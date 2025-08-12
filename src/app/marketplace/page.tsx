'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import HammerIcon from '@/components/ui/HammerIcon';
import Spinner from '@/components/ui/Spinner';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useServiceModal } from '@/contexts/ServiceModalContext';
import ServiceHoverImage from '@/components/ui/ServiceHoverImage';

// Типы данных
interface Service {
  id: number;
  title: string;
  deliveries: number;
  categories: string[];
}

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



// Данные услуг (128 услуг, отсортированные по delivered от большего к меньшему)
const allServices: Service[] = [
  // Top Services (30+ delivered)
  { id: 1, title: 'Pitch Deck Review + AI Rewrite', deliveries: 45, categories: ['Fundraising'] },
  { id: 2, title: 'Growth Hacking / GTM Strategy', deliveries: 42, categories: ['PR & Marketing'] },
  { id: 3, title: 'Customer Acquisition Strategy', deliveries: 38, categories: ['Growth'] },
  { id: 4, title: 'Web3 Legal Setup (US, Estonia, BVI)', deliveries: 35, categories: ['Legal & Compliance'] },
  { id: 5, title: 'No-Code MVP Builder', deliveries: 33, categories: ['MVP Building'] },
  { id: 6, title: 'Smart Contract Audit', deliveries: 32, categories: ['Legal & Compliance'] },
  { id: 7, title: 'API Development & Integration', deliveries: 30, categories: ['Infrastructure'] },
  { id: 8, title: 'Conversion Rate Optimization', deliveries: 29, categories: ['Growth'] },
  { id: 9, title: 'Social Media Strategy', deliveries: 28, categories: ['PR & Marketing'] },
  { id: 10, title: 'Tokenomics Modeling & Simulation', deliveries: 27, categories: ['Fundraising'] },
  { id: 11, title: 'Product Roadmap + AI Spec Pack', deliveries: 26, categories: ['Infrastructure'] },
  { id: 12, title: 'Market Research & Validation', deliveries: 25, categories: ['Growth'] },
  { id: 13, title: 'Cloud Infrastructure Setup', deliveries: 24, categories: ['Infrastructure'] },
  { id: 14, title: 'Brand Identity & Messaging', deliveries: 23, categories: ['PR & Marketing'] },
  { id: 15, title: 'Investor List & Intro Service', deliveries: 22, categories: ['Fundraising'] },

  // High Demand Services (20-29 delivered)
  { id: 16, title: 'Content Marketing Campaign', deliveries: 21, categories: ['PR & Marketing'] },
  { id: 17, title: 'Retention & Engagement Optimization', deliveries: 20, categories: ['Growth'] },
  { id: 18, title: 'Prototype Development', deliveries: 19, categories: ['MVP Building'] },
  { id: 19, title: 'Custom KYC / AML Platform', deliveries: 18, categories: ['Infrastructure'] },
  { id: 20, title: 'Competitive Analysis', deliveries: 17, categories: ['Growth'] },
  { id: 21, title: 'DevOps & CI/CD Pipeline', deliveries: 16, categories: ['Infrastructure'] },
  { id: 22, title: 'Revenue Model Optimization', deliveries: 15, categories: ['Growth'] },
  { id: 23, title: 'Performance Marketing Setup', deliveries: 14, categories: ['Growth'] },
  { id: 24, title: 'SEO & Analytics Setup', deliveries: 13, categories: ['PR & Marketing'] },
  { id: 25, title: 'Product Launch Strategy', deliveries: 12, categories: ['PR & Marketing'] },
  { id: 26, title: 'User Testing & Feedback', deliveries: 11, categories: ['MVP Building'] },
  { id: 27, title: 'A/B Testing Framework', deliveries: 10, categories: ['Growth'] },
  { id: 28, title: 'Data Protection & GDPR', deliveries: 9, categories: ['Legal & Compliance'] },
  { id: 29, title: 'Database Architecture', deliveries: 8, categories: ['Infrastructure'] },
  { id: 30, title: 'Partnership Development', deliveries: 7, categories: ['Growth'] },

  // Medium Demand Services (15-19 delivered)
  { id: 31, title: 'Investor Call Coaching (ex-YC Founder)', deliveries: 19, categories: ['Fundraising'] },
  { id: 32, title: 'Financial Modeling', deliveries: 18, categories: ['Fundraising'] },
  { id: 33, title: 'Influencer Partnership Program', deliveries: 17, categories: ['PR & Marketing'] },
  { id: 34, title: 'Customer Success Program', deliveries: 16, categories: ['Growth'] },
  { id: 35, title: 'Cap Table Optimization', deliveries: 15, categories: ['Fundraising'] },
  { id: 36, title: 'Regulatory Compliance Framework', deliveries: 14, categories: ['Legal & Compliance'] },
  { id: 37, title: 'Scalability Planning', deliveries: 13, categories: ['Infrastructure'] },
  { id: 38, title: 'Team Building & Recruitment', deliveries: 12, categories: ['Growth'] },
  { id: 39, title: 'User Research & Validation', deliveries: 11, categories: ['MVP Building'] },
  { id: 40, title: 'Security Audit & Penetration Testing', deliveries: 10, categories: ['Infrastructure'] },

  // Standard Services (10-14 delivered)
  { id: 41, title: 'Due Diligence Preparation', deliveries: 14, categories: ['Fundraising'] },
  { id: 42, title: 'Feature Prioritization', deliveries: 13, categories: ['MVP Building'] },
  { id: 43, title: 'Market Expansion Strategy', deliveries: 12, categories: ['Growth'] },
  { id: 44, title: 'Technical Due Diligence', deliveries: 11, categories: ['Infrastructure'] },
  { id: 45, title: 'Intellectual Property Protection', deliveries: 10, categories: ['Legal & Compliance'] },
  { id: 46, title: 'International Expansion Legal', deliveries: 9, categories: ['Legal & Compliance'] },
  { id: 47, title: 'Term Sheet Negotiation', deliveries: 8, categories: ['Fundraising'] },
  { id: 48, title: 'Crisis Management Strategy', deliveries: 7, categories: ['PR & Marketing'] },
  { id: 49, title: 'Exit Strategy Planning', deliveries: 6, categories: ['Fundraising'] },

  // Additional Services (50-79)
  { id: 50, title: 'Blockchain Development Services', deliveries: 15, categories: ['Infrastructure'] },
  { id: 51, title: 'DeFi Protocol Development', deliveries: 14, categories: ['Infrastructure'] },
  { id: 52, title: 'NFT Marketplace Development', deliveries: 13, categories: ['Infrastructure'] },
  { id: 53, title: 'Smart Contract Development', deliveries: 12, categories: ['Infrastructure'] },
  { id: 54, title: 'Web3 Wallet Integration', deliveries: 11, categories: ['Infrastructure'] },
  { id: 55, title: 'Cross-Chain Bridge Development', deliveries: 10, categories: ['Infrastructure'] },
  { id: 56, title: 'DAO Governance Setup', deliveries: 9, categories: ['Infrastructure'] },
  { id: 57, title: 'Token Launch Strategy', deliveries: 8, categories: ['Fundraising'] },
  { id: 58, title: 'ICO/IDO Marketing Campaign', deliveries: 7, categories: ['PR & Marketing'] },
  { id: 59, title: 'Community Management', deliveries: 6, categories: ['Growth'] },
  { id: 60, title: 'Discord Server Setup', deliveries: 5, categories: ['Growth'] },

  // Services 61-80
  { id: 61, title: 'Telegram Bot Development', deliveries: 4, categories: ['Infrastructure'] },
  { id: 62, title: 'Discord Bot Development', deliveries: 3, categories: ['Infrastructure'] },
  { id: 63, title: 'Twitter Bot Development', deliveries: 2, categories: ['Infrastructure'] },
  { id: 64, title: 'Reddit Bot Development', deliveries: 1, categories: ['Infrastructure'] },
  { id: 65, title: 'Telegram Channel Management', deliveries: 5, categories: ['Growth'] },
  { id: 66, title: 'Twitter Account Management', deliveries: 4, categories: ['Growth'] },
  { id: 67, title: 'Reddit Community Management', deliveries: 3, categories: ['Growth'] },
  { id: 68, title: 'YouTube Channel Management', deliveries: 2, categories: ['Growth'] },
  { id: 69, title: 'TikTok Account Management', deliveries: 1, categories: ['Growth'] },
  { id: 70, title: 'LinkedIn Account Management', deliveries: 5, categories: ['Growth'] },

  // Services 71-90
  { id: 71, title: 'Facebook Page Management', deliveries: 4, categories: ['Growth'] },
  { id: 72, title: 'Instagram Account Management', deliveries: 3, categories: ['Growth'] },
  { id: 73, title: 'Snapchat Account Management', deliveries: 2, categories: ['Growth'] },
  { id: 74, title: 'Pinterest Account Management', deliveries: 1, categories: ['Growth'] },
  { id: 75, title: 'Quora Account Management', deliveries: 5, categories: ['Growth'] },
  { id: 76, title: 'Medium Blog Management', deliveries: 4, categories: ['Growth'] },
  { id: 77, title: 'Substack Newsletter Management', deliveries: 3, categories: ['Growth'] },
  { id: 78, title: 'Podcast Management', deliveries: 2, categories: ['Growth'] },
  { id: 79, title: 'Video Production', deliveries: 1, categories: ['PR & Marketing'] },
  { id: 80, title: 'Graphic Design Services', deliveries: 5, categories: ['PR & Marketing'] },

  // Services 81-100
  { id: 81, title: 'Logo Design', deliveries: 4, categories: ['PR & Marketing'] },
  { id: 82, title: 'Website Design', deliveries: 3, categories: ['PR & Marketing'] },
  { id: 83, title: 'Mobile App Design', deliveries: 2, categories: ['PR & Marketing'] },
  { id: 84, title: 'UI/UX Design', deliveries: 1, categories: ['PR & Marketing'] },
  { id: 85, title: 'Brand Guidelines', deliveries: 5, categories: ['PR & Marketing'] },
  { id: 86, title: 'Marketing Materials Design', deliveries: 4, categories: ['PR & Marketing'] },
  { id: 87, title: 'Presentation Design', deliveries: 3, categories: ['PR & Marketing'] },
  { id: 88, title: 'Infographic Design', deliveries: 2, categories: ['PR & Marketing'] },
  { id: 89, title: 'Brochure Design', deliveries: 1, categories: ['PR & Marketing'] },
  { id: 90, title: 'Business Card Design', deliveries: 5, categories: ['PR & Marketing'] },

  // Services 91-110
  { id: 91, title: 'Email Marketing Setup', deliveries: 4, categories: ['Growth'] },
  { id: 92, title: 'SMS Marketing Setup', deliveries: 3, categories: ['Growth'] },
  { id: 93, title: 'Push Notification Setup', deliveries: 2, categories: ['Growth'] },
  { id: 94, title: 'In-App Messaging Setup', deliveries: 1, categories: ['Growth'] },
  { id: 95, title: 'Chatbot Development', deliveries: 5, categories: ['Infrastructure'] },
  { id: 96, title: 'Live Chat Integration', deliveries: 4, categories: ['Infrastructure'] },
  { id: 97, title: 'Customer Support System', deliveries: 3, categories: ['Infrastructure'] },
  { id: 98, title: 'Help Desk Setup', deliveries: 2, categories: ['Infrastructure'] },
  { id: 99, title: 'Knowledge Base Setup', deliveries: 1, categories: ['Infrastructure'] },
  { id: 100, title: 'FAQ System Setup', deliveries: 5, categories: ['Infrastructure'] },

  // Services 101-120
  { id: 101, title: 'Analytics Dashboard Setup', deliveries: 4, categories: ['Infrastructure'] },
  { id: 102, title: 'Reporting System Setup', deliveries: 3, categories: ['Infrastructure'] },
  { id: 103, title: 'Data Visualization Setup', deliveries: 2, categories: ['Infrastructure'] },
  { id: 104, title: 'Business Intelligence Setup', deliveries: 1, categories: ['Infrastructure'] },
  { id: 105, title: 'CRM Integration', deliveries: 5, categories: ['Infrastructure'] },
  { id: 106, title: 'ERP Integration', deliveries: 4, categories: ['Infrastructure'] },
  { id: 107, title: 'Payment Gateway Integration', deliveries: 3, categories: ['Infrastructure'] },
  { id: 108, title: 'Shipping Integration', deliveries: 2, categories: ['Infrastructure'] },
  { id: 109, title: 'Inventory Management Setup', deliveries: 1, categories: ['Infrastructure'] },
  { id: 110, title: 'Order Management Setup', deliveries: 5, categories: ['Infrastructure'] },

  // Services 121-128
  { id: 111, title: 'Customer Portal Development', deliveries: 4, categories: ['Infrastructure'] },
  { id: 112, title: 'Admin Panel Development', deliveries: 3, categories: ['Infrastructure'] },
  { id: 113, title: 'API Documentation', deliveries: 2, categories: ['Infrastructure'] },
  { id: 114, title: 'SDK Development', deliveries: 1, categories: ['Infrastructure'] },
  { id: 115, title: 'Plugin Development', deliveries: 5, categories: ['Infrastructure'] },
  { id: 116, title: 'Extension Development', deliveries: 4, categories: ['Infrastructure'] },
  { id: 117, title: 'Mobile App Development', deliveries: 3, categories: ['Infrastructure'] },
  { id: 118, title: 'Web App Development', deliveries: 2, categories: ['Infrastructure'] },
  { id: 119, title: 'Desktop App Development', deliveries: 1, categories: ['Infrastructure'] },
  { id: 120, title: 'Game Development', deliveries: 5, categories: ['Infrastructure'] },
  { id: 121, title: 'VR/AR Development', deliveries: 4, categories: ['Infrastructure'] },
  { id: 122, title: 'IoT Development', deliveries: 3, categories: ['Infrastructure'] },
  { id: 123, title: 'AI/ML Integration', deliveries: 2, categories: ['Infrastructure'] },
  { id: 124, title: 'Blockchain Integration', deliveries: 1, categories: ['Infrastructure'] },
  { id: 125, title: 'Cloud Migration', deliveries: 5, categories: ['Infrastructure'] },
  { id: 126, title: 'Data Migration', deliveries: 4, categories: ['Infrastructure'] },
  { id: 127, title: 'System Integration', deliveries: 3, categories: ['Infrastructure'] },
  { id: 128, title: 'Legacy System Modernization', deliveries: 2, categories: ['Infrastructure'] }
];

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
      {/* Hover Image */}
      {hoveredService && (
        <ServiceHoverImage
          isVisible={hoveredService !== null}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          imageUrl={getServiceImage(hoveredService)}
          serviceTitle={allServices.find(s => s.id === hoveredService)?.title || ''}
          deliveries={0}
          category={''}
        />
      )}



      {/* Контент страницы */}
      <div className="relative z-10 pt-20" style={{ marginTop: '30vh' }}>
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
            <div>
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
                  className="group cursor-pointer service-item"
                  onMouseEnter={createMouseEnterHandler(service.id)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className="grid grid-cols-[40px_auto_1fr_auto_auto] gap-6 py-3 transition-all duration-200">
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
