'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Xmark } from 'iconoir-react';

interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (name: string) => void;
}

export default function NameModal({ isOpen, onClose, onComplete }: NameModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setDisplayName('');
      setError('');
    }
  }, [isOpen]);

  const validateName = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      return 'Name must be at least 3 characters long';
    }
    return '';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const validationError = validateName(displayName);
      if (validationError) {
        setError(validationError);
        return;
      }
      onComplete(displayName.trim());
    }
  };

  const handleSubmit = () => {
    const validationError = validateName(displayName);
    if (validationError) {
      setError(validationError);
      return;
    }
    onComplete(displayName.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Крестик в правом верхнем углу */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
      >
        <Xmark className="w-6 h-6" />
      </button>

      {/* Центральный контент */}
      <div className="text-center">
        <input
          ref={inputRef}
          type="text"
          value={displayName}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="display name"
          className="bg-transparent border-none outline-none text-white text-5xl text-center placeholder-white-600 caret-white"
          style={{
            caretColor: 'white',
            caretShape: 'bar',
            letterSpacing: '-0.03em'
          }}
        />
        
        {/* Сообщение об ошибке */}
        {error && (
          <div className="mt-4 text-red-400 text-caption">
            {error}
          </div>
        )}
        
        {/* Подсказка */}
        <div className="absolute bottom-14 left-0 right-0 text-center">
          <p className="text-caption text-white-900">
            Press <span className="bg-white-600 pl-6 pr-2 py-1 rounded ml-2 mr-2">return</span> to continue
          </p>
        </div>
      </div>
    </div>
  );
}
