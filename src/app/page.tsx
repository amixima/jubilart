'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Filter, Search } from 'lucide-react';

// Hero section with featured artwork
const Hero = () => (
  <section className="relative bg-gray-900 text-white">
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    ></div>
    <div className="container mx-auto px-4 py-24 relative z-20">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Discover and Connect with the Art World
        </h1>
        <p className="text-xl mb-8">
          Join our community of artists, galleries, art fairs, and art enthusiasts. Share your work, discover new artists, and participate in weekly contests.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/auth/register" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium flex items-center"
          >
            Join Now <ArrowRight className="ml-2" size={18} />
          </Link>
          <Link 
            href="/artworks" 
            className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-md font-medium"
          >
            Explore Artworks
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// Featured artworks section
const FeaturedArtworks = () => {
  // This would be fetched from the API in a real implementation
  const artworks = [
    {
      id: '1',
      title: 'Abstract Harmony',
      artist: 'Jane Smith',
      image: '/images/artwork1.jpg',
      medium: 'Oil on Canvas',
      year: 2023
    },
    {
      id: '2',
      title: 'Urban Landscape',
      artist: 'Michael Johnson',
      image: '/images/artwork2.jpg',
      medium: 'Acrylic on Canvas',
      year: 2024
    },
    {
      id: '3',
      title: 'Serenity',
      artist: 'Emma Davis',
      image: '/images/artwork3.jpg',
      medium: 'Watercolor',
      year: 2023
    },
    {
      id: '4',
      title: 'Digital Dreams',
      artist: 'Alex Chen',
      image: '/images/artwork4.jpg',
      medium: 'Digital Art',
      year: 2024
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured Artworks</h2>
          <Link href="/artworks" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
            View All <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link 
                    href={`/artworks/${artwork.id}`}
                    className="px-4 py-2 bg-white text-gray-900 rounded-md font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{artwork.title}</h3>
              <p className="text-gray-600">{artwork.artist}</p>
              <p className="text-gray-500 text-sm">{artwork.medium}, {artwork.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured artists section
const FeaturedArtists = () => {
  // This would be fetched from the API in a real implementation
  const artists = [
    {
      id: '1',
      name: 'Jane Smith',
      image: '/images/artist1.jpg',
      specialty: 'Abstract Painting',
      artworks: 42
    },
    {
      id: '2',
      name: 'Michael Johnson',
      image: '/images/artist2.jpg',
      specialty: 'Urban Landscapes',
      artworks: 38
    },
    {
      id: '3',
      name: 'Emma Davis',
      image: '/images/artist3.jpg',
      specialty: 'Watercolor',
      artworks: 27
    }
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured Artists</h2>
          <Link href="/artists" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
            View All <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <Link key={artist.id} href={`/artists/${artist.id}`} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  <img 
                    src={artist.image} 
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{artist.name}</h3>
                  <p className="text-gray-600">{artist.specialty}</p>
                  <p className="text-gray-500 text-sm mt-2">{artist.artworks} Artworks</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Current contest section
const CurrentContest = () => {
  return (
    <section className="py-16 bg-indigo-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Weekly Art Contest</h2>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Vote for your favorite artworks and help select this week's winner. New contest every Monday!
          </p>
        </div>
        
        <div className="bg-indigo-800 rounded-lg p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img 
                src="/images/contest.jpg" 
                alt="Contest artwork"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Spring Inspirations</h3>
                <p className="text-indigo-200 mb-4">
                  This week's theme celebrates the arrival of spring with artworks inspired by renewal and growth.
                </p>
                <div className="flex items-center mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={20} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="ml-2 text-indigo-200">128 artworks competing</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contests/current" 
                  className="px-6 py-3 bg-white text-indigo-900 hover:bg-gray-100 rounded-md font-medium text-center"
                >
                  Vote Now
                </Link>
                <Link 
                  href="/contests" 
                  className="px-6 py-3 border border-white hover:bg-indigo-700 rounded-md font-medium text-center"
                >
                  View All Contests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Art categories section
const ArtCategories = () => {
  const categories = [
    { name: 'Paintings', count: 1245, image: '/images/category-painting.jpg' },
    { name: 'Photography', count: 876, image: '/images/category-photography.jpg' },
    { name: 'Sculptures', count: 543, image: '/images/category-sculpture.jpg' },
    { name: 'Digital Art', count: 932, image: '/images/category-digital.jpg' }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Explore by Category</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name}
              href={`/artworks?category=${category.name.toLowerCase()}`}
              className="group relative h-64 overflow-hidden rounded-lg"
            >
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
                <p className="text-gray-300">{category.count} artworks</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Join community section
const JoinCommunity = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Art Community</h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with fellow artists, galleries, and art enthusiasts. Share your work, get feedback, and participate in weekly contests.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/auth/register?type=artist" 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
            >
              Join as Artist
            </Link>
            <Link 
              href="/auth/register?type=gallery" 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
            >
              Join as Gallery
            </Link>
            <Link 
              href="/auth/register?type=fair" 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
            >
              Join as Art Fair
            </Link>
            <Link 
              href="/auth/register" 
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
            >
              Join as Art Lover
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main homepage component
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedArtworks />
      <CurrentContest />
      <FeaturedArtists />
      <ArtCategories />
      <JoinCommunity />
    </>
  );
}
