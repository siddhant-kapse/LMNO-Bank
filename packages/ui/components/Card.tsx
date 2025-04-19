'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CardProps {
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  onClick,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg transition-shadow duration-300
        ${disabled ? 'bg-gray-200 cursor-not-allowed opacity-60' : 'bg-white hover:shadow-xl cursor-pointer'}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
    >
      <h2 className={`text-2xl font-bold mb-2 ${disabled ? 'text-gray-500' : 'text-blue-600'}`}>
        {title}
      </h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};