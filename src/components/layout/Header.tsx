'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  LogIn, 
  LogOut, 
  PlusCircle,
  Image as ImageIcon,
  Award,
  Heart
} from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ArtLovers
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/artworks" className="text-gray-600 hover:text-gray-900">
              Artworks
            </Link>
            <Link href="/artists" className="text-gray-600 hover:text-gray-900">
              Artists
            </Link>
            <Link href="/galleries" className="text-gray-600 hover:text-gray-900">
              Galleries
            </Link>
            <Link href="/fairs" className="text-gray-600 hover:text-gray-900">
              Art Fairs
            </Link>
            <Link href="/contests" className="text-gray-600 hover:text-gray-900">
              Contests
            </Link>
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button 
              onClick={toggleSearch}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            {/* User menu or login */}
            {session ? (
              <div className="relative">
                <button 
                  onClick={toggleMenu}
                  className="flex items-center space-x-2 p-2 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User size={20} />
                  )}
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Signed in as <span className="font-medium">{session.user.name}</span>
                    </div>
                    
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    
                    {session.user.userType === 'artist' && (
                      <>
                        <Link href="/artworks/new" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <PlusCircle size={16} className="mr-2" />
                          Add Artwork
                        </Link>
                        <Link href="/portfolio" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <ImageIcon size={16} className="mr-2" />
                          Your Portfolio
                        </Link>
                      </>
                    )}
                    
                    {session.user.userType === 'gallery' && (
                      <>
                        <Link href="/exhibitions/new" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <PlusCircle size={16} className="mr-2" />
                          Add Exhibition
                        </Link>
                      </>
                    )}
                    
                    {session.user.userType === 'fair' && (
                      <>
                        <Link href="/events/new" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <PlusCircle size={16} className="mr-2" />
                          Add Event
                        </Link>
                      </>
                    )}
                    
                    {session.user.userType === 'lover' && (
                      <>
                        <Link href="/collections" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Heart size={16} className="mr-2" />
                          Your Collections
                        </Link>
                      </>
                    )}
                    
                    <Link href="/contests" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Award size={16} className="mr-2" />
                      Contests
                    </Link>
                    
                    <button 
                      onClick={() => signOut()}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => signIn()}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <LogIn size={16} className="mr-2" />
                  Sign In
                </button>
                <Link 
                  href="/auth/register"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-2 border-t">
            <Link href="/artworks" className="block py-2 text-gray-600 hover:text-gray-900">
              Artworks
            </Link>
            <Link href="/artists" className="block py-2 text-gray-600 hover:text-gray-900">
              Artists
            </Link>
            <Link href="/galleries" className="block py-2 text-gray-600 hover:text-gray-900">
              Galleries
            </Link>
            <Link href="/fairs" className="block py-2 text-gray-600 hover:text-gray-900">
              Art Fairs
            </Link>
            <Link href="/contests" className="block py-2 text-gray-600 hover:text-gray-900">
              Contests
            </Link>
            
            {!session && (
              <>
                <div className="border-t my-2"></div>
                <button 
                  onClick={() => signIn()}
                  className="flex items-center py-2 text-gray-600 hover:text-gray-900"
                >
                  <LogIn size={16} className="mr-2" />
                  Sign In
                </button>
                <Link 
                  href="/auth/register"
                  className="flex items-center py-2 text-gray-600 hover:text-gray-900"
                >
                  <User size={16} className="mr-2" />
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
        
        {/* Search bar */}
        {isSearchOpen && (
          <div className="mt-4 py-2 border-t">
            <form className="flex items-center">
              <input
                type="text"
                placeholder="Search by artist, gallery, style, theme, tag, etc."
                className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
