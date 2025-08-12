'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import HammerIcon from './HammerIcon';
import { ThumbsUp } from 'iconoir-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
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
    tiers: {
      name: string;
      description: string;
      isRequired: boolean;
      priceModel: 'per hour' | 'subscription' | 'fixed' | 'unit price' | 'revshare' | 'custom';
      price: string;
      deliveryType: 'physical' | 'digital';
      deliveryWindow: number;
      advancePayment: number;
    }[];
    category: string;
  } | null;
}

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(service?.likes || 0);
  const [activeTab, setActiveTab] = useState(0);

  // Сбрасываем состояние при изменении услуги
  useEffect(() => {
    if (service) {
      setLikesCount(service.likes);
      setLiked(false);
      setActiveTab(0);
    }
  }, [service?.id]);

  // Закрытие по клику на backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Обработчик лайка
  const handleLikeClick = () => {
    if (liked) {
      setLikesCount((prev: number) => prev - 1);
      setLiked(false);
    } else {
      setLikesCount((prev: number) => prev + 1);
      setLiked(true);
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - покрывает весь экран включая header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999 }}
          />
          
          {/* Modal Container */}
          <motion.div
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
            style={{ zIndex: 1000000 }}
          >
            {/* Modal Content */}
            <div className="w-full h-full bg-[#1A1A1A] rounded-lg overflow-y-auto">
              <div className="p-6" style={{ paddingTop: '24px' }}>
                  {/* Cover Image */}
                  <div className="mb-12">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-64 h-40 object-cover"
                      style={{ borderRadius: 0, objectPosition: 'center' }}
                    />
                  </div>

                  {/* Title */}
                  <h1 className="text-heading text-white mb-2">
                    {service.title}
                  </h1>

                  {/* Description */}
                  <p className="text-white-700 text-lg mb-4">
                    {service.description}
                  </p>

                  {/* Type and Stats */}
                  <div className="flex items-center gap-3 text-sm mb-6">
                    <div className="flex items-center gap-2 bg-white-900 hover:bg-white-800 px-3 py-1 rounded transition-colors cursor-pointer">
                      <span className="text-black">{service.category}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white-900 hover:bg-white-800 px-3 py-1 rounded transition-colors cursor-pointer">
                      <span className="text-black">{service.deliveries} delivered</span>
                    </div>
                    <button 
                      onClick={handleLikeClick}
                      className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
                        liked 
                          ? 'bg-[#ffffff]' 
                          : 'bg-white-900 hover:bg-white-800'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${
                        liked ? 'text-black' : 'text-black'
                      }`} />
                      <span className={`${
                        liked ? 'text-black' : 'text-black'
                      }`}>{likesCount}</span>
                    </button>
                  </div>

                  {/* Pricing Tiers */}
                  <div className="mb-8">
                    {/* Tabs */}
                    <div className="flex w-full mb-8 border-b border-white-800">
                      {service.tiers.map((tier, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTab(index)}
                          className={`flex-1 py-6 text-small font-medium transition-colors relative ${
                            activeTab === index
                              ? 'text-white border-b-2 border-white'
                              : 'text-white-700 hover:text-white border-b-2 border-transparent'
                          }`}
                        >
                          {tier.name}
                        </button>
                      ))}
                    </div>
                    
                    {/* Active Tab Content */}
                    {service.tiers[activeTab] && (
                      <div>
                        <div className="mb-8">
                          <h3 className="text-body text-white mb-2">
                            {service.tiers[activeTab].name}
                          </h3>
                          <p className="text-white-700 text-body">
                            {service.tiers[activeTab].description}
                          </p>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex">
                            <span className="text-white-700 w-32">Price Model:</span>
                            <span className="text-white capitalize ml-4">{service.tiers[activeTab].priceModel.replace(' ', ' ')}</span>
                          </div>
                          <div className="flex">
                            <span className="text-white-700 w-32">Price:</span>
                            <span className="text-white ml-4">{service.tiers[activeTab].price}</span>
                          </div>
                          <div className="flex">
                            <span className="text-white-700 w-32">Delivery Type:</span>
                            <span className="text-white capitalize ml-4">{service.tiers[activeTab].deliveryType}</span>
                          </div>
                          <div className="flex">
                            <span className="text-white-700 w-32">Delivery Window:</span>
                            <span className="text-white ml-4">{service.tiers[activeTab].deliveryWindow} days</span>
                          </div>
                          <div className="flex">
                            <span className="text-white-700 w-32">Advance Payment:</span>
                            <span className="text-white ml-4">{service.tiers[activeTab].advancePayment}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                                     </div>
                 </div>
               </div>

            {/* Fixed Contact Button */}
            <div className="absolute bottom-0 right-0 w-full p-6">
              <button 
                className="w-full bg-[#ffffff] text-black font-medium py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                onClick={() => window.open(`https://t.me/${service.contact.telegram}`, '_blank')}
              >
                Contact @{service.contact.telegram}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
