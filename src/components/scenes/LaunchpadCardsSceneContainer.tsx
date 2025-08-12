'use client';

import React from 'react';
import LaunchpadCardsScene from '@/components/scenes/LaunchpadCardsScene';

interface LaunchpadCardsSceneContainerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function LaunchpadCardsSceneContainer({ className = "", style = {} }: LaunchpadCardsSceneContainerProps) {
  return (
    <div 
      className={`relative w-full h-full ${className}`}
      style={style}
    >
      <LaunchpadCardsScene />
    </div>
  );
}

