import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import RecipeCard from '../components/RecipeCard';
import Link from 'next/link';

export default function Cookbook() {
  const token = useAuthStore((state) => state.token);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch favorites.');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  // If user is not logged in
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">Please log in to view your cookbook.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white text-center pt-10"><p>Loading your cookbook...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white text-center pt-10"><p className="text-red-500">Error: {error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-emerald-400">My Cookbook</h1>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p className="mb-4">You haven&apos;t saved any recipes yet.</p>
            <Link href="/" className="text-emerald-400 font-semibold hover:underline">
              Discover Recipes
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

