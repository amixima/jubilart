'use client';

import { useState } from 'react';
import { Folder, Plus, Edit, Trash2, Image as ImageIcon, Move } from 'lucide-react';
import Link from 'next/link';

interface Portfolio {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  artworkCount: number;
  isPublic: boolean;
}

interface PortfolioManagerProps {
  initialPortfolios?: Portfolio[];
  onCreatePortfolio?: (data: { name: string; description: string; isPublic: boolean }) => Promise<void>;
  onDeletePortfolio?: (id: string) => Promise<void>;
  onUpdatePortfolio?: (id: string, data: { name: string; description: string; isPublic: boolean }) => Promise<void>;
}

export default function PortfolioManager({ 
  initialPortfolios = [], 
  onCreatePortfolio,
  onDeletePortfolio,
  onUpdatePortfolio
}: PortfolioManagerProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true
  });
  
  // Mock data for demonstration
  const mockPortfolios: Portfolio[] = [
    {
      id: '1',
      name: 'Abstract Works',
      description: 'Collection of my abstract paintings and digital art',
      coverImage: '/images/portfolio1.jpg',
      artworkCount: 12,
      isPublic: true
    },
    {
      id: '2',
      name: 'Landscapes',
      description: 'Nature-inspired landscape paintings',
      coverImage: '/images/portfolio2.jpg',
      artworkCount: 8,
      isPublic: true
    },
    {
      id: '3',
      name: 'Experimental',
      description: 'Works in progress and experimental techniques',
      coverImage: '/images/portfolio3.jpg',
      artworkCount: 5,
      isPublic: false
    }
  ];
  
  // Use mock data if no initial portfolios provided
  useState(() => {
    if (portfolios.length === 0) {
      setPortfolios(mockPortfolios);
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
      alert('Please provide a portfolio name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onCreatePortfolio) {
        await onCreatePortfolio(formData);
      }
      
      // For demonstration, add to local state
      const newPortfolio: Portfolio = {
        id: `temp-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        artworkCount: 0,
        isPublic: formData.isPublic
      };
      
      setPortfolios(prev => [...prev, newPortfolio]);
      setFormData({ name: '', description: '', isPublic: true });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating portfolio:', error);
      alert('Failed to create portfolio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !editingId) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onUpdatePortfolio) {
        await onUpdatePortfolio(editingId, formData);
      }
      
      // For demonstration, update local state
      setPortfolios(prev => 
        prev.map(portfolio => 
          portfolio.id === editingId 
            ? { 
                ...portfolio, 
                name: formData.name, 
                description: formData.description, 
                isPublic: formData.isPublic 
              } 
            : portfolio
        )
      );
      
      setFormData({ name: '', description: '', isPublic: true });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating portfolio:', error);
      alert('Failed to update portfolio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }
    
    try {
      if (onDeletePortfolio) {
        await onDeletePortfolio(id);
      }
      
      // For demonstration, update local state
      setPortfolios(prev => prev.filter(portfolio => portfolio.id !== id));
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Failed to delete portfolio. Please try again.');
    }
  };
  
  const startEditing = (portfolio: Portfolio) => {
    setFormData({
      name: portfolio.name,
      description: portfolio.description || '',
      isPublic: portfolio.isPublic
    });
    setEditingId(portfolio.id);
    setIsCreating(false);
  };
  
  const cancelForm = () => {
    setFormData({ name: '', description: '', isPublic: true });
    setIsCreating(false);
    setEditingId(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Portfolios</h2>
        
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={16} className="mr-2" />
            New Portfolio
          </button>
        )}
      </div>
      
      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isCreating ? 'Create New Portfolio' : 'Edit Portfolio'}
          </h3>
          
          <form onSubmit={isCreating ? handleCreateSubmit : handleEditSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Portfolio Name <span className="text-red-500">*</span>
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
                  placeholder="Describe this portfolio collection"
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
                    Make this portfolio public
                  </label>
                  <p className="text-gray-500">
                    Public portfolios are visible to all users. Private portfolios are only visible to you.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelForm}
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
                    {isCreating ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  isCreating ? 'Create Portfolio' : 'Update Portfolio'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Portfolios Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map(portfolio => (
          <div 
            key={portfolio.id} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 bg-gray-200">
              {portfolio.coverImage ? (
                <img 
                  src={portfolio.coverImage} 
                  alt={portfolio.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Folder size={48} className="text-gray-400" />
                </div>
              )}
              
              {!portfolio.isPublic && (
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Private
                </div>
              )}
            </div>
            
            <div className="p-4">
              <Link href={`/portfolios/${portfolio.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200">
                  {portfolio.name}
                </h3>
              </Link>
              
              {portfolio.description && (
                <p className="mt-1 text-gray-600 text-sm line-clamp-2">
                  {portfolio.description}
                </p>
              )}
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <ImageIcon size={16} className="mr-1" />
                <span>{portfolio.artworkCount} {portfolio.artworkCount === 1 ? 'Artwork' : 'Artworks'}</span>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Link 
                  href={`/portfolios/${portfolio.id}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View Portfolio
                </Link>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(portfolio)}
                    className="p-1 text-gray-500 hover:text-indigo-600"
                    title="Edit Portfolio"
                  >
                    <Edit size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(portfolio.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                    title="Delete Portfolio"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {portfolios.length === 0 && !isCreating && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Folder size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolios yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new portfolio to organize your artworks.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus size={16} className="mr-2" />
              New Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
