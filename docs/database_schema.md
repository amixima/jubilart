# Art Community Platform Database Schema

## Overview

This document outlines the database schema for the Art Community Platform, a website similar to Artsy.net that connects artists, art galleries, art fairs, and art enthusiasts. The platform includes features for artwork management, user profiles, contests, ratings, and verification systems.

## User Types

The platform supports four main user types:

1. Artists
2. Art Galleries
3. Art Fairs
4. Art Lovers (general users)

## Database Tables

### 1. Users

Base table for all user types with common fields.

```
Table: users
- id: UUID (Primary Key)
- email: VARCHAR(255) (Unique)
- password_hash: VARCHAR(255)
- username: VARCHAR(50) (Unique)
- first_name: VARCHAR(100)
- last_name: VARCHAR(100)
- profile_image: VARCHAR(255)
- bio: TEXT
- location: VARCHAR(255)
- website: VARCHAR(255)
- social_media_links: JSONB
- user_type: ENUM('artist', 'gallery', 'fair', 'lover')
- is_verified: BOOLEAN (default: false)
- verification_date: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- last_login: TIMESTAMP
- oauth_provider: VARCHAR(50)
- oauth_id: VARCHAR(255)
```

### 2. Artists

Extended information for artist user type.

```
Table: artists
- id: UUID (Primary Key, Foreign Key to users.id)
- career_statement: TEXT
- education: JSONB
- exhibitions: JSONB
- awards: JSONB
- specialization: VARCHAR(255)
- medium: VARCHAR(255)
- style: VARCHAR(255)
- nationality: VARCHAR(100)
- birth_year: INTEGER
- is_trusted: BOOLEAN (default: false)
- trusted_since: TIMESTAMP
```

### 3. Art Galleries

Extended information for gallery user type.

```
Table: galleries
- id: UUID (Primary Key, Foreign Key to users.id)
- gallery_name: VARCHAR(255)
- founding_year: INTEGER
- address: TEXT
- city: VARCHAR(100)
- country: VARCHAR(100)
- postal_code: VARCHAR(20)
- phone: VARCHAR(50)
- gallery_type: VARCHAR(100)
- specialization: VARCHAR(255)
- owner_name: VARCHAR(255)
- contact_person: VARCHAR(255)
- contact_email: VARCHAR(255)
- contact_phone: VARCHAR(50)
- gallery_images: JSONB
- opening_hours: JSONB
```

### 4. Art Fairs

Extended information for art fair user type.

```
Table: art_fairs
- id: UUID (Primary Key, Foreign Key to users.id)
- fair_name: VARCHAR(255)
- organizer: VARCHAR(255)
- recurring: BOOLEAN
- frequency: VARCHAR(50)
- address: TEXT
- city: VARCHAR(100)
- country: VARCHAR(100)
- postal_code: VARCHAR(20)
- phone: VARCHAR(50)
- contact_person: VARCHAR(255)
- contact_email: VARCHAR(255)
- contact_phone: VARCHAR(50)
- fair_images: JSONB
```

### 5. Art Lovers

Extended information for art lover user type.

```
Table: art_lovers
- id: UUID (Primary Key, Foreign Key to users.id)
- interests: JSONB
- favorite_artists: JSONB
- favorite_styles: JSONB
- favorite_mediums: JSONB
- collector_status: BOOLEAN
- collecting_since: INTEGER
```

### 6. Artworks

Information about artworks uploaded to the platform.

```
Table: artworks
- id: UUID (Primary Key)
- title: VARCHAR(255)
- description: TEXT
- year_created: INTEGER
- medium: VARCHAR(255)
- style: VARCHAR(255)
- subject: VARCHAR(255)
- dimensions: JSONB (height, width, depth, unit)
- dominant_color: VARCHAR(50)
- price: DECIMAL(12,2)
- currency: VARCHAR(3)
- is_for_sale: BOOLEAN
- external_sale_link: VARCHAR(255)
- owner_id: UUID (Foreign Key to users.id)
- owner_type: ENUM('artist', 'gallery', 'fair')
- artist_id: UUID (Foreign Key to artists.id, if owned by gallery/fair)
- images: JSONB
- tags: JSONB
- views_count: INTEGER
- likes_count: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- is_published: BOOLEAN
- is_featured: BOOLEAN
- location: VARCHAR(255)
- material: VARCHAR(255)
- edition: VARCHAR(100)
- edition_number: INTEGER
- edition_size: INTEGER
```

### 7. Portfolios

Collections of artworks organized by artists.

```
Table: portfolios
- id: UUID (Primary Key)
- artist_id: UUID (Foreign Key to artists.id)
- title: VARCHAR(255)
- description: TEXT
- cover_image: VARCHAR(255)
- is_public: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 8. Portfolio_Artworks

Junction table for portfolios and artworks.

```
Table: portfolio_artworks
- portfolio_id: UUID (Foreign Key to portfolios.id)
- artwork_id: UUID (Foreign Key to artworks.id)
- display_order: INTEGER
- PRIMARY KEY (portfolio_id, artwork_id)
```

### 9. Exhibitions

Information about exhibitions organized by galleries.

```
Table: exhibitions
- id: UUID (Primary Key)
- gallery_id: UUID (Foreign Key to galleries.id)
- title: VARCHAR(255)
- description: TEXT
- start_date: DATE
- end_date: DATE
- opening_reception_date: TIMESTAMP
- location: VARCHAR(255)
- is_virtual: BOOLEAN
- virtual_url: VARCHAR(255)
- cover_image: VARCHAR(255)
- images: JSONB
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 10. Exhibition_Artworks

Junction table for exhibitions and artworks.

```
Table: exhibition_artworks
- exhibition_id: UUID (Foreign Key to exhibitions.id)
- artwork_id: UUID (Foreign Key to artworks.id)
- display_order: INTEGER
- PRIMARY KEY (exhibition_id, artwork_id)
```

### 11. Art_Fair_Events

Information about art fair events.

```
Table: art_fair_events
- id: UUID (Primary Key)
- fair_id: UUID (Foreign Key to art_fairs.id)
- title: VARCHAR(255)
- description: TEXT
- start_date: DATE
- end_date: DATE
- location: VARCHAR(255)
- address: TEXT
- city: VARCHAR(100)
- country: VARCHAR(100)
- postal_code: VARCHAR(20)
- cover_image: VARCHAR(255)
- images: JSONB
- ticket_url: VARCHAR(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 12. Art_Fair_Participants

Galleries or artists participating in art fairs.

```
Table: art_fair_participants
- id: UUID (Primary Key)
- fair_event_id: UUID (Foreign Key to art_fair_events.id)
- participant_id: UUID (Foreign Key to users.id)
- participant_type: ENUM('artist', 'gallery')
- booth_number: VARCHAR(50)
- created_at: TIMESTAMP
```

### 13. Contests

Weekly best artwork contests.

```
Table: contests
- id: UUID (Primary Key)
- title: VARCHAR(255)
- description: TEXT
- start_date: TIMESTAMP
- end_date: TIMESTAMP
- status: ENUM('upcoming', 'active', 'voting', 'completed')
- created_by: UUID (Foreign Key to users.id)
- cover_image: VARCHAR(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 14. Contest_Artworks

Artworks selected for contests.

```
Table: contest_artworks
- id: UUID (Primary Key)
- contest_id: UUID (Foreign Key to contests.id)
- artwork_id: UUID (Foreign Key to artworks.id)
- votes_count: INTEGER
- average_rating: DECIMAL(3,2)
- is_winner: BOOLEAN
- created_at: TIMESTAMP
```

### 15. Artwork_Ratings

User ratings for artworks.

```
Table: artwork_ratings
- id: UUID (Primary Key)
- artwork_id: UUID (Foreign Key to artworks.id)
- user_id: UUID (Foreign Key to users.id)
- rating: DECIMAL(3,1) (0-10 scale)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- PRIMARY KEY (artwork_id, user_id)
```

### 16. Artwork_Votes

User votes for contest artworks.

```
Table: artwork_votes
- contest_artwork_id: UUID (Foreign Key to contest_artworks.id)
- user_id: UUID (Foreign Key to users.id)
- created_at: TIMESTAMP
- PRIMARY KEY (contest_artwork_id, user_id)
```

### 17. User_Collections

Personal collections of artworks by art lovers.

```
Table: user_collections
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users.id)
- title: VARCHAR(255)
- description: TEXT
- is_public: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 18. Collection_Artworks

Junction table for user collections and artworks.

```
Table: collection_artworks
- collection_id: UUID (Foreign Key to user_collections.id)
- artwork_id: UUID (Foreign Key to artworks.id)
- added_at: TIMESTAMP
- notes: TEXT
- PRIMARY KEY (collection_id, artwork_id)
```

### 19. Follows

User following relationships.

```
Table: follows
- follower_id: UUID (Foreign Key to users.id)
- followed_id: UUID (Foreign Key to users.id)
- created_at: TIMESTAMP
- PRIMARY KEY (follower_id, followed_id)
```

### 20. Likes

User likes for artworks.

```
Table: likes
- user_id: UUID (Foreign Key to users.id)
- artwork_id: UUID (Foreign Key to artworks.id)
- created_at: TIMESTAMP
- PRIMARY KEY (user_id, artwork_id)
```

### 21. Comments

User comments on artworks.

```
Table: comments
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users.id)
- artwork_id: UUID (Foreign Key to artworks.id)
- content: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 22. Verification_Requests

Requests for verified status.

```
Table: verification_requests
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users.id)
- status: ENUM('pending', 'approved', 'rejected')
- request_date: TIMESTAMP
- response_date: TIMESTAMP
- documents: JSONB
- notes: TEXT
- admin_notes: TEXT
```

### 23. Blog_Posts

Blog posts by artists and galleries.

```
Table: blog_posts
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users.id)
- title: VARCHAR(255)
- content: TEXT
- cover_image: VARCHAR(255)
- status: ENUM('draft', 'published')
- published_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 24. Tags

Tags for artworks and blog posts.

```
Table: tags
- id: UUID (Primary Key)
- name: VARCHAR(100) (Unique)
- category: VARCHAR(50)
- created_at: TIMESTAMP
```

### 25. Artwork_Tags

Junction table for artworks and tags.

```
Table: artwork_tags
- artwork_id: UUID (Foreign Key to artworks.id)
- tag_id: UUID (Foreign Key to tags.id)
- PRIMARY KEY (artwork_id, tag_id)
```

### 26. Blog_Tags

Junction table for blog posts and tags.

```
Table: blog_tags
- blog_id: UUID (Foreign Key to blog_posts.id)
- tag_id: UUID (Foreign Key to tags.id)
- PRIMARY KEY (blog_id, tag_id)
```

### 27. Notifications

User notifications.

```
Table: notifications
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users.id)
- type: VARCHAR(50)
- content: TEXT
- is_read: BOOLEAN
- related_id: UUID
- related_type: VARCHAR(50)
- created_at: TIMESTAMP
```

## Relationships

1. Users (one) → Artists/Galleries/Art Fairs/Art Lovers (one)
2. Artists (one) → Artworks (many)
3. Galleries (one) → Exhibitions (many)
4. Art Fairs (one) → Art Fair Events (many)
5. Artists (one) → Portfolios (many)
6. Portfolios (one) → Artworks (many) through Portfolio_Artworks
7. Exhibitions (one) → Artworks (many) through Exhibition_Artworks
8. Art Fair Events (one) → Galleries/Artists (many) through Art_Fair_Participants
9. Contests (one) → Artworks (many) through Contest_Artworks
10. Users (one) → Artwork Ratings (many)
11. Users (one) → Artwork Votes (many)
12. Art Lovers (one) → User Collections (many)
13. User Collections (one) → Artworks (many) through Collection_Artworks
14. Users (one) → Follows (many)
15. Users (one) → Likes (many)
16. Users (one) → Comments (many)
17. Users (one) → Verification Requests (many)
18. Users (one) → Blog Posts (many)
19. Artworks (one) → Tags (many) through Artwork_Tags
20. Blog Posts (one) → Tags (many) through Blog_Tags
21. Users (one) → Notifications (many)

## Indexes

To optimize query performance, the following indexes should be created:

1. users(email)
2. users(username)
3. artworks(owner_id)
4. artworks(artist_id)
5. portfolios(artist_id)
6. exhibitions(gallery_id)
7. art_fair_events(fair_id)
8. contest_artworks(contest_id)
9. artwork_ratings(artwork_id, user_id)
10. artwork_votes(contest_artwork_id, user_id)
11. user_collections(user_id)
12. follows(follower_id)
13. follows(followed_id)
14. likes(artwork_id)
15. comments(artwork_id)
16. verification_requests(user_id, status)
17. blog_posts(user_id)
18. tags(name)

## Search and Filtering

To support the advanced search and filtering requirements, we'll use a combination of:

1. Database indexes for basic filtering
2. Full-text search capabilities for text-based searches
3. JSON fields for complex filtering (e.g., dimensions, materials)
4. Specialized indexes for filtering by:
   - Size
   - Price
   - Artist nationality
   - Subject
   - Style
   - Dominant color
   - Location
   - Material

## Authentication

The schema supports both email-based authentication and OAuth integration through the following fields:
- email
- password_hash
- oauth_provider
- oauth_id

## Verification System

Artists, galleries, and art fairs can request verification through the verification_requests table. Once approved, their is_verified status is updated in the users table.

## Contest System

The weekly best artwork contests are managed through:
1. contests table for contest information
2. contest_artworks table for the 128 preselected artworks
3. artwork_votes table for user voting
4. artwork_ratings table for the 0-10 rating scale

This comprehensive schema provides the foundation for all the required features of the Art Community Platform.
