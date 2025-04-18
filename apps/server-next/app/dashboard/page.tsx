"use client"
import { Navbar, Card } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function Dashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  const handleCard1Click = () => {
    router.push('/customer-onboarding');
  };

  const handleVerificationClick = () => {
    router.push('/customer-verification');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (res.ok && data.username) {
          setUsername(data.username);
        } else {
          router.push('/');
        }
      } catch {
        router.push('/');
      }
    };
    fetchUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 text-yellow-600">
          {username ? `Hi, ${username}` : 'Hi,'}
        </h1>
        <h2 className="text-xl font-semibold mb-8 text-gray-700">
          Welcome to the Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Customer Onboarding"
            description="Complete your customer profile"
            onClick={handleCard1Click}
          />
          <Card
            title="Account Verification"
            description="Verify your identity documents"
            onClick={handleVerificationClick}
          />
          <Card
            title="Finance with AI"
            description="Explore AI-powered financial insights"
          />
        </div>
      </div>
    </div>
  );
}