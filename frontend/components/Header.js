import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../stores/useAuthStore';
import AuthModal from './AuthModal';

export default function Header() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-emerald-400">
            RecipeGen
          </Link>
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Link href="/cookbook" className="font-semibold text-gray-200 hover:text-emerald-400 transition-colors">
                  My Cookbook
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </nav>
      </header>
      {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

