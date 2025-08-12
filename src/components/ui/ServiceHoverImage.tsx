'use client';

import { useState, useEffect } from 'react';

interface ServiceHoverImageProps {
  isVisible: boolean;
  mouseX: number;
  mouseY: number;
  imageUrl: string;
  serviceTitle: string;
  deliveries: number;
  category: string;
}

export default function ServiceHoverImage({ isVisible, mouseX, mouseY, imageUrl, serviceTitle, deliveries, category }: ServiceHoverImageProps) {
  if (!isVisible) return null;

  return (
    <div
      className="absolute pointer-events-none z-50 transition-opacity duration-200"
      style={{
        left: mouseX + 40,
        top: mouseY - 360,
        opacity: 1
      }}
    >
      <div className="bg-white shadow-2xl overflow-hidden">
        <img
          src={imageUrl}
          alt="Service cover"
          className="w-64 h-40 object-cover"
          style={{ borderRadius: 0, objectPosition: 'center' }}
        />
        {/* Название услуги снизу */}
        <div className="px-0 py-5" style={{ paddingBottom: '20px' }}>
          <p className="text-white text-xs font-medium text-center leading-tight" style={{ fontSize: '12px' }}>
            {serviceTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
