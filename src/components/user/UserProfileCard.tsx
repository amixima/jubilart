'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Globe, Calendar, Mail, Phone, ExternalLink, Award, Check } from 'lucide-react';

interface UserProfileCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    website?: string;
    email?: string;
    phone?: string;
    isVerified?: boolean;
    userType: 'artist' | 'gallery' | 'fair' | 'lover';
    // Artist specific
    specialization?: string;
    medium?: string;
    style?: string;
    nationality?: string;
    // Gallery specific
    galleryName?: string;
    address?: string;
    openingHours?: string;
    // Art fair specific
    fairName?: string;
    nextEventDate?: string;
    // Stats
    followersCount?: number;
    followingCount?: number;
    artworksCount?: number;
  };
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
}

export default function UserProfileCard({ 
  user, 
  isCurrentUser = false,
  isFollowing = false,
  onFollow
}: UserProfileCardProps) {
  const [following, setFollowing] = useState(isFollowing);
  
  const handleFollow = () => {
    setFollowing(!following);
    if (onFollow) {
      onFollow();
    }
    // In a real implementation, this would call an API
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
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      {/* Cover image */}
      <div className="relative h-48 bg-gray-200">
        {user.coverImage ? (
          <img 
            src={user.coverImage} 
            alt={`${user.name}'s cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        )}
      </div>
      
      {/* Profile info */}
      <div className="px-6 pt-0 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4 sm:mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <span className="text-4xl font-bold">{user.name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 sm:mt-0 sm:ml-4 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  {user.name}
                  {user.isVerified && (
                    <span className="ml-2 bg-blue-500 text-white p-1 rounded-full">
                      <Check size={14} />
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-sm text-gray-500">{getUserTypeLabel(user.userType)}</p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                {isCurrentUser ? (
                  <Link 
                    href="/profile/edit" 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Edit Profile
                  </Link>
                ) : (
                  <button 
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-md font-medium ${
                      following 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bio */}
        {user.bio && (
          <div className="mb-6">
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}
        
        {/* User details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {user.location && (
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2 text-gray-400" />
              <span>{user.location}</span>
            </div>
          )}
          
          {user.website && (
            <div className="flex items-center text-gray-600">
              <Globe size={16} className="mr-2 text-gray-400" />
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {user.email && (
            <div className="flex items-center text-gray-600">
              <Mail size={16} className="mr-2 text-gray-400" />
              <a href={`mailto:${user.email}`} className="hover:text-indigo-600">
                {user.email}
              </a>
            </div>
          )}
          
          {user.phone && (
            <div className="flex items-center text-gray-600">
              <Phone size={16} className="mr-2 text-gray-400" />
              <a href={`tel:${user.phone}`} className="hover:text-indigo-600">
                {user.phone}
              </a>
            </div>
          )}
          
          {/* User type specific details */}
          {user.userType === 'artist' && user.specialization && (
            <div className="flex items-center text-gray-600">
              <Award size={16} className="mr-2 text-gray-400" />
              <span>{user.specialization}</span>
            </div>
          )}
          
          {user.userType === 'gallery' && user.openingHours && (
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2 text-gray-400" />
              <span>{user.openingHours}</span>
            </div>
          )}
          
          {user.userType === 'fair' && user.nextEventDate && (
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2 text-gray-400" />
              <span>Next event: {user.nextEventDate}</span>
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex border-t border-gray-200 pt-6">
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-gray-900">{user.artworksCount || 0}</div>
            <div className="text-sm text-gray-500">Artworks</div>
          </div>
          <div className="flex-1 text-center border-l border-r border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{user.followersCount || 0}</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-gray-900">{user.followingCount || 0}</div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
}
