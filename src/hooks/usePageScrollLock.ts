'use client';

import { useLayoutEffect, useRef } from 'react';

// Глобальный счётчик, чтобы несколько модалок не конфликтовали
let LOCK_COUNT = 0;
let SAVED_Y = 0;

export function usePageScrollLock(isLocked: boolean) {
  const appliedRef = useRef(false);

  useLayoutEffect(() => {
    const scrollEl = document.scrollingElement || document.documentElement;

    const apply = () => {
      if (appliedRef.current) return;
      appliedRef.current = true;

      if (LOCK_COUNT === 0) {
        // сохраняем положение один раз при первом локе
        SAVED_Y = scrollEl.scrollTop;
        const body = document.body;
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${SAVED_Y}px`;
        body.style.width = '100%';
      }
      LOCK_COUNT += 1;
    };

    const release = () => {
      if (!appliedRef.current) return;
      appliedRef.current = false;

      LOCK_COUNT = Math.max(0, LOCK_COUNT - 1);
      if (LOCK_COUNT === 0) {
        const body = document.body;
        // восстановление
        body.style.overflow = '';
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        // критично: восстанавливаем скролл источнику
        scrollEl.scrollTo(0, SAVED_Y);
      }
    };

    if (isLocked) {
      apply();
      return () => release();
    } else {
      // на случай быстрого ремаута
      release();
    }
  }, [isLocked]);
}
