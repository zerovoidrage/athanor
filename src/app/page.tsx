'use client';

import CardsSceneContainer from '@/components/scenes/CardsSceneContainer';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js сцена с карточками */}
      <CardsSceneContainer />
      
      {/* Пустой экран */}
    </div>
  );
}
