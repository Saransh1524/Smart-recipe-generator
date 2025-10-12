import { useState } from 'react';
import RecipeList from '../components/RecipeList.js';
import IngredientInput from '../components/IngredientInput.js';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-emerald-400">
            Smart Recipe Generator
          </h1>
          <p className="text-lg text-gray-300">
            Find the perfect recipe with the ingredients you have on hand.
          </p>
        </div>
        
        <IngredientInput onSearch={setSearchQuery} />
        
        <RecipeList ingredients={searchQuery} />
      </main>
    </div>
  );
}