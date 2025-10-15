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
      <header className="bg-gray-950/70 backdrop-blur supports-[backdrop-filter]:bg-gray-950/50 sticky top-0 z-40 border-b border-white/10">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 shadow ring-1 ring-white/10" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">RecipeGen</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-md hover:bg-white/5">
              Discover
            </Link>
            <Link href="/cookbook" className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-md hover:bg-white/5">
              My Cookbook
            </Link>
            {token ? (
              <button
                onClick={logout}
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
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

