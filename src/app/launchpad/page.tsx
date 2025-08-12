'use client';

import { motion } from 'framer-motion';
import LaunchpadCardsSceneContainer from '@/components/scenes/LaunchpadCardsSceneContainer';

export default function Launchpad() {
  return (
    <div className="min-h-screen bg-black">
      {/* Первая сцена с 2 карточками */}
      <motion.div 
        className="h-screen relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <LaunchpadCardsSceneContainer />
      </motion.div>

      {/* Вторая сцена с 2 карточками */}
      <motion.div 
        className="h-screen relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <LaunchpadCardsSceneContainer />
      </motion.div>
    </div>
  );
} 