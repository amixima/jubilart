-- Migration number: 0001 	 2025-03-26T01:47:36.000Z
-- Art Community Platform Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS counters;
DROP TABLE IF EXISTS access_logs;
DROP TABLE IF EXISTS blog_tags;
DROP TABLE IF EXISTS artwork_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS verification_requests;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS collection_artworks;
DROP TABLE IF EXISTS user_collections;
DROP TABLE IF EXISTS artwork_votes;
DROP TABLE IF EXISTS artwork_ratings;
DROP TABLE IF EXISTS contest_artworks;
DROP TABLE IF EXISTS contests;
DROP TABLE IF EXISTS art_fair_participants;
DROP TABLE IF EXISTS art_fair_events;
DROP TABLE IF EXISTS exhibition_artworks;
DROP TABLE IF EXISTS exhibitions;
DROP TABLE IF EXISTS portfolio_artworks;
DROP TABLE IF EXISTS portfolios;
DROP TABLE IF EXISTS artworks;
DROP TABLE IF EXISTS art_lovers;
DROP TABLE IF EXISTS art_fairs;
DROP TABLE IF EXISTS galleries;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS notifications;

-- Create Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  profile_image TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  social_media_links TEXT, -- JSON
  user_type TEXT CHECK(user_type IN ('artist', 'gallery', 'fair', 'lover')) NOT NULL,
  is_verified INTEGER DEFAULT 0,
  verification_date DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  oauth_provider TEXT,
  oauth_id TEXT
);

-- Create Artists table
CREATE TABLE artists (
  id TEXT PRIMARY KEY,
  career_statement TEXT,
  education TEXT, -- JSON
  exhibitions TEXT, -- JSON
  awards TEXT, -- JSON
  specialization TEXT,
  medium TEXT,
  style TEXT,
  nationality TEXT,
  birth_year INTEGER,
  is_trusted INTEGER DEFAULT 0,
  trusted_since DATETIME,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Galleries table
CREATE TABLE galleries (
  id TEXT PRIMARY KEY,
  gallery_name TEXT NOT NULL,
  founding_year INTEGER,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  gallery_type TEXT,
  specialization TEXT,
  owner_name TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  gallery_images TEXT, -- JSON
  opening_hours TEXT, -- JSON
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Art Fairs table
CREATE TABLE art_fairs (
  id TEXT PRIMARY KEY,
  fair_name TEXT NOT NULL,
  organizer TEXT,
  recurring INTEGER DEFAULT 0,
  frequency TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  fair_images TEXT, -- JSON
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Art Lovers table
CREATE TABLE art_lovers (
  id TEXT PRIMARY KEY,
  interests TEXT, -- JSON
  favorite_artists TEXT, -- JSON
  favorite_styles TEXT, -- JSON
  favorite_mediums TEXT, -- JSON
  collector_status INTEGER DEFAULT 0,
  collecting_since INTEGER,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Artworks table
CREATE TABLE artworks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  year_created INTEGER,
  medium TEXT,
  style TEXT,
  subject TEXT,
  dimensions TEXT, -- JSON (height, width, depth, unit)
  dominant_color TEXT,
  price REAL,
  currency TEXT,
  is_for_sale INTEGER DEFAULT 0,
  external_sale_link TEXT,
  owner_id TEXT NOT NULL,
  owner_type TEXT CHECK(owner_type IN ('artist', 'gallery', 'fair')) NOT NULL,
  artist_id TEXT, -- If owned by gallery/fair
  images TEXT, -- JSON
  tags TEXT, -- JSON
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_published INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  location TEXT,
  material TEXT,
  edition TEXT,
  edition_number INTEGER,
  edition_size INTEGER,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL
);

-- Create Portfolios table
CREATE TABLE portfolios (
  id TEXT PRIMARY KEY,
  artist_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  is_public INTEGER DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Create Portfolio_Artworks junction table
CREATE TABLE portfolio_artworks (
  portfolio_id TEXT NOT NULL,
  artwork_id TEXT NOT NULL,
  display_order INTEGER,
  PRIMARY KEY (portfolio_id, artwork_id),
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Create Exhibitions table
CREATE TABLE exhibitions (
  id TEXT PRIMARY KEY,
  gallery_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  opening_reception_date DATETIME,
  location TEXT,
  is_virtual INTEGER DEFAULT 0,
  virtual_url TEXT,
  cover_image TEXT,
  images TEXT, -- JSON
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE CASCADE
);

-- Create Exhibition_Artworks junction table
CREATE TABLE exhibition_artworks (
  exhibition_id TEXT NOT NULL,
  artwork_id TEXT NOT NULL,
  display_order INTEGER,
  PRIMARY KEY (exhibition_id, artwork_id),
  FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id) ON DELETE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Create Art_Fair_Events table
CREATE TABLE art_fair_events (
  id TEXT PRIMARY KEY,
  fair_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  cover_image TEXT,
  images TEXT, -- JSON
  ticket_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fair_id) REFERENCES art_fairs(id) ON DELETE CASCADE
);

-- Create Art_Fair_Participants table
CREATE TABLE art_fair_participants (
  id TEXT PRIMARY KEY,
  fair_event_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  participant_type TEXT CHECK(participant_type IN ('artist', 'gallery')) NOT NULL,
  booth_number TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fair_event_id) REFERENCES art_fair_events(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Contests table
CREATE TABLE contests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  status TEXT CHECK(status IN ('upcoming', 'active', 'voting', 'completed')) NOT NULL,
  created_by TEXT NOT NULL,
  cover_image TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Contest_Artworks table
CREATE TABLE contest_artworks (
  id TEXT PRIMARY KEY,
  contest_id TEXT NOT NULL,
  artwork_id TEXT NOT NULL,
  votes_count INTEGER DEFAULT 0,
  average_rating REAL DEFAULT 0,
  is_winner INTEGER DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Create Artwork_Ratings table
CREATE TABLE artwork_ratings (
  id TEXT PRIMARY KEY,
  artwork_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating REAL NOT NULL CHECK(rating >= 0 AND rating <= 10),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(artwork_id, user_id),
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Artwork_Votes table
CREATE TABLE artwork_votes (
  contest_artwork_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (contest_artwork_id, user_id),
  FOREIGN KEY (contest_artwork_id) REFERENCES contest_artworks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create User_Collections table
CREATE TABLE user_collections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_public INTEGER DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Collection_Artworks junction table
CREATE TABLE collection_artworks (
  collection_id TEXT NOT NULL,
  artwork_id TEXT NOT NULL,
  added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  PRIMARY KEY (collection_id, artwork_id),
  FOREIGN KEY (collection_id) REFERENCES user_collections(id) ON DELETE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Create Follows table
CREATE TABLE follows (
  follower_id TEXT NOT NULL,
  followed_id TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, followed_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Likes table
CREATE TABLE likes (
  user_id TEXT NOT NULL,
  artwork_id TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, artwork_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Create Comments table
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  artwork_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Create Verification_Requests table
CREATE TABLE verification_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) NOT NULL DEFAULT 'pending',
  request_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  response_date DATETIME,
  documents TEXT, -- JSON
  notes TEXT,
  admin_notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Blog_Posts table
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  status TEXT CHECK(status IN ('draft', 'published')) NOT NULL DEFAULT 'draft',
  published_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Tags table
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Artwork_Tags junction table
CREATE TABLE artwork_tags (
  artwork_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (artwork_id, tag_id),
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create Blog_Tags junction table
CREATE TABLE blog_tags (
  blog_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (blog_id, tag_id),
  FOREIGN KEY (blog_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create Notifications table
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  related_id TEXT,
  related_type TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create system tables for platform functionality
CREATE TABLE counters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  path TEXT,
  accessed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for optimized queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_artworks_owner_id ON artworks(owner_id);
CREATE INDEX idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX idx_portfolios_artist_id ON portfolios(artist_id);
CREATE INDEX idx_exhibitions_gallery_id ON exhibitions(gallery_id);
CREATE INDEX idx_art_fair_events_fair_id ON art_fair_events(fair_id);
CREATE INDEX idx_contest_artworks_contest_id ON contest_artworks(contest_id);
CREATE INDEX idx_artwork_ratings_artwork_id ON artwork_ratings(artwork_id);
CREATE INDEX idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_followed_id ON follows(followed_id);
CREATE INDEX idx_likes_artwork_id ON likes(artwork_id);
CREATE INDEX idx_comments_artwork_id ON comments(artwork_id);
CREATE INDEX idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);
CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at);
CREATE INDEX idx_counters_name ON counters(name);

-- Initial data
INSERT INTO counters (name, value) VALUES 
  ('page_views', 0),
  ('api_calls', 0),
  ('total_artworks', 0),
  ('total_users', 0),
  ('total_contests', 0);
