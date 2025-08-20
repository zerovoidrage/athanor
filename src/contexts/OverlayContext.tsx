'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';

type OverlayContextType = {
  isOverlayOpen: boolean;
  setOverlayOpen: (v: boolean) => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Поддержка класса на body для CSS-эффектов
  useEffect(() => {
    const cls = 'overlay-active';
    if (isOverlayOpen) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
  }, [isOverlayOpen]);

  const value = useMemo(() => ({
    isOverlayOpen,
    setOverlayOpen: setIsOverlayOpen
  }), [isOverlayOpen]);

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider');
  return ctx;
}
