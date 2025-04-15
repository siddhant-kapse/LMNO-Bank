'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginSignupProps {
  setIsLoggedIn: (value: boolean) => void;
}

export const LoginSignup: React.FC<LoginSignupProps> = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || ['An error occurred']);
        return;
      }

      if (data.token) {
        router.push('/dashboard');
        setIsLoggedIn(true);
      }
    } catch (error) {
      setErrors(['Network error. Please try again.']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {errors.length > 0 && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errors.join(', ')}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Username</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsLogin(true)}
        >
          Sign In
        </button>
        <button
          type="submit"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};