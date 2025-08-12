'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ProgressLine() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Сбрасываем прогресс при смене страницы
    setProgress(0);
    setIsLoading(true);

    // Быстрая загрузка без задержки
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 400);
    }, 0); // Минимальная задержка

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-white-400 z-50">
      <div 
        className="h-full bg-onsurface-800 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 