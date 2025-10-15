import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore'; // Import auth store
import StarRating from '../../components/StarRating'; // Import the new component

// Icons for better UI
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>;
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm5 0a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm5 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" /></svg>;

export default function RecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.token); // Get token to show/hide rating

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error('Recipe not found.');
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white text-center pt-20"><p>Loading recipe...</p></div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-white text-center pt-20"><p className="text-red-500">Error: {error}</p></div>;
  if (!recipe) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-emerald-400">{recipe.name}</h1>
          <div className="flex justify-center items-center gap-6 text-gray-400">
            <span className="flex items-center"><ClockIcon /> {recipe.cookingTime} min</span>
            <span className="flex items-center"><BarChartIcon /> {recipe.difficulty}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image and Nutrition */}
          <div className="lg:col-span-1">
            <img src={recipe.image} alt={recipe.name} className="w-full rounded-lg shadow-lg mb-6" />
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-white">Nutritional Information</h3>
              <ul className="text-gray-300 space-y-2">
                <li><strong>Calories:</strong> {recipe.nutritionalInfo.calories}</li>
                <li><strong>Protein:</strong> {recipe.nutritionalInfo.protein}</li>
                <li><strong>Carbs:</strong> {recipe.nutritionalInfo.carbs}</li>
                <li><strong>Fat:</strong> {recipe.nutritionalInfo.fat}</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Ingredients, Instructions, and Rating */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-white">Ingredients</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {recipe.ingredients.map((ing, index) => <li key={index}>{ing}</li>)}
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-white">Instructions</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-3">
                {recipe.instructions.map((step, index) => <li key={index}>{step}</li>)}
              </ol>
            </div>
            
            {/* --- Add the StarRating component --- */}
            {token && <StarRating recipeId={recipe.id} />}

          </div>
        </div>
      </main>
    </div>
  );
}

