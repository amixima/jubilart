'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';

interface ArtworkRatingProps {
  artworkId: string;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  showSlider?: boolean;
  showStars?: boolean;
  disabled?: boolean;
}

export default function ArtworkRating({
  artworkId,
  initialRating = 0,
  onRatingChange,
  showSlider = true,
  showStars = true,
  disabled = false
}: ArtworkRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const handleRatingChange = (newRating: number) => {
    if (disabled) return;
    
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
    
    // In a real implementation, this would call an API to save the rating
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRating = parseFloat(e.target.value);
    handleRatingChange(newRating);
  };
  
  return (
    <div className="flex flex-col space-y-4">
      {showStars && (
        <div className="flex items-center justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => handleRatingChange(star * 2)}
              onMouseEnter={() => setHoveredRating(star * 2)}
              onMouseLeave={() => setHoveredRating(0)}
              className={`p-1 rounded-full transition-colors duration-200 ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              <Star
                size={24}
                className={`${
                  (hoveredRating || rating) >= star * 2
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      )}
      
      {showSlider && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <ThumbsDown size={16} className="text-gray-400" />
            <div className="text-center text-gray-700 font-medium">
              {rating.toFixed(1)} / 10
            </div>
            <ThumbsUp size={16} className="text-gray-400" />
          </div>
          
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={rating}
            onChange={handleSliderChange}
            disabled={disabled}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${rating * 10}%, #e5e7eb ${rating * 10}%, #e5e7eb 100%)`
            }}
          />
        </div>
      )}
    </div>
  );
}
