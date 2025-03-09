// src/components/Card.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Card = ({ title, description, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-2xl font-bold mb-2 text-blue-600">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default Card;