import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'with-icon' | 'without-icon';
}

export default function PrimaryButton({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  variant = 'without-icon'
}: PrimaryButtonProps) {
  const baseClasses = "flex items-center bg-white-900 text-black px-4 py-3 rounded-lg hover:bg-white-800 transition-colors text-callout disabled:opacity-50 disabled:cursor-not-allowed";
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
