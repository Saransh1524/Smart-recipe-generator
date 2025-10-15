import { useState, useEffect } from 'react';

export default function FilterControls({ onFilterChange }) {
  const [filters, setFilters] = useState({
    difficulty: '',
    maxCookingTime: '',
    dietary: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // This effect calls the parent component's onFilterChange function
  // whenever the local filters state changes.
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-2 sm:mb-0">
      {/* Difficulty Filter */}
      <select name="difficulty" value={filters.difficulty} onChange={handleChange} className="flex-1 h-12 px-3 bg-gray-800 text-white rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60">
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      {/* Cooking Time Filter */}
      <select name="maxCookingTime" value={filters.maxCookingTime} onChange={handleChange} className="flex-1 h-12 px-3 bg-gray-800 text-white rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60">
        <option value="">Any Cooking Time</option>
        <option value="15">15 minutes or less</option>
        <option value="30">30 minutes or less</option>
        <option value="60">1 hour or less</option>
      </select>

      {/* Dietary Filter */}
      <select name="dietary" value={filters.dietary} onChange={handleChange} className="flex-1 h-12 px-3 bg-gray-800 text-white rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60">
        <option value="">Any Diet</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Gluten-Free">Gluten-Free</option>
      </select>
    </div>
  );
}
