# Deployment Guide for Art Community Platform

This document provides instructions for deploying the Art Community Platform to production.

## Prerequisites

- Node.js 18+ and npm/pnpm
- Cloudflare account for Workers deployment
- Environment variables configured

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Authentication
AUTH_SECRET=your-auth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Database
DATABASE_URL=your-database-url

# Storage
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

## Local Development

1. Install dependencies:
   ```
   pnpm install
   ```

2. Reset the database:
   ```
   wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```

3. Run the development server:
   ```
   pnpm dev
   ```

4. Access the application at http://localhost:3000

## Testing

1. Run unit tests:
   ```
   pnpm test:unit
   ```

2. Run end-to-end tests:
   ```
   pnpm test:e2e
   ```

## Production Deployment

### Option 1: Cloudflare Pages Deployment

1. Build the application:
   ```
   pnpm build
   ```

2. Deploy to Cloudflare Pages:
   ```
   wrangler pages deploy .next
   ```

3. Configure environment variables in the Cloudflare dashboard.

### Option 2: Custom Server Deployment

1. Build the application:
   ```
   pnpm build
   ```

2. Start the production server:
   ```
   pnpm start
   ```

## Database Migrations

To apply database migrations:

```
wrangler d1 migrations apply DB
```

## Monitoring and Maintenance

- Monitor application performance using Cloudflare Analytics
- Set up error tracking with a service like Sentry
- Regularly backup the database
- Update dependencies to address security vulnerabilities

## Scaling Considerations

- Implement caching strategies for frequently accessed data
- Consider using a CDN for static assets
- Optimize database queries for performance
- Implement rate limiting for API endpoints

## Security Considerations

- Regularly update dependencies
- Implement CSRF protection
- Use HTTPS for all connections
- Sanitize user inputs to prevent XSS attacks
- Implement proper authentication and authorization checks
