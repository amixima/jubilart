'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, Calendar, Users, Clock, ExternalLink, Share2 } from 'lucide-react';
import ArtworkRating from '@/components/artwork/ArtworkRating';

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'active' | 'voting' | 'completed';
    coverImage?: string;
    artworksCount?: number;
    participantsCount?: number;
    winner?: {
      id: string;
      title: string;
      artist: {
        id: string;
        name: string;
      };
      image: string;
    };
  };
}

export default function ContestCard({ contest }: ContestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'voting':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={contest.coverImage || '/images/contest-default.jpg'} 
          alt={contest.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}>
            {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <Link href={`/contests/${contest.id}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-200 mb-2">
            {contest.title}
          </h3>
        </Link>
        
        {contest.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{contest.description}</p>
        )}
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={16} className="mr-1" />
            <span>{formatDate(contest.startDate)} - {formatDate(contest.endDate)}</span>
          </div>
          
          {contest.artworksCount !== undefined && (
            <div className="flex items-center text-gray-500 text-sm">
              <Award size={16} className="mr-1" />
              <span>{contest.artworksCount} Artworks</span>
            </div>
          )}
          
          {contest.participantsCount !== undefined && (
            <div className="flex items-center text-gray-500 text-sm">
              <Users size={16} className="mr-1" />
              <span>{contest.participantsCount} Participants</span>
            </div>
          )}
        </div>
        
        {contest.status === 'completed' && contest.winner && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Winner</h4>
            <div className="flex items-center">
              <img 
                src={contest.winner.image} 
                alt={contest.winner.title}
                className="w-12 h-12 object-cover rounded-md mr-3"
              />
              <div>
                <Link href={`/artworks/${contest.winner.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                  {contest.winner.title}
                </Link>
                <Link href={`/artists/${contest.winner.artist.id}`} className="block text-sm text-gray-600 hover:text-indigo-600">
                  {contest.winner.artist.name}
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Link 
            href={`/contests/${contest.id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            {contest.status === 'voting' ? 'Vote Now' : 
             contest.status === 'active' ? 'Submit Artwork' : 
             contest.status === 'upcoming' ? 'Get Notified' : 'View Results'}
          </Link>
          
          <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
