import { test, expect } from '@playwright/test';

// Test user authentication
test.describe('Authentication', () => {
  test('should allow users to sign in', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Fill in the form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Click the sign in button
    await page.click('button[type="submit"]');
    
    // Expect to be redirected to the dashboard
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('should allow users to register', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Select user type
    await page.click('label:has-text("Artist")');
    
    // Fill in the form
    await page.fill('input[name="email"]', 'newartist@example.com');
    await page.fill('input[name="username"]', 'newartist');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    // Agree to terms
    await page.check('input[name="agreeToTerms"]');
    
    // Click the register button
    await page.click('button[type="submit"]');
    
    // Expect to be redirected to the sign in page
    await expect(page).toHaveURL('/auth/signin');
  });
});

// Test artwork functionality
test.describe('Artwork Management', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'artist@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });
  
  test('should allow artists to upload artwork', async ({ page }) => {
    await page.goto('/artworks/upload');
    
    // Fill in the form
    await page.fill('input[name="title"]', 'Test Artwork');
    await page.fill('textarea[name="description"]', 'This is a test artwork description');
    await page.fill('input[name="medium"]', 'Digital');
    await page.fill('input[name="style"]', 'Abstract');
    
    // Upload an image
    await page.setInputFiles('input[type="file"]', 'test-image.jpg');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Expect to be redirected to the artwork page
    await expect(page.url()).toContain('/artworks/');
  });
  
  test('should allow artists to manage portfolios', async ({ page }) => {
    await page.goto('/portfolios');
    
    // Click on create new portfolio
    await page.click('button:has-text("New Portfolio")');
    
    // Fill in the form
    await page.fill('input[name="name"]', 'Test Portfolio');
    await page.fill('textarea[name="description"]', 'This is a test portfolio');
    
    // Submit the form
    await page.click('button:has-text("Create Portfolio")');
    
    // Expect the new portfolio to be visible
    await expect(page.locator('h3:has-text("Test Portfolio")')).toBeVisible();
  });
});

// Test social features
test.describe('Social Features', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });
  
  test('should allow users to like artworks', async ({ page }) => {
    await page.goto('/artworks/1');
    
    // Click the like button
    await page.click('button[aria-label="Like"]');
    
    // Expect the like count to increase
    await expect(page.locator('button[aria-label="Unlike"]')).toBeVisible();
  });
  
  test('should allow users to comment on artworks', async ({ page }) => {
    await page.goto('/artworks/1');
    
    // Add a comment
    await page.fill('textarea[placeholder="Add a comment..."]', 'This is a test comment');
    await page.click('button[type="submit"]');
    
    // Expect the comment to be visible
    await expect(page.locator('p:has-text("This is a test comment")')).toBeVisible();
  });
  
  test('should allow users to follow artists', async ({ page }) => {
    await page.goto('/artists/1');
    
    // Click the follow button
    await page.click('button:has-text("Follow")');
    
    // Expect the button to change to "Following"
    await expect(page.locator('button:has-text("Following")')).toBeVisible();
  });
  
  test('should allow users to save artworks to collections', async ({ page }) => {
    await page.goto('/artworks/1');
    
    // Click the save button
    await page.click('button[aria-label="Save to collection"]');
    
    // Expect the button to be filled
    await expect(page.locator('button[aria-label="Remove from collection"]')).toBeVisible();
  });
});

// Test contest functionality
test.describe('Contest Features', () => {
  test('should allow users to vote in contests', async ({ page }) => {
    // Log in
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Go to the current contest
    await page.goto('/contests/current');
    
    // Rate an artwork
    await page.locator('input[type="range"]').first().fill('8');
    
    // Expect the rating to be saved
    await expect(page.locator('div:has-text("8.0/10")')).toBeVisible();
  });
});

// Test responsive design
test.describe('Responsive Design', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check homepage
    await page.goto('/');
    
    // Expect the mobile menu button to be visible
    await expect(page.locator('button[aria-label="Toggle menu"]')).toBeVisible();
    
    // Open the menu
    await page.click('button[aria-label="Toggle menu"]');
    
    // Expect navigation links to be visible
    await expect(page.locator('nav')).toBeVisible();
  });
});
