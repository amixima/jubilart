'use client';

import { useState } from 'react';
import { Bookmark, FolderPlus, Grid, List, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import ArtworkCard from '@/components/artwork/ArtworkCard';

interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  artworkCount: number;
  isPublic: boolean;
}

interface ArtworkCollection {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
  };
  image: string;
  medium?: string;
  year?: number;
  collectionIds: string[];
}

interface CollectionsManagerProps {
  userId: string;
  initialCollections?: Collection[];
  initialArtworks?: ArtworkCollection[];
  onCreateCollection?: (data: { name: string; description: string; isPublic: boolean }) => Promise<void>;
  onAddToCollection?: (artworkId: string, collectionId: string) => Promise<void>;
  onRemoveFromCollection?: (artworkId: string, collectionId: string) => Promise<void>;
}

export default function CollectionsManager({
  userId,
  initialCollections = [],
  initialArtworks = [],
  onCreateCollection,
  onAddToCollection,
  onRemoveFromCollection
}: CollectionsManagerProps) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [savedArtworks, setSavedArtworks] = useState<ArtworkCollection[]>(initialArtworks);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true
  });
  
  // Mock data for demonstration
  const mockCollections: Collection[] = [
    {
      id: 'all',
      name: 'All Saved Artworks',
      artworkCount: 12,
      isPublic: true
    },
    {
      id: '1',
      name: 'Favorites',
      description: 'My absolute favorite artworks',
      coverImage: '/images/collection1.jpg',
      artworkCount: 8,
      isPublic: true
    },
    {
      id: '2',
      name: 'Inspiration',
      description: 'Artworks that inspire my own work',
      coverImage: '/images/collection2.jpg',
      artworkCount: 5,
      isPublic: false
    },
    {
      id: '3',
      name: 'To Purchase',
      description: 'Artworks I\'m considering buying',
      coverImage: '/images/collection3.jpg',
      artworkCount: 3,
      isPublic: false
    }
  ];
  
  const mockArtworks: ArtworkCollection[] = [
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
      collectionIds: ['1', '2']
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
      collectionIds: ['1']
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
      collectionIds: ['2', '3']
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
      collectionIds: ['3']
    }
  ];
  
  // Use mock data if no initial data provided
  useState(() => {
    if (collections.length === 0) {
      setCollections(mockCollections);
    }
    if (savedArtworks.length === 0) {
      setSavedArtworks(mockArtworks);
    }
    if (!activeCollection) {
      setActiveCollection('all');
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please provide a collection name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onCreateCollection) {
        await onCreateCollection(formData);
      }
      
      // For demonstration, add to local state
      const newCollection: Collection = {
        id: `temp-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        artworkCount: 0,
        isPublic: formData.isPublic
      };
      
      setCollections(prev => [...prev, newCollection]);
      setFormData({ name: '', description: '', isPublic: true });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToCollection = async (artworkId: string, collectionId: string) => {
    setIsLoading(true);
    
    try {
      if (onAddToCollection) {
        await onAddToCollection(artworkId, collectionId);
      }
      
      // For demonstration, update local state
      setSavedArtworks(prev => 
        prev.map(artwork => 
          artwork.id === artworkId 
            ? { 
                ...artwork, 
                collectionIds: [...artwork.collectionIds, collectionId] 
              } 
            : artwork
        )
      );
      
      // Update collection count
      setCollections(prev => 
        prev.map(collection => 
          collection.id === collectionId 
            ? { ...collection, artworkCount: collection.artworkCount + 1 } 
            : collection
        )
      );
    } catch (error) {
      console.error('Error adding to collection:', error);
      alert('Failed to add artwork to collection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveFromCollection = async (artworkId: string, collectionId: string) => {
    setIsLoading(true);
    
    try {
      if (onRemoveFromCollection) {
        await onRemoveFromCollection(artworkId, collectionId);
      }
      
      // For demonstration, update local state
      setSavedArtworks(prev => 
        prev.map(artwork => 
          artwork.id === artworkId 
            ? { 
                ...artwork, 
                collectionIds: artwork.collectionIds.filter(id => id !== collectionId) 
              } 
            : artwork
        )
      );
      
      // Update collection count
      setCollections(prev => 
        prev.map(collection => 
          collection.id === collectionId 
            ? { ...collection, artworkCount: Math.max(0, collection.artworkCount - 1) } 
            : collection
        )
      );
    } catch (error) {
      console.error('Error removing from collection:', error);
      alert('Failed to remove artwork from collection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredArtworks = activeCollection === 'all' 
    ? savedArtworks 
    : savedArtworks.filter(artwork => artwork.collectionIds.includes(activeCollection));
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Collections</h2>
        
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FolderPlus size={16} className="mr-2" />
          New Collection
        </button>
      </div>
      
      {/* Create Collection Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Collection</h3>
          
          <form onSubmit={handleCreateSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Collection Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Describe this collection"
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isPublic"
                    name="isPublic"
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isPublic" className="font-medium text-gray-700">
                    Make this collection public
                  </label>
                  <p className="text-gray-500">
                    Public collections are visible to all users. Private collections are only visible to you.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Collection'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Collections Navigation */}
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {collections.map(collection => (
          <button
            key={collection.id}
            onClick={() => setActiveCollection(collection.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeCollection === collection.id
                ? 'bg-indigo-100 text-indigo-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {collection.name}
            <span className="ml-1 text-xs">({collection.artworkCount})</span>
            {!collection.isPublic && collection.id !== 'all' && (
              <span className="ml-1 text-xs text-gray-500">(Private)</span>
            )}
          </button>
        ))}
      </div>
      
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search in collection..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-2">
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
        </div>
      </div>
      
      {/* Artworks */}
      {filteredArtworks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bookmark size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No saved artworks</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeCollection === 'all' 
              ? "You haven't saved any artworks yet. Browse artworks and click the bookmark icon to save them."
              : "This collection is empty. Add artworks to this collection by clicking the bookmark icon on artwork pages."}
          </p>
          <div className="mt-6">
            <Link
              href="/artworks"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Artworks
            </Link>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredArtworks.map(artwork => (
            <div key={artwork.id} className="relative group">
              <ArtworkCard 
                artwork={artwork} 
                showActions={false}
              />
              
              {/* Collection management dropdown */}
              <div className="absolute top-2 right-2">
                <div className="dropdown">
                  <button className="p-2 bg-white/80 text-gray-700 hover:bg-indigo-500 hover:text-white rounded-full transition-colors duration-200">
                    <Bookmark size={16} className={artwork.collectionIds.length > 0 ? "fill-current" : ""} />
                  </button>
                  <div className="dropdown-menu hidden absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Add to collection
                    </div>
                    
                    {collections.filter(c => c.id !== 'all').map(collection => (
                      <div key={collection.id} className="px-3 py-1 flex items-center justify-between">
                        <span className="text-sm text-gray-700">{collection.name}</span>
                        <input
                          type="checkbox"
                          checked={artwork.collectionIds.includes(collection.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleAddToCollection(artwork.id, collection.id);
                            } else {
                              handleRemoveFromCollection(artwork.id, collection.id);
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
