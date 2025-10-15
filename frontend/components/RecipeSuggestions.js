import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import RecipeCard from './RecipeCard';

export default function RecipeSuggestions() {
  const token = useAuthStore((state) => state.token);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/suggestions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [token]);

  if (!token || loading || suggestions.length === 0) {
    return null; // Don't render anything if not logged in, loading, or no suggestions
  }

  return (
    <div className="my-16">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {suggestions.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
