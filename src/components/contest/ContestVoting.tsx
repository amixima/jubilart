'use client';

import { useState } from 'react';
import { Search, Filter, ArrowUpDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import ArtworkCard from '@/components/artwork/ArtworkCard';
import ArtworkRating from '@/components/artwork/ArtworkRating';

interface ContestVotingProps {
  contestId: string;
  contestTitle?: string;
  contestDescription?: string;
  endDate?: string;
  onVote?: (artworkId: string, rating: number) => Promise<void>;
}

export default function ContestVoting({
  contestId,
  contestTitle = 'Weekly Art Contest',
  contestDescription = 'Vote for your favorite artworks in this week\'s contest. The artwork with the highest rating will be featured on our homepage.',
  endDate,
  onVote
}: ContestVotingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [votedArtworks, setVotedArtworks] = useState<Record<string, number>>({});
  
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
      likes: 42,
      views: 156,
      averageRating: 8.7,
      yourRating: votedArtworks['1'] || 0
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
      likes: 28,
      views: 103,
      averageRating: 7.9,
      yourRating: votedArtworks['2'] || 0
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
      likes: 35,
      views: 89,
      averageRating: 8.2,
      yourRating: votedArtworks['3'] || 0
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
      likes: 19,
      views: 67,
      averageRating: 7.5,
      yourRating: votedArtworks['4'] || 0
    }
  ];
  
  const handleRatingChange = async (artworkId: string, rating: number) => {
    setIsLoading(true);
    
    try {
      if (onVote) {
        await onVote(artworkId, rating);
      }
      
      // Update local state
      setVotedArtworks(prev => ({
        ...prev,
        [artworkId]: rating
      }));
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit your vote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getRemainingTime = (dateString?: string) => {
    if (!dateString) return '';
    
    const endTime = new Date(dateString).getTime();
    const now = new Date().getTime();
    const distance = endTime - now;
    
    if (distance < 0) return 'Contest ended';
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m remaining`;
  };
  
  return (
    <div className="space-y-8">
      {/* Contest Header */}
      <div className="bg-indigo-900 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">{contestTitle}</h1>
        <p className="text-indigo-200 mb-4">{contestDescription}</p>
        
        {endDate && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="text-sm text-indigo-200">
              Voting ends: {formatDate(endDate)}
            </div>
            <div className="mt-2 sm:mt-0 text-sm font-medium text-yellow-300">
              {getRemainingTime(endDate)}
            </div>
          </div>
        )}
      </div>
      
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search artworks..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>
      
      {/* Contest Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm font-medium">How to Vote</p>
            <p className="text-sm mt-1">
              Rate each artwork on a scale from 0 to 10. You can vote for as many artworks as you like.
              Your votes help determine the winner of this week's contest.
            </p>
          </div>
        </div>
      </div>
      
      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockArtworks.map(artwork => (
          <div key={artwork.id} className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {artwork.title}
              </h3>
              
              <p className="text-gray-600">
                {artwork.artist.name}
              </p>
              
              <div className="mt-2 text-sm text-gray-500">
                {artwork.medium}, {artwork.year}
              </div>
              
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Your Rating</span>
                  <span className="text-sm text-gray-500">
                    {artwork.yourRating > 0 ? `${artwork.yourRating.toFixed(1)}/10` : 'Not rated'}
                  </span>
                </div>
                
                <ArtworkRating
                  artworkId={artwork.id}
                  initialRating={artwork.yourRating}
                  onRatingChange={(rating) => handleRatingChange(artwork.id, rating)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Average Rating</span>
                  <span className="text-sm font-medium text-indigo-600">
                    {artwork.averageRating.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-1">
          <button 
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <button className="px-3 py-2 bg-indigo-600 text-white rounded-md">1</button>
          <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">2</button>
          <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">3</button>
          <button 
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
