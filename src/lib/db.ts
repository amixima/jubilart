import { D1Database } from '@cloudflare/workers-types';

export interface DbContext {
  db: D1Database;
}

export async function generateUUID(): Promise<string> {
  const { v4: uuidv4 } = await import('uuid');
  return uuidv4();
}

// User related functions
export async function createUser(
  ctx: DbContext,
  userData: {
    id: string;
    email: string;
    password_hash?: string;
    username: string;
    first_name?: string;
    last_name?: string;
    profile_image?: string;
    bio?: string;
    location?: string;
    website?: string;
    social_media_links?: string;
    user_type: 'artist' | 'gallery' | 'fair' | 'lover';
    oauth_provider?: string;
    oauth_id?: string;
  }
) {
  const { db } = ctx;
  
  try {
    await db.prepare(`
      INSERT INTO users (
        id, email, password_hash, username, first_name, last_name, 
        profile_image, bio, location, website, social_media_links, 
        user_type, oauth_provider, oauth_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      userData.id,
      userData.email,
      userData.password_hash || null,
      userData.username,
      userData.first_name || null,
      userData.last_name || null,
      userData.profile_image || null,
      userData.bio || null,
      userData.location || null,
      userData.website || null,
      userData.social_media_links || null,
      userData.user_type,
      userData.oauth_provider || null,
      userData.oauth_id || null
    ).run();
    
    // Create specific user type record based on user_type
    if (userData.user_type === 'artist') {
      await db.prepare(`
        INSERT INTO artists (id) VALUES (?)
      `).bind(userData.id).run();
    } else if (userData.user_type === 'gallery') {
      await db.prepare(`
        INSERT INTO galleries (id, gallery_name) VALUES (?, ?)
      `).bind(userData.id, userData.username).run();
    } else if (userData.user_type === 'fair') {
      await db.prepare(`
        INSERT INTO art_fairs (id, fair_name) VALUES (?, ?)
      `).bind(userData.id, userData.username).run();
    } else if (userData.user_type === 'lover') {
      await db.prepare(`
        INSERT INTO art_lovers (id) VALUES (?)
      `).bind(userData.id).run();
    }
    
    // Update counter
    await db.prepare(`
      UPDATE counters SET value = value + 1 WHERE name = 'total_users'
    `).run();
    
    return { success: true, id: userData.id };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
}

export async function getUserByEmail(ctx: DbContext, email: string) {
  const { db } = ctx;
  
  try {
    const user = await db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).bind(email).first();
    
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function getUserById(ctx: DbContext, id: string) {
  const { db } = ctx;
  
  try {
    const user = await db.prepare(`
      SELECT * FROM users WHERE id = ?
    `).bind(id).first();
    
    return user;
  } catch (error) {
    console.error('Error getting user by id:', error);
    return null;
  }
}

// Artwork related functions
export async function createArtwork(
  ctx: DbContext,
  artworkData: {
    id: string;
    title: string;
    description?: string;
    year_created?: number;
    medium?: string;
    style?: string;
    subject?: string;
    dimensions?: string;
    dominant_color?: string;
    price?: number;
    currency?: string;
    is_for_sale?: boolean;
    external_sale_link?: string;
    owner_id: string;
    owner_type: 'artist' | 'gallery' | 'fair';
    artist_id?: string;
    images?: string;
    tags?: string;
    location?: string;
    material?: string;
    is_published?: boolean;
  }
) {
  const { db } = ctx;
  
  try {
    await db.prepare(`
      INSERT INTO artworks (
        id, title, description, year_created, medium, style, subject,
        dimensions, dominant_color, price, currency, is_for_sale,
        external_sale_link, owner_id, owner_type, artist_id, images,
        tags, location, material, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      artworkData.id,
      artworkData.title,
      artworkData.description || null,
      artworkData.year_created || null,
      artworkData.medium || null,
      artworkData.style || null,
      artworkData.subject || null,
      artworkData.dimensions || null,
      artworkData.dominant_color || null,
      artworkData.price || null,
      artworkData.currency || null,
      artworkData.is_for_sale ? 1 : 0,
      artworkData.external_sale_link || null,
      artworkData.owner_id,
      artworkData.owner_type,
      artworkData.artist_id || null,
      artworkData.images || null,
      artworkData.tags || null,
      artworkData.location || null,
      artworkData.material || null,
      artworkData.is_published ? 1 : 0
    ).run();
    
    // Update counter
    await db.prepare(`
      UPDATE counters SET value = value + 1 WHERE name = 'total_artworks'
    `).run();
    
    return { success: true, id: artworkData.id };
  } catch (error) {
    console.error('Error creating artwork:', error);
    return { success: false, error };
  }
}

export async function getArtworkById(ctx: DbContext, id: string) {
  const { db } = ctx;
  
  try {
    const artwork = await db.prepare(`
      SELECT * FROM artworks WHERE id = ?
    `).bind(id).first();
    
    return artwork;
  } catch (error) {
    console.error('Error getting artwork by id:', error);
    return null;
  }
}

// Contest related functions
export async function createContest(
  ctx: DbContext,
  contestData: {
    id: string;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    created_by: string;
    cover_image?: string;
  }
) {
  const { db } = ctx;
  
  try {
    await db.prepare(`
      INSERT INTO contests (
        id, title, description, start_date, end_date, status,
        created_by, cover_image, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'upcoming', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      contestData.id,
      contestData.title,
      contestData.description || null,
      contestData.start_date,
      contestData.end_date,
      contestData.created_by,
      contestData.cover_image || null
    ).run();
    
    // Update counter
    await db.prepare(`
      UPDATE counters SET value = value + 1 WHERE name = 'total_contests'
    `).run();
    
    return { success: true, id: contestData.id };
  } catch (error) {
    console.error('Error creating contest:', error);
    return { success: false, error };
  }
}

// Rating related functions
export async function rateArtwork(
  ctx: DbContext,
  ratingData: {
    id: string;
    artwork_id: string;
    user_id: string;
    rating: number;
  }
) {
  const { db } = ctx;
  
  try {
    // Check if rating already exists
    const existingRating = await db.prepare(`
      SELECT id FROM artwork_ratings WHERE artwork_id = ? AND user_id = ?
    `).bind(ratingData.artwork_id, ratingData.user_id).first();
    
    if (existingRating) {
      // Update existing rating
      await db.prepare(`
        UPDATE artwork_ratings 
        SET rating = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE artwork_id = ? AND user_id = ?
      `).bind(
        ratingData.rating,
        ratingData.artwork_id,
        ratingData.user_id
      ).run();
    } else {
      // Create new rating
      await db.prepare(`
        INSERT INTO artwork_ratings (
          id, artwork_id, user_id, rating, created_at, updated_at
        ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        ratingData.id,
        ratingData.artwork_id,
        ratingData.user_id,
        ratingData.rating
      ).run();
    }
    
    // Update artwork average rating if it's in a contest
    await db.prepare(`
      UPDATE contest_artworks
      SET average_rating = (
        SELECT AVG(rating) FROM artwork_ratings WHERE artwork_id = ?
      )
      WHERE artwork_id = ?
    `).bind(ratingData.artwork_id, ratingData.artwork_id).run();
    
    return { success: true };
  } catch (error) {
    console.error('Error rating artwork:', error);
    return { success: false, error };
  }
}

// Search and filtering functions
export async function searchArtworks(
  ctx: DbContext,
  filters: {
    keyword?: string;
    artist_id?: string;
    style?: string;
    medium?: string;
    price_min?: number;
    price_max?: number;
    year_min?: number;
    year_max?: number;
    dominant_color?: string;
    subject?: string;
    location?: string;
    material?: string;
    limit?: number;
    offset?: number;
  }
) {
  const { db } = ctx;
  const limit = filters.limit || 20;
  const offset = filters.offset || 0;
  
  try {
    let query = `
      SELECT a.*, u.username as artist_name
      FROM artworks a
      LEFT JOIN users u ON a.artist_id = u.id OR (a.owner_id = u.id AND a.owner_type = 'artist')
      WHERE a.is_published = 1
    `;
    
    const queryParams: any[] = [];
    
    if (filters.keyword) {
      query += ` AND (a.title LIKE ? OR a.description LIKE ?)`;
      queryParams.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
    }
    
    if (filters.artist_id) {
      query += ` AND (a.artist_id = ? OR (a.owner_id = ? AND a.owner_type = 'artist'))`;
      queryParams.push(filters.artist_id, filters.artist_id);
    }
    
    if (filters.style) {
      query += ` AND a.style = ?`;
      queryParams.push(filters.style);
    }
    
    if (filters.medium) {
      query += ` AND a.medium = ?`;
      queryParams.push(filters.medium);
    }
    
    if (filters.price_min !== undefined) {
      query += ` AND a.price >= ?`;
      queryParams.push(filters.price_min);
    }
    
    if (filters.price_max !== undefined) {
      query += ` AND a.price <= ?`;
      queryParams.push(filters.price_max);
    }
    
    if (filters.year_min !== undefined) {
      query += ` AND a.year_created >= ?`;
      queryParams.push(filters.year_min);
    }
    
    if (filters.year_max !== undefined) {
      query += ` AND a.year_created <= ?`;
      queryParams.push(filters.year_max);
    }
    
    if (filters.dominant_color) {
      query += ` AND a.dominant_color = ?`;
      queryParams.push(filters.dominant_color);
    }
    
    if (filters.subject) {
      query += ` AND a.subject = ?`;
      queryParams.push(filters.subject);
    }
    
    if (filters.location) {
      query += ` AND a.location = ?`;
      queryParams.push(filters.location);
    }
    
    if (filters.material) {
      query += ` AND a.material = ?`;
      queryParams.push(filters.material);
    }
    
    query += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    
    const stmt = db.prepare(query);
    const bindStmt = stmt.bind(...queryParams);
    const artworks = await bindStmt.all();
    
    return artworks.results;
  } catch (error) {
    console.error('Error searching artworks:', error);
    return [];
  }
}
