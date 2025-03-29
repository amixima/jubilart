'use client';

import Link from 'next/link';
import { Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold">
              ArtLovers
            </Link>
            <p className="mt-4 text-gray-400">
              Connecting artists, galleries, art fairs, and art enthusiasts in one vibrant community.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="mailto:contact@artlovers.com" className="text-gray-400 hover:text-white">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/artworks" className="text-gray-400 hover:text-white">
                  Artworks
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-gray-400 hover:text-white">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/galleries" className="text-gray-400 hover:text-white">
                  Galleries
                </Link>
              </li>
              <li>
                <Link href="/fairs" className="text-gray-400 hover:text-white">
                  Art Fairs
                </Link>
              </li>
              <li>
                <Link href="/contests" className="text-gray-400 hover:text-white">
                  Contests
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Join us */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Join Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/register?type=artist" className="text-gray-400 hover:text-white">
                  Register as Artist
                </Link>
              </li>
              <li>
                <Link href="/auth/register?type=gallery" className="text-gray-400 hover:text-white">
                  Register as Gallery
                </Link>
              </li>
              <li>
                <Link href="/auth/register?type=fair" className="text-gray-400 hover:text-white">
                  Register as Art Fair
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-400 hover:text-white">
                  Register as Art Lover
                </Link>
              </li>
              <li>
                <Link href="/verification" className="text-gray-400 hover:text-white">
                  Verification Process
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Help & Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Help & Info</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ArtLovers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
