import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SocialActions } from '@/components/social/SocialActions';
import { Comments } from '@/components/social/Comments';
import { FollowButton } from '@/components/social/FollowButton';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { ArtworkRating } from '@/components/artwork/ArtworkRating';

// Mock functions
const mockOnLike = jest.fn();
const mockOnSave = jest.fn();
const mockOnFollow = jest.fn();
const mockOnAddComment = jest.fn();
const mockOnRatingChange = jest.fn();

describe('SocialActions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders like button with correct count', () => {
    render(
      <SocialActions 
        artworkId="1" 
        initialLikes={42} 
        initialComments={10} 
        onLike={mockOnLike}
      />
    );
    
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('calls onLike when like button is clicked', async () => {
    render(
      <SocialActions 
        artworkId="1" 
        initialLikes={42} 
        initialComments={10} 
        onLike={mockOnLike}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /like/i }));
    
    expect(mockOnLike).toHaveBeenCalledWith('1', true);
  });

  test('calls onSave when save button is clicked', async () => {
    render(
      <SocialActions 
        artworkId="1" 
        initialLikes={42} 
        initialComments={10} 
        onSave={mockOnSave}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /save to collection/i }));
    
    expect(mockOnSave).toHaveBeenCalledWith('1', true);
  });
});

describe('Comments Component', () => {
  const mockComments = [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Jane Smith',
        username: 'janesmith',
      },
      content: 'This is a test comment',
      createdAt: new Date().toISOString(),
      isOwn: false
    }
  ];

  test('renders comments correctly', () => {
    render(
      <Comments 
        artworkId="1" 
        initialComments={mockComments}
        onAddComment={mockOnAddComment}
      />
    );
    
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('allows adding new comments', async () => {
    render(
      <Comments 
        artworkId="1" 
        initialComments={mockComments}
        onAddComment={mockOnAddComment}
      />
    );
    
    fireEvent.change(screen.getByPlaceholderText('Add a comment...'), {
      target: { value: 'New test comment' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: '' })); // Submit button
    
    expect(mockOnAddComment).toHaveBeenCalledWith('1', 'New test comment');
  });
});

describe('FollowButton Component', () => {
  test('renders follow button correctly', () => {
    render(
      <FollowButton 
        userId="1" 
        userType="artist"
        initialIsFollowing={false}
        initialFollowersCount={100}
        showCount={true}
        onFollow={mockOnFollow}
      />
    );
    
    expect(screen.getByText('Follow')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('calls onFollow when button is clicked', async () => {
    render(
      <FollowButton 
        userId="1" 
        userType="artist"
        initialIsFollowing={false}
        onFollow={mockOnFollow}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /follow/i }));
    
    expect(mockOnFollow).toHaveBeenCalledWith('1', true);
  });

  test('changes text when already following', () => {
    render(
      <FollowButton 
        userId="1" 
        userType="artist"
        initialIsFollowing={true}
        onFollow={mockOnFollow}
      />
    );
    
    expect(screen.getByText('Following')).toBeInTheDocument();
  });
});

describe('ArtworkCard Component', () => {
  const mockArtwork = {
    id: '1',
    title: 'Test Artwork',
    artist: {
      id: 'artist1',
      name: 'Test Artist'
    },
    image: '/test-image.jpg',
    medium: 'Oil on Canvas',
    year: 2023,
    price: 1000,
    currency: '$',
    likes: 42,
    views: 156
  };

  test('renders artwork information correctly', () => {
    render(<ArtworkCard artwork={mockArtwork} />);
    
    expect(screen.getByText('Test Artwork')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Oil on Canvas, 2023')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
  });
});

describe('ArtworkRating Component', () => {
  test('renders rating slider correctly', () => {
    render(
      <ArtworkRating 
        artworkId="1" 
        initialRating={7.5}
        onRatingChange={mockOnRatingChange}
      />
    );
    
    expect(screen.getByText('7.5 / 10')).toBeInTheDocument();
  });

  test('calls onRatingChange when rating changes', async () => {
    render(
      <ArtworkRating 
        artworkId="1" 
        initialRating={7.5}
        onRatingChange={mockOnRatingChange}
      />
    );
    
    fireEvent.change(screen.getByRole('slider'), {
      target: { value: 8.5 }
    });
    
    expect(mockOnRatingChange).toHaveBeenCalledWith(8.5);
  });
});
