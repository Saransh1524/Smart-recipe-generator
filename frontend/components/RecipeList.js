import { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard.js';

export default function RecipeList({ ingredients }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Build the URL. If ingredients exist, add them as a query parameter.
    const url = ingredients 
      ? `http://localhost:3001/api/recipes?ingredients=${encodeURIComponent(ingredients)}`
      : 'http://localhost:3001/api/recipes';
      
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [ingredients]); // Re-run this effect whenever the 'ingredients' prop changes

  if (loading) return <p className="text-center text-gray-400">Loading recipes...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (recipes.length === 0 && ingredients) {
    return <p className="text-center text-gray-400">No recipes found. Try different ingredients!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}