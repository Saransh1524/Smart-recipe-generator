    import { useState, useEffect } from 'react';
    import RecipeCard from './RecipeCard.js';

    export default function RecipeList({ ingredients, filters }) { // Add filters to props
      const [recipes, setRecipes] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        setLoading(true);

        // Use URLSearchParams to easily build the query string
        const params = new URLSearchParams();
        if (ingredients) params.append('ingredients', ingredients);
        if (filters.difficulty) params.append('difficulty', filters.difficulty);
        if (filters.maxCookingTime) params.append('maxCookingTime', filters.maxCookingTime);
        if (filters.dietary) params.append('dietary', filters.dietary);
        
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = `${base}/api/recipes?${params.toString()}`;
          
        fetch(url)
          .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
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
      }, [ingredients, filters]); // Re-run effect when ingredients OR filters change

      if (loading) {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <div className="h-48 w-full bg-white/10" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-3 w-1/2 bg-white/10 rounded" />
                  <div className="h-10 w-full bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (error) return <p className="text-center text-red-500">Error: {error}</p>;

      if (recipes.length === 0) {
        return (
          <div className="text-center mx-auto max-w-md py-10">
            <div className="h-12 w-12 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center ring-1 ring-white/10">
              <span className="text-2xl">🍳</span>
            </div>
            <p className="text-gray-300 font-medium mb-1">No recipes found</p>
            <p className="text-gray-400 text-sm">Try different ingredients or adjust your filters.</p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      );
    }
    
    
