'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Flag } from 'lucide-react';
import Link from 'next/link';

interface SocialActionsProps {
  artworkId: string;
  initialLikes?: number;
  initialComments?: number;
  initialIsLiked?: boolean;
  initialIsSaved?: boolean;
  onLike?: (artworkId: string, isLiked: boolean) => Promise<void>;
  onSave?: (artworkId: string, isSaved: boolean) => Promise<void>;
  onShare?: (artworkId: string) => void;
  onReport?: (artworkId: string) => void;
}

export default function SocialActions({
  artworkId,
  initialLikes = 0,
  initialComments = 0,
  initialIsLiked = false,
  initialIsSaved = false,
  onLike,
  onSave,
  onShare,
  onReport
}: SocialActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  
  const handleLike = async () => {
    if (isLikeLoading) return;
    
    setIsLikeLoading(true);
    
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      if (onLike) {
        await onLike(artworkId, newIsLiked);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
      console.error('Error toggling like:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (isSaveLoading) return;
    
    setIsSaveLoading(true);
    
    try {
      const newIsSaved = !isSaved;
      setIsSaved(newIsSaved);
      
      if (onSave) {
        await onSave(artworkId, newIsSaved);
      }
    } catch (error) {
      // Revert on error
      setIsSaved(!isSaved);
      console.error('Error toggling save:', error);
    } finally {
      setIsSaveLoading(false);
    }
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare(artworkId);
    } else {
      // Fallback share implementation
      if (navigator.share) {
        navigator.share({
          title: 'Check out this artwork',
          url: `/artworks/${artworkId}`
        }).catch(err => console.error('Error sharing:', err));
      } else {
        // Copy to clipboard fallback
        const url = `${window.location.origin}/artworks/${artworkId}`;
        navigator.clipboard.writeText(url)
          .then(() => alert('Link copied to clipboard!'))
          .catch(err => console.error('Error copying to clipboard:', err));
      }
    }
  };
  
  const handleReport = () => {
    if (onReport) {
      onReport(artworkId);
    } else {
      // Fallback report implementation
      const confirmed = confirm('Are you sure you want to report this artwork?');
      if (confirmed) {
        alert('Thank you for your report. We will review this artwork shortly.');
      }
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Main actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLikeLoading}
            className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          
          <Link
            href={`/artworks/${artworkId}#comments`}
            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-500"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm font-medium">{initialComments}</span>
          </Link>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-500"
            aria-label="Share"
          >
            <Share2 className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            disabled={isSaveLoading}
            className={`p-2 rounded-full ${isSaved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            aria-label={isSaved ? "Remove from collection" : "Save to collection"}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleReport}
            className="p-2 rounded-full text-gray-400 hover:text-red-500"
            aria-label="Report"
          >
            <Flag className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Liked by section */}
      {likesCount > 0 && (
        <div className="text-sm text-gray-500">
          Liked by <Link href="#" className="font-medium text-gray-900 hover:text-indigo-600">User123</Link>
          {likesCount > 1 && ` and ${likesCount - 1} others`}
        </div>
      )}
    </div>
  );
}
