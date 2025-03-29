'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Edit, Trash2, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    publishedAt: string;
    author: {
      id: string;
      name: string;
      username: string;
      profileImage?: string;
      userType: 'artist' | 'gallery' | 'fair' | 'lover';
    };
    isPublished: boolean;
    isOwn?: boolean;
    tags?: string[];
  };
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => Promise<void>;
  showFullContent?: boolean;
}

export default function BlogPost({
  post,
  onEdit,
  onDelete,
  showFullContent = false
}: BlogPostProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      if (onDelete) {
        await onDelete(post.id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'artist':
        return 'Artist';
      case 'gallery':
        return 'Art Gallery';
      case 'fair':
        return 'Art Fair';
      case 'lover':
        return 'Art Enthusiast';
      default:
        return 'User';
    }
  };
  
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md">
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative h-48 md:h-64 bg-gray-200">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          
          {!post.isPublished && (
            <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              Draft
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        {/* Post header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-200">
              {showFullContent ? (
                post.title
              ) : (
                <Link href={`/blog/${post.id}`}>
                  {post.title}
                </Link>
              )}
            </h2>
            
            {post.isOwn && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit && onEdit(post.id)}
                  className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                  title="Edit post"
                >
                  <Edit size={16} />
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete post"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="flex items-center text-sm">
                  {post.isPublished ? (
                    <span className="flex items-center text-green-600">
                      <Globe size={14} className="mr-1" />
                      Published
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-500">
                      <Lock size={14} className="mr-1" />
                      Draft
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            
            <Link 
              href={`/users/${post.author.id}`}
              className="flex items-center hover:text-indigo-600"
            >
              <User size={14} className="mr-1" />
              <span>{post.author.name}</span>
            </Link>
            
            <div className="flex items-center">
              <span className="text-gray-400">{getUserTypeLabel(post.author.userType)}</span>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <Link 
                key={tag} 
                href={`/blog/tags/${tag}`}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-indigo-100 hover:text-indigo-700"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Content */}
        <div className="prose max-w-none">
          {showFullContent ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className="text-gray-600 line-clamp-3">
              {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
            </p>
          )}
        </div>
        
        {/* Read more link */}
        {!showFullContent && (
          <div className="mt-4">
            <Link 
              href={`/blog/${post.id}`}
              className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
            >
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
