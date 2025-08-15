'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThreeJSCardModal } from '@/contexts/ThreeJSCardModalContext';
import InteractiveThreeJSCard from './InteractiveThreeJSCard';
import SecondaryButtonReverse from './ui/SecondaryButtonReverse';
import Spinner from './ui/Spinner';

const ThreeJSCardModal: React.FC = () => {
  const { isThreeJSCardModalOpen, closeThreeJSCardModal } = useThreeJSCardModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isThreeJSCardModalOpen) {
      setIsLoading(true);
      setShowContent(false);
      
      // Показываем прелоадер на секунду
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setShowContent(false);
    }
  }, [isThreeJSCardModalOpen]);

  return (
    <AnimatePresence>
      {isThreeJSCardModalOpen && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
        >
          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-black flex items-center justify-center"
              >
                <Spinner size="lg" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Overlay */}
          <AnimatePresence>
            {showContent && (
                              <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: 'radial-gradient(97% 100% at 100% 50%, #F9E3B0 13.03%, #FFC4AB 41.67%, #ECB4D0 87.06%)'
                }}
              >
                {/* Close Button */}
                <div className="absolute top-6 right-6 z-10">
                  <SecondaryButtonReverse onClick={closeThreeJSCardModal}>
                    Close card room
                  </SecondaryButtonReverse>
                </div>

                {/* Three.js Card Container */}
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="w-full max-w-2xl h-full max-h-2xl">
                    <InteractiveThreeJSCard width="100%" height="100%" />
                  </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-6 left-6 z-10">
                  <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                    Drag to rotate • Touch to interact
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThreeJSCardModal;
