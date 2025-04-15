'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, description, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <h2 className="text-2xl font-bold mb-2 text-blue-600">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};