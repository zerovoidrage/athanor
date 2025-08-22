'use client';

import React, { useState, useEffect } from 'react';
import { Xmark, ArrowRight } from 'iconoir-react';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExploreAthanorBlock() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // Проверяем localStorage при загрузке
  useEffect(() => {
    const isBlockClosed = localStorage.getItem('exploreAthanorBlockClosed');
    // Temporarily hide the block
    setIsVisible(false);
    setShouldShow(false);
    // if (!isBlockClosed) {
    //   setIsVisible(true);
    //   // Задержка 1.5 секунды перед показом
    //   const timer = setTimeout(() => {
    //     setShouldShow(true);
    //   }, 400);
    //   return () => clearTimeout(timer);
    // }
  }, []);

  // Очищаем localStorage при принудительном обновлении
  useEffect(() => {
    const handleBeforeUnload = () => {
      // При любом обновлении страницы очищаем localStorage
      localStorage.removeItem('exploreAthanorBlockClosed');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('exploreAthanorBlockClosed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && shouldShow && (
        <motion.div 
          className="fixed bottom-6 right-6 w-64 bg-black border border-onsurface-900 rounded-lg p-4 z-50"
          data-ui="true"
          style={{ 
            bottom: '24px',
            right: '24px',
            width: '240px',
            backgroundColor: '#000000',
            border: '1px solid #1A1A1A',
            zIndex: 50,
            transformOrigin: 'bottom right'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
            scale: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
            opacity: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
          }}
        >
          {/* Кнопка закрытия */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white-700 hover:text-white-900 transition-colors"
            style={{ top: '12px', right: '12px' }}
          >
            <Xmark className="w-4 h-4" />
          </button>



      {/* Заголовок */}
      <h3 className="text-subheading2 text-white mb-16 text-left">
        Explore Athanor
      </h3>



      {/* Описание */}
      <p className="text-subheading2 text-white-700 mb-5 leading-relaxed text-left">
      a living platform where projects, investors, and creators unite.
      </p>

      {/* Кнопка */}
      <div>
        <button 
          onClick={() => console.log('Explore Athanor clicked')}
          className="w-full inline-flex items-center text-callout justify-between gap-2 rounded-md transition-all duration-200 px-3 py-2 bg-white-900 text-black hover:bg-white-800"
        >
          <span>Explore</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
