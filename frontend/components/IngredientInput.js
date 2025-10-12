import { useState } from 'react';

export default function IngredientInput({ onSearch }) {
  const [ingredients, setIngredients] = useState('');

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    if (ingredients.trim()) {
      onSearch(ingredients);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-12 max-w-2xl mx-auto">
      <input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Enter ingredients (e.g., chicken, tomato, basil)"
        className="flex-grow p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors"
      >
        Find Recipes
      </button>
    </form>
  );
}