import React from 'react';

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'with-icon' | 'without-icon';
  className?: string;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  onClick,
  variant = 'without-icon',
  className = '',
  disabled = false,
  icon: Icon
}) => {
  const baseClasses = "inline-flex items-center text-callout justify-center gap-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const paddingClasses = "px-3 py-2"; // Уменьшенный padding
  const colorClasses = "bg-white-900 text-black hover:bg-white-800";
  
  const buttonClasses = `${baseClasses} ${paddingClasses} ${colorClasses} ${className}`;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {variant === 'with-icon' && Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
};

export default SecondaryButton;
