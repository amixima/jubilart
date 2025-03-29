'use client';

import { useState } from 'react';
import { Heart, Star, Filter, Search, Shuffle } from 'lucide-react';
import Link from 'next/link';
import ArtworkRating from '@/components/artwork/ArtworkRating';

interface SimilarArtworksProps {
  artworkId: string;
  initialArtworks?: any[];
}

export default function SimilarArtworks({
  artworkId,
  initialArtworks = []
}: SimilarArtworksProps) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for demonstration
  const mockArtworks = [
    {
      id: '1',
      title: 'Abstract Harmony',
      artist: {
        id: 'artist1',
        name: 'Jane Smith'
      },
      image: '/images/artwork1.jpg',
      medium: 'Oil on Canvas',
      year: 2023,
      similarity: 92
    },
    {
      id: '2',
      title: 'Urban Landscape',
      artist: {
        id: 'artist2',
        name: 'Michael Johnson'
      },
      image: '/images/artwork2.jpg',
      medium: 'Acrylic on Canvas',
      year: 2024,
      similarity: 87
    },
    {
      id: '3',
      title: 'Serenity',
      artist: {
        id: 'artist3',
        name: 'Emma Davis'
      },
      image: '/images/artwork3.jpg',
      medium: 'Watercolor',
      year: 2023,
      similarity: 81
    },
    {
      id: '4',
      title: 'Digital Dreams',
      artist: {
        id: 'artist4',
        name: 'Alex Chen'
      },
      image: '/images/artwork4.jpg',
      medium: 'Digital Art',
      year: 2024,
      similarity: 78
    }
  ];
  
  // Use mock data if no initial artworks provided
  useState(() => {
    if (artworks.length === 0) {
      setArtworks(mockArtworks);
    }
  });
  
  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API to get new similar artworks
      // For now, we'll just shuffle the existing ones
      setArtworks([...mockArtworks].sort(() => Math.random() - 0.5));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error refreshing similar artworks:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Similar Artworks</h2>
        
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shuffle size={16} className={`mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {artworks.map(artwork => (
          <Link 
            key={artwork.id} 
            href={`/artworks/${artwork.id}`}
            className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative aspect-square">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {artwork.similarity}% match
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                {artwork.title}
              </h3>
              
              <p className="text-xs text-gray-600 line-clamp-1">
                {artwork.artist.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
