'use client';

import React from 'react';
import CardsScene from '@/components/scenes/CardsScene';

interface CardsSceneContainerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function CardsSceneContainer({ className = "", style = {} }: CardsSceneContainerProps) {
  return (
    <div 
      className={`relative w-full h-full ${className}`}
      style={style}
    >
      <CardsScene />
    </div>
  );
}


