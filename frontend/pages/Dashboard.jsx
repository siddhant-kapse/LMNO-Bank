// src/pages/Dashboard.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ setIsLoggedIn }) => {

  const navigate = useNavigate();
  const handleCard1Click = () => {
    navigate('/customer-onboarding');
  };


  const handleVerificationClick = () => {
    navigate('/customer-verification');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Welcome to the Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Customer Onbarding"
            description="This is the first card. It will link to a new page in the future."
            onClick={handleCard1Click}
          />
          <Card
            title="Account Verification"
            description="This is the second card. Click here to complete your verification."
            onClick={handleVerificationClick}
          />
          <Card
            title="Finance with AI"
            description="This is the third card. It will link to a new page in the future."
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;