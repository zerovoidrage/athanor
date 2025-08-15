'use client';

import React, { createContext, useContext, useState } from 'react';
import ServiceModal from './ServiceModal';

import { ALL_SERVICES } from '@/data/marketplaceServices';

const IMG_COUNT = 11;

const getFullServiceData = (serviceId: number) => {
  const base = ALL_SERVICES.find(s => s.id === serviceId);

  // Фолбэк, если почему-то не нашли (не должен срабатывать при синхронных данных)
  const safe = base ?? {
    id: serviceId,
    title: `Service #${serviceId}`,
    deliveries: 0,
    categories: ['General'],
    customTiers: [],
  };

  const descriptions = [
    "Professional service with proven track record and excellent client satisfaction.",
    "Expert solution tailored to your specific needs and requirements.",
    "High-quality service delivered by experienced professionals in the field.",
    "Comprehensive solution designed to meet modern business challenges.",
    "Innovative approach with cutting-edge technology and best practices."
  ];

  const contacts = [
    { telegram: "expert_consultant", name: "Expert Consulting Group" },
    { telegram: "pro_services", name: "Professional Services Inc" },
    { telegram: "biz_solutions", name: "Business Solutions Team" },
    { telegram: "tech_experts", name: "Tech Experts Agency" },
    { telegram: "growth_partners", name: "Growth Partners LLC" }
  ];

  const priceModels = ['per hour', 'subscription', 'fixed', 'unit price', 'revshare', 'custom'] as const;
  const deliveryTypes = ['physical', 'digital'] as const;

  const getServicePackages = (id: number) => {
    // Используем кастомные тиры из ALL_SERVICES, если они есть
    const baseService = ALL_SERVICES.find(s => s.id === id);
    if (baseService && baseService.customTiers) {
      return baseService.customTiers;
    }
    
    // Fallback для услуг без кастомных тиров
    const pkgs = [
      { 
        id: `basic-${id}`,
        name: 'Basic Package', 
        description: 'Essential features and basic support for getting started.',
        price: `$${299 + (id * 10)}`,
        features: [
          'Core service delivery',
          'Basic consultation',
          'Standard turnaround time',
          'Email support'
        ]
      },
      { 
        id: `pro-${id}`,
        name: 'Pro Package', 
        description: 'Advanced features with priority support and faster delivery times.',
        price: `$${599 + (id * 20)}`,
        features: [
          'Advanced service features',
          'Priority consultation',
          'Fast turnaround time',
          'Phone support',
          'Follow-up sessions'
        ]
      }
    ];
    return pkgs;
  };

  const imgIndex = ((safe.id - 1) % IMG_COUNT) + 1; // 1..11

  return {
    id: safe.id,
    title: safe.title,
    description: descriptions[safe.id % descriptions.length],
    category: safe.categories[0] ?? 'General',
    deliveries: safe.deliveries ?? 0,
    imageUrl: `/img/marketplace/jpg/${imgIndex}.jpg`,
    contact: contacts[safe.id % contacts.length],
    likes: 100 + (safe.id * 7) + (safe.deliveries * 2),
    customTiers: getServicePackages(safe.id),
  };
};

// Внутренний контекст для ServiceModalWrapper
const ServiceModalStateContext = createContext<{
  isOpen: boolean;
  serviceId: number | null;
  closeModal: () => void;
} | null>(null);

// Компонент для установки состояния
export const ServiceModalStateProvider: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  serviceId: number | null;
  closeModal: () => void;
}> = ({ children, isOpen, serviceId, closeModal }) => {
  return (
    <ServiceModalStateContext.Provider value={{ isOpen, serviceId, closeModal }}>
      {children}
    </ServiceModalStateContext.Provider>
  );
};

const ServiceModalWrapper: React.FC = () => {
  const context = useContext(ServiceModalStateContext);
  
  if (!context) {
    // Если контекст не доступен, возвращаем null
    return null;
  }
  
  const { isOpen, serviceId, closeModal } = context;
  const service = serviceId ? getFullServiceData(serviceId) : null;

  return (
    <ServiceModal
      isOpen={isOpen}
      onClose={closeModal}
      service={service}
    />
  );
};

export default ServiceModalWrapper;
