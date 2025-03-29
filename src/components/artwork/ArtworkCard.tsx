'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, Share2, Eye, Clock } from 'lucide-react';

interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string;
    artist: {
      id: string;
      name: string;
    };
    image: string;
    medium?: string;
    year?: number;
    price?: number;
    currency?: string;
    likes?: number;
    views?: number;
    isLiked?: boolean;
  };
  showActions?: boolean;
}

export default function ArtworkCard({ artwork, showActions = true }: ArtworkCardProps) {
  const [isLiked, setIsLiked] = useState(artwork.isLiked || false);
  const [likesCount, setLikesCount] = useState(artwork.likes || 0);
  
  const handleLike = () => {
    // In a real implementation, this would call an API
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };
  
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <Link href={`/artworks/${artwork.id}`}>
          <img 
            src={artwork.image} 
            alt={artwork.title}
            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {showActions && (
          <div className="absolute top-0 right-0 p-2 flex space-x-1">
            <button 
              onClick={handleLike}
              className={`p-2 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700'} hover:bg-red-500 hover:text-white transition-colors duration-200`}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <Heart size={16} className={isLiked ? 'fill-white' : ''} />
            </button>
            <button 
              className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-indigo-500 hover:text-white transition-colors duration-200"
              aria-label="Share"
            >
              <Share2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link href={`/artworks/${artwork.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
            {artwork.title}
          </h3>
        </Link>
        
        <Link href={`/artists/${artwork.artist.id}`}>
          <p className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
            {artwork.artist.name}
          </p>
        </Link>
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-500">
            {artwork.medium && artwork.year && (
              <span>{artwork.medium}, {artwork.year}</span>
            )}
          </div>
          
          {artwork.price && (
            <div className="font-medium text-gray-900">
              {artwork.currency || '$'}{artwork.price}
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Heart size={14} className="mr-1" />
                <span>{likesCount}</span>
              </div>
              
              {artwork.views !== undefined && (
                <div className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  <span>{artwork.views}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>New</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
