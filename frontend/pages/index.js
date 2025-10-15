import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore'; // Import auth store
import RecipeList from '../components/RecipeList.js';
import IngredientInput from '../components/IngredientInput.js';
import FilterControls from '../components/FilterControls.js';
import RecipeSuggestions from '../components/RecipeSuggestions.js'; // Import the new component

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    maxCookingTime: '',
    dietary: ''
  });
  const token = useAuthStore((state) => state.token); // Get token

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </div>

      <main className="container mx-auto px-4 py-10">
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-4">
            <span>AI-Powered</span>
            <span className="text-emerald-400">•</span>
            <span>Smart Recipe Generator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
            Cook Smarter with Your Ingredients
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Instantly discover chef-level recipes based on what you already have. Fine-tune by difficulty, time, and diet.
          </p>
        </section>

        <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-gray-900/40 p-4 sm:p-6 shadow-lg shadow-emerald-500/5">
          <IngredientInput onSearch={setSearchQuery} />
          <FilterControls onFilterChange={setFilters} />
        </div>

        {token && (
          <div className="mt-14">
            <RecipeSuggestions />
          </div>
        )}

        <div className="mt-16 mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Discover All Recipes</h2>
          <div className="hidden sm:block h-px flex-1 ml-6 bg-gradient-to-r from-emerald-500/40 to-transparent" />
        </div>
        <RecipeList ingredients={searchQuery} filters={filters} />
      </main>
    </div>
  );
}

