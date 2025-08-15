import React from 'react';

interface SecondaryButtonReverseProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const SecondaryButtonReverse: React.FC<SecondaryButtonReverseProps> = ({
  children,
  onClick,
  className = '',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg text-callout transition-all duration-200
        bg-black text-white border border-black
        hover:bg-white hover:border-white
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default SecondaryButtonReverse;
