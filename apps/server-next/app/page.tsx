'use client';

import { LoginSignup } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Welcome to LMNO Bank
        </h1>
        <LoginSignup setIsLoggedIn={handleAuthSuccess}/>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      </div>
    </div>
  );
}