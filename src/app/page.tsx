'use client';

import CardsSceneContainer from '@/components/scenes/CardsSceneContainer';

export default function Home() {
  return (
    <div id="app-viewport" className="relative w-full h-screen overflow-hidden bg-black">
      <CardsSceneContainer />
    </div>
  );
}
