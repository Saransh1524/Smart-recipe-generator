import { useState } from 'react';

const Star = ({ filled, onClick }) => (
  <svg
    onClick={onClick}
    className={`w-8 h-8 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-600'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function StarRating({ recipeId, onRatingSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitRating = async (value) => {
    setError('');
    setSuccess('');
    // In a real app, you'd get the token from your auth store
    const token = localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')).state.token : null;

    if (!token) {
        setError("You must be logged in to rate recipes.");
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3001/api/recipes/${recipeId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rating: value })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to submit rating.");
        }

        setRating(value);
        setSuccess("Thank you for your rating!");
        if (onRatingSubmitted) onRatingSubmitted(value);

    } catch (err) {
        setError(err.message);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-4 text-white">Rate this Recipe</h3>
        <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
            <div
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
            >
                <Star
                    filled={hoverRating >= star || rating >= star}
                    onClick={() => handleSubmitRating(star)}
                />
            </div>
            ))}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
    </div>
  );
}
