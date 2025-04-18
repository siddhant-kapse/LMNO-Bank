'use client';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  setIsLoggedIn: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setIsLoggedIn }) => {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you'd call an API endpoint to invalidate the token
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="hover:underline"
          >
            Home
          </button>
          <button className="hover:underline">About</button>
          <button className="hover:underline">Contact Us</button>
          <button 
            onClick={handleLogout}
            className="hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};