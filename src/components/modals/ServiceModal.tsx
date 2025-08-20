'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ThumbsUp, Xmark } from 'iconoir-react';
import { usePageScrollLock } from '@/hooks/usePageScrollLock';

interface Service {
  id: number;
  title: string;
  deliveries: number;
  categories: string[];
  imageUrl: string;
  type: 'product' | 'service';
  description: string;
  likes: number;
  contact: {
    telegram: string;
    name: string;
  };
  customTiers: {
    id: string;
    name: string;
    description: string;
    price: string;
    features: string[];
  }[];
  category: string;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service }) => {
  usePageScrollLock(!!isOpen);
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());
  const [isLiked, setIsLiked] = useState(false);

  const toggleTier = (tierId: string) => {
    setExpandedTiers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tierId)) {
        // Если тир уже открыт - сворачиваем его
        newSet.delete(tierId);
      } else {
        // Если тир закрыт - сначала очищаем все, потом открываем только этот
        newSet.clear();
        newSet.add(tierId);
      }
      return newSet;
    });
  };

  const toggleLike = () => {
    setIsLiked(prev => !prev);
  };

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

  if (!isOpen) return null;
  const s = service ?? {
    id: 0, title: 'Service', description: '', category: 'General',
    deliveries: 0, imageUrl: '/img/marketplace/jpg/1.jpg',
    contact: { telegram: 'expert_consultant', name: 'Expert' },
    likes: 0, customTiers: [
      {
        id: 'default',
        name: 'Default Tier',
        description: 'Basic service package',
        price: '$100',
        features: ['Feature 1', 'Feature 2', 'Feature 3']
      }
    ],
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
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        style={{ zIndex: 99999 }}
        onClick={handleBackdropClick}
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
        className="fixed right-0 top-0 w-1/2 h-full p-2"
        style={{ zIndex: 100000 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
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
            
            {/* Cover Image */}
            <div className="mb-12">
              <img
                src={s.imageUrl}
                alt={s.title}
                className="w-44 h-28 object-cover"
                style={{ borderRadius: 0, objectPosition: 'center' }}
              />
            </div>

            {/* Title */}
            <h1 className="text-heading text-white mb-4">
              {s.title}
            </h1>

            {/* Description */}
            <p className="text-white-700 text-subheading2 mb-5">
              {s.description}
            </p>

            {/* Type and Stats */}
            <div className="flex items-center gap-2 text-caption mb-6">
              <div className="flex-1 flex items-center justify-center gap-2 bg-onsurface-900 px-6 py-3 rounded-md transition-colors">
                <span className="text-white-900">{s.category}</span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 bg-onsurface-900 px-6 py-3 rounded-md transition-colors">
                <span className="text-white-900">{s.deliveries} delivered</span>
              </div>
              
              {/* Like Button */}
              <button
                onClick={toggleLike}
                className="flex-1 flex items-center justify-center gap-2 bg-onsurface-900 px-6 py-3 rounded-md transition-colors hover:bg-onsurface-800 cursor-pointer"
              >
                <ThumbsUp 
                  width={16} 
                  height={16} 
                  className={`transition-colors ${isLiked ? 'text-green-400 fill-current' : 'text-white'}`}
                />
                <span className={`text-sm ${isLiked ? 'text-green-400' : 'text-white'}`}>
                  {isLiked ? s.likes + 1 : s.likes}
                </span>
              </button>
            </div>

            {/* Custom Pricing Tiers */}
            <div className="mt-12 mb-20">
              <h2 className="text-caption text-white-700 mb-4">Pricing Tiers</h2>
              <div className="bg-onsurface-900 rounded-lg p-1">
                <div className="space-y-1">
                  {(s.customTiers || []).map((tier, index) => (
                    <div key={tier.id} className="rounded-lg overflow-hidden">
                      <button
                        className={`w-full px-4 py-4 flex items-center justify-between text-left hover:bg-onsurface-900 transition-colors ${
                          expandedTiers.has(tier.id) ? 'rounded-b-lg' : ''
                        }`}
                        onClick={() => toggleTier(tier.id)}
                      >
                        <div className="flex-1">
                          <h3 className="text-caption text-white-900">{tier.name}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-white text-sm">{tier.price}</span>
                          <svg
                            className={`w-5 h-5 text-white-700 transition-transform duration-200 ${
                              expandedTiers.has(tier.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {expandedTiers.has(tier.id) && (
                        <div className="px-4 pb-4 rounded-b-lg">
                          <div className="pt-4">
                            <p className="text-white-700 text-caption mb-6 leading-relaxed">{tier.description}</p>
                            <ul className="space-y-1">
                              {tier.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="text-sm text-white-800 flex items-center">
                                  <span className="w-1 h-1 bg-white-700 rounded-full mr-4"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Contact Button */}
        <div className="absolute bottom-0 right-0 w-full p-6">
          <button 
            className="w-full bg-[#ffffff] text-black font-medium py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            onClick={() => window.open(`https://t.me/${s.contact.telegram}`, '_blank')}
          >
            Contact @{s.contact.telegram}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ServiceModal;
