"use client"
import { Navbar, Card } from '@repo/ui';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const handleCard1Click = () => {
    router.push('/customer-onboarding');
  };

  const handleVerificationClick = () => {
    router.push('/customer-verification');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Welcome to the Dashboard</h1>
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