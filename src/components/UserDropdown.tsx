'use client';

import { ReactNode, useRef, useEffect } from 'react';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function UserDropdown({ 
  isOpen, 
  onClose, 
  children, 
  className = ''
}: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Убираем обработчик, так как управляем закрытием на уровне Header

  if (!isOpen) return null;

  // Базовые стили
  const baseStyles = "absolute top-full mt-4 rounded-md shadow-xl z-50 right-0 w-64 -mr-2";
  
  // Стили дропдауна
  const dropdownStyles = {
    container: "p-1",
  };

  return (
    <div 
      ref={dropdownRef}
      className={`${baseStyles} ${dropdownStyles.container} ${className}`}
      data-dropdown
    >
      <div className="flex flex-col items-end">
        {children}
      </div>
    </div>
  );
}

// Компонент для элементов дропдауна пользователя
interface UserDropdownItemProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export function UserDropdownItem({ children, onClick, className = '' }: UserDropdownItemProps) {
  const itemStyles = "inline-block text-right px-2 py-2 text-subheading text-white hover:bg-onsurface-800 transition-colors rounded-md w-fit";

  return (
    <button
      className={`${itemStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
