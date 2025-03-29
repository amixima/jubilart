'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Filter, Search, ArrowUpDown, Grid, List } from 'lucide-react';
import ArtworkCard from '@/components/artwork/ArtworkCard';

interface ArtworkGridProps {
  initialArtworks?: any[];
  showFilters?: boolean;
  showSorting?: boolean;
  showViewToggle?: boolean;
  title?: string;
}

export default function ArtworkGrid({
  initialArtworks = [],
  showFilters = true,
  showSorting = true,
  showViewToggle = true,
  title
}: ArtworkGridProps) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Mock data for filters
  const filters = {
    styles: ['Abstract', 'Realism', 'Impressionism', 'Surrealism', 'Pop Art'],
    mediums: ['Oil', 'Acrylic', 'Watercolor', 'Digital', 'Photography', 'Sculpture'],
    priceRanges: ['Under $100', '$100-$500', '$500-$1000', '$1000-$5000', 'Over $5000'],
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Multicolor']
  };
  
  // This would be replaced with actual API calls in a real implementation
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
      price: 1200,
      currency: '$',
      likes: 42,
      views: 156
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
      price: 850,
      currency: '$',
      likes: 28,
      views: 103
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
      price: 450,
      currency: '$',
      likes: 35,
      views: 89
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
      price: 300,
      currency: '$',
      likes: 19,
      views: 67
    }
  ];
  
  // Use mock data if no initial artworks provided
  useState(() => {
    if (artworks.length === 0) {
      setArtworks(mockArtworks);
    }
  });
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        {showFilters && isFilterOpen && (
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Style</h3>
              <div className="space-y-2">
                {filters.styles.map(style => (
                  <div key={style} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`style-${style}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`style-${style}`} className="ml-2 text-sm text-gray-700">
                      {style}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Medium</h3>
              <div className="space-y-2">
                {filters.mediums.map(medium => (
                  <div key={medium} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`medium-${medium}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`medium-${medium}`} className="ml-2 text-sm text-gray-700">
                      {medium}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {filters.priceRanges.map(range => (
                  <div key={range} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`price-${range}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`price-${range}`} className="ml-2 text-sm text-gray-700">
                      {range}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dominant Color</h3>
              <div className="flex flex-wrap gap-2">
                {filters.colors.map(color => (
                  <button
                    key={color}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Apply Filters
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100">
                Reset
              </button>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-2">
              {showFilters && (
                <button
                  onClick={toggleFilter}
                  className={`px-4 py-2 border rounded-md flex items-center ${
                    isFilterOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                </button>
              )}
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search artworks..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {showSorting && (
                <select className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              )}
              
              {showViewToggle && (
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list' ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Artworks grid/list */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {artworks.map(artwork => (
                <div key={artwork.id} className="flex bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="w-1/3">
                    <Link href={`/artworks/${artwork.id}`}>
                      <img 
                        src={artwork.image} 
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <Link href={`/artworks/${artwork.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200">
                          {artwork.title}
                        </h3>
                      </Link>
                      
                      <Link href={`/artists/${artwork.artist.id}`}>
                        <p className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                          {artwork.artist.name}
                        </p>
                      </Link>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        {artwork.medium && artwork.year && (
                          <span>{artwork.medium}, {artwork.year}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      {artwork.price && (
                        <div className="font-medium text-gray-900">
                          {artwork.currency || '$'}{artwork.price}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-1">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-indigo-600 text-white rounded-md">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">3</button>
              <span className="px-3 py-2 text-gray-500">...</span>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">10</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
