import React from 'react';

interface PrimaryButtonReverseProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'with-icon' | 'without-icon';
}

export default function PrimaryButtonReverse({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  variant = 'without-icon'
}: PrimaryButtonReverseProps) {
  const baseClasses = "flex items-center bg-black text-white px-4 py-3 rounded-lg hover:bg-black/90 transition-colors text-callout disabled:opacity-50 disabled:cursor-not-allowed";
  const gapClass = variant === 'with-icon' ? 'gap-8' : 'gap-0';
  
  return (
    <button 
      className={`${baseClasses} ${gapClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
