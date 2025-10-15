import { useState } from 'react';
import Link from 'next/link'; // Import Link
import { useAuthStore } from '../stores/useAuthStore';

export default function RecipeCard({ recipe }) {
  const token = useAuthStore((state) => state.token);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    // Prevent the link from navigating when the button is clicked
    e.preventDefault(); 
    setError('');
    // ... (rest of the handleSave function is the same)
// ...
    if (!token) {
      setError("You must be logged in to save recipes.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId: recipe.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save recipe.');
      }
      
      setIsSaved(true);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <Link href={`/recipe/${recipe.id}`} className="group block rounded-xl overflow-hidden border border-white/10 bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-gray-900/40 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ring-1 ring-inset ${
            recipe.difficulty === 'Easy' ? 'bg-green-500/20 text-green-200 ring-green-400/30' :
            recipe.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-200 ring-yellow-400/30' :
            'bg-red-500/20 text-red-200 ring-red-400/30'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-2">{recipe.name}</h3>
          <span className="shrink-0 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-gray-300 bg-white/5 ring-1 ring-white/10">
            {recipe.cookingTime} min
          </span>
        </div>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{recipe.description || 'Explore ingredients, steps, and tips to cook this delicious dish.'}</p>
        {token && (
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`w-full h-10 px-4 rounded-md font-semibold transition-colors z-10 relative ${
              isSaved
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isSaved ? 'Saved!' : 'Save to Cookbook'}
          </button>
        )}
        {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
      </div>
    </Link>
  );
}

    

