'use client';

import CardsSceneContainer from '@/components/scenes/CardsSceneContainer';
import ExploreAthanorBlock from '@/components/ui/ExploreAthanorBlock';

export default function Home() {
  return (
    <div id="app-viewport" className="relative w-full h-screen overflow-hidden bg-black">
      <CardsSceneContainer />
      <ExploreAthanorBlock />
    </div>
  );
}
