'use client';

import { ReactNode, useRef, useEffect } from 'react';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  position?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function Dropdown({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  position = 'right',
  width = 'md',
  onMouseEnter,
  onMouseLeave
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Убираем обработчик, так как управляем закрытием на уровне Header

  if (!isOpen) return null;

  // Базовые стили
  const baseStyles = "absolute top-full mt-4 rounded-md shadow-xl z-50";
  
  // Позиционирование
  const positionStyles = position === 'left' ? 'left-0 -ml-2' : 'right-0';
  
  // Ширина
  const widthStyles = {
    sm: 'w-40',
    md: 'w-48', 
    lg: 'w-56'
  };
  
  // Стили дропдауна
  const dropdownStyles = {
    container: "p-0",
    item: "block w-full text-left px-0 py-0 text-sm text-white hover:bg-onsurface-900 transition-colors rounded-md"
  };

      return (
      <div 
        ref={dropdownRef}
        className={`${baseStyles} ${positionStyles} ${widthStyles[width]} ${dropdownStyles.container} ${className}`}
        data-dropdown
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="">
          {children}
        </div>
      </div>
    );
}

// Компонент для элементов дропдауна
interface DropdownItemProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export function DropdownItem({ children, onClick, className = '' }: DropdownItemProps) {
  const itemStyles = "block w-full text-left px-2 py-2 text-subheading text-white hover:bg-onsurface-800 transition-colors rounded-md";

  return (
    <button
      className={`${itemStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
