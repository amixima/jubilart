'use client';

import { useState } from 'react';
import { UserPlus, UserMinus, Users, Bell, BellOff } from 'lucide-react';
import Link from 'next/link';

interface FollowButtonProps {
  userId: string;
  userType: 'artist' | 'gallery' | 'fair' | 'lover';
  initialIsFollowing?: boolean;
  initialFollowersCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showNotification?: boolean;
  onFollow?: (userId: string, isFollowing: boolean) => Promise<void>;
  onToggleNotification?: (userId: string, isNotified: boolean) => Promise<void>;
}

export default function FollowButton({
  userId,
  userType,
  initialIsFollowing = false,
  initialFollowersCount = 0,
  size = 'md',
  showCount = false,
  showNotification = false,
  onFollow,
  onToggleNotification
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isNotified, setIsNotified] = useState(true);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFollow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const newIsFollowing = !isFollowing;
      setIsFollowing(newIsFollowing);
      setFollowersCount(prev => newIsFollowing ? prev + 1 : prev - 1);
      
      if (onFollow) {
        await onFollow(userId, newIsFollowing);
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(!isFollowing);
      setFollowersCount(prev => isFollowing ? prev + 1 : prev - 1);
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleNotification = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const newIsNotified = !isNotified;
      setIsNotified(newIsNotified);
      
      if (onToggleNotification) {
        await onToggleNotification(userId, newIsNotified);
      }
    } catch (error) {
      // Revert on error
      setIsNotified(!isNotified);
      console.error('Error toggling notification:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getButtonClasses = () => {
    const baseClasses = "flex items-center justify-center font-medium rounded-md transition-colors duration-200";
    const sizeClasses = {
      sm: "px-3 py-1 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-2.5 text-base"
    };
    
    if (isFollowing) {
      return `${baseClasses} ${sizeClasses[size]} border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-red-600 hover:border-red-200`;
    } else {
      return `${baseClasses} ${sizeClasses[size]} bg-indigo-600 text-white hover:bg-indigo-700`;
    }
  };
  
  const getButtonContent = () => {
    const icon = isFollowing ? 
      <UserMinus size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="mr-1.5" /> : 
      <UserPlus size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="mr-1.5" />;
    
    if (isFollowing) {
      return (
        <>
          {icon}
          <span className="group-hover:hidden">Following</span>
          <span className="hidden group-hover:inline">Unfollow</span>
        </>
      );
    } else {
      return (
        <>
          {icon}
          <span>Follow</span>
        </>
      );
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`group ${getButtonClasses()} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          getButtonContent()
        )}
      </button>
      
      {showCount && (
        <Link 
          href={`/users/${userId}/followers`}
          className="text-sm text-gray-500 hover:text-indigo-600 flex items-center"
        >
          <Users size={14} className="mr-1" />
          <span>{followersCount}</span>
        </Link>
      )}
      
      {showNotification && isFollowing && (
        <button
          onClick={handleToggleNotification}
          className="p-2 text-gray-500 hover:text-indigo-600 rounded-full"
          title={isNotified ? "Turn off notifications" : "Turn on notifications"}
        >
          {isNotified ? <Bell size={16} /> : <BellOff size={16} />}
        </button>
      )}
    </div>
  );
}
