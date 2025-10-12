import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export default function RecipeCard({ recipe }) {
  const token = useAuthStore((state) => state.token);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    if (!token) {
      setError("You must be logged in to save recipes.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/users/me/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the user's token for authentication
        },
        body: JSON.stringify({ recipeId: recipe.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save recipe.');
      }
      
      setIsSaved(true); // Visually confirm that the recipe is saved
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <img 
        src={recipe.image} 
        alt={recipe.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{recipe.name}</h3>
        <div className="flex justify-between items-center text-gray-400 text-sm mb-4">
          <span>{recipe.cookingTime} min</span>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            recipe.difficulty === 'Easy' ? 'bg-green-600 text-green-100' :
            recipe.difficulty === 'Medium' ? 'bg-yellow-600 text-yellow-100' :
            'bg-red-600 text-red-100'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
        
        {/* --- New Save Button Logic --- */}
        {token && (
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
              isSaved
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isSaved ? 'Saved!' : 'Save to Cookbook'}
          </button>
        )}
        {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
}