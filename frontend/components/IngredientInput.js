import { useState, useRef } from 'react';

// A simple camera icon for the upload button
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function IngredientInput({ onSearch }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'image'
  const [textIngredients, setTextIngredients] = useState('');
  
  // State for image upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleTextSearch = (e) => {
    e.preventDefault();
    if (textIngredients.trim()) {
      onSearch(textIngredients);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL for the image
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ingredients/recognize-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image.');
      }
      
      // Update the parent component with the ingredients found
      onSearch(data.ingredients.join(', '));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Tab Buttons */}
      <div className="flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/10 w-fit mx-auto mb-4">
        <button onClick={() => setActiveTab('text')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'text' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>
          Search by Text
        </button>
        <button onClick={() => setActiveTab('image')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'image' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>
          Search by Image
        </button>
      </div>

      {/* Text Input Tab */}
      {activeTab === 'text' && (
        <form onSubmit={handleTextSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={textIngredients}
              onChange={(e) => setTextIngredients(e.target.value)}
              placeholder="e.g., chicken, tomato, basil"
              className="w-full pr-12 pl-4 h-12 bg-gray-800 text-white rounded-md border border-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">⌘K</span>
          </div>
          <button type="submit" className="h-12 px-5 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors">
            Find Recipes
          </button>
        </form>
      )}

      {/* Image Input Tab */}
      {activeTab === 'image' && (
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          
          {imagePreview ? (
            <div className="mb-4">
              <img src={imagePreview} alt="Selected ingredient" className="max-h-60 mx-auto rounded-lg ring-1 ring-white/10" />
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-white/15 rounded-lg p-10 mb-4 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400/40 transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              <CameraIcon />
              <p className="text-gray-400">Click to upload an image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
          
          <button
            onClick={handleImageUpload}
            disabled={!imageFile || isLoading}
            className="w-full h-12 px-6 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors disabled:bg-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'Find Recipes from Image'}
          </button>
          
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
}
