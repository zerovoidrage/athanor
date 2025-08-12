'use client';

import React from 'react';
import { useServiceModal } from '@/contexts/ServiceModalContext';
import ServiceModal from './ServiceModal';

// Функция для получения полных данных услуги (скопирована из marketplace/page.tsx)
const getFullServiceData = (serviceId: number) => {
  const allServices = [
    { id: 1, title: "Pitch Deck Review + AI Rewrite", deliveries: 45, categories: ["Fundraising"] },
    { id: 2, title: "Growth Hacking / GTM Strategy", deliveries: 32, categories: ["Growth"] },
    { id: 3, title: "Customer Acquisition Strategy", deliveries: 28, categories: ["Growth"] },
    { id: 4, title: "Web3 Legal Setup (US, Estonia, BVI)", deliveries: 15, categories: ["Legal & Compliance"] },
    { id: 5, title: "No-Code MVP Builder", deliveries: 67, categories: ["MVP Building"] },
    { id: 6, title: "Smart Contract Audit", deliveries: 23, categories: ["Infrastructure"] },
    { id: 7, title: "API Development & Integration", deliveries: 41, categories: ["Infrastructure"] },
    { id: 8, title: "Conversion Rate Optimization", deliveries: 38, categories: ["Growth"] },
    { id: 9, title: "Brand Identity & Design System", deliveries: 52, categories: ["PR & Marketing"] },
    { id: 10, title: "SEO & Content Strategy", deliveries: 44, categories: ["PR & Marketing"] },
    { id: 11, title: "Financial Modeling & Forecasting", deliveries: 19, categories: ["Fundraising"] }
  ];

  const service = allServices.find(s => s.id === serviceId);
  if (!service) return null;

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

  const getServicePackages = (serviceId: number, serviceTitle: string) => {
    const packages = [
      {
        name: "Basic",
        description: "Essential features and basic support for getting started."
      },
      {
        name: "Standard", 
        description: "Advanced features with priority support and faster delivery times."
      },
      {
        name: "Premium",
        description: "Full-featured solution with dedicated support and custom solutions."
      }
    ];

    const packageCount = (serviceId % 3) + 1;
    const selectedPackages = packages.slice(0, packageCount);
    
    return selectedPackages.map((pkg, index) => ({
      name: pkg.name,
      description: pkg.description,
      isRequired: true,
      priceModel: priceModels[(serviceId + index) % priceModels.length],
      price: `$${500 + (serviceId * 50) + (index * 500)}`,
      deliveryType: deliveryTypes[(serviceId + index) % deliveryTypes.length],
      deliveryWindow: 7 + (serviceId % 14) - (index * 2),
      advancePayment: 25 + (serviceId % 30) - (index * 5)
    }));
  };

  return {
    id: service.id,
    title: service.title,
    description: descriptions[service.id % descriptions.length],
    category: service.categories[0],
    deliveries: service.deliveries,
    imageUrl: `/img/marketplace/jpg/${service.id}.jpg`,
    contact: contacts[service.id % contacts.length],
    likes: 100 + (service.id * 7) + (service.deliveries * 2),
    tiers: getServicePackages(service.id, service.title)
  };
};

const ServiceModalWrapper: React.FC = () => {
  const { isOpen, serviceId, closeModal } = useServiceModal();
  
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
