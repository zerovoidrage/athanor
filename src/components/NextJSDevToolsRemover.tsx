'use client';

import { useEffect } from 'react';

export default function NextJSDevToolsRemover() {
  useEffect(() => {
    // Функция для скрытия Next.js dev tools иконки
    const hideNextJSDevTools = () => {
      const selectors = [
        '[data-nextjs-dev-overlay]',
        '[data-nextjs-dev-indicator]',
        '[data-nextjs-build-activity]',
        '.nextjs-dev-overlay',
        '.nextjs-dev-indicator',
        '.nextjs-build-activity',
        // Дополнительные селекторы для различных версий Next.js
        '[data-nextjs-dev-indicator]',
        '[data-nextjs-dev-overlay]',
        '[data-nextjs-build-activity]',
        '.nextjs-dev-overlay',
        '.nextjs-dev-indicator',
        '.nextjs-build-activity',
        // Селекторы для новых версий
        '[data-nextjs-dev-indicator]',
        '[data-nextjs-dev-overlay]',
        '[data-nextjs-build-activity]'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
          el.remove();
        });
      });
    };

    // Запускаем сразу
    hideNextJSDevTools();
    
    // Запускаем периодически
    const interval = setInterval(hideNextJSDevTools, 1000);
    
    // Слушаем изменения DOM
    const observer = new MutationObserver(hideNextJSDevTools);
    observer.observe(document.body, { childList: true, subtree: true });

    // Очистка при размонтировании
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return null; // Компонент не рендерит ничего
}
