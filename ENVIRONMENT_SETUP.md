# Environment Variable Configuration Guide

## Overview

This project uses different environment configurations for development and production. It's crucial to understand the difference to avoid deployment issues.

## Development Environment (.env.local)

The `.env.local` file is used **ONLY** for local development:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Database
DATABASE_URL="file:./dev.db"

# Development
NODE_ENV=development

# Vercel Blob Storage (for file uploads)
BLOB_READ_WRITE_TOKEN="your-local-blob-token"
```

**Important Notes:**
- The `.env.local` file should **NEVER** be deployed to production
- Localhost URLs are only for local testing
- Port 3001 is used for local development server

## Production Environment (Vercel Dashboard)

For production deployment on Vercel, set these environment variables in your Vercel dashboard:

```env
NEXTAUTH_URL=https://veritas-bulletin.vercel.app
NEXTAUTH_SECRET=your-production-secret
DATABASE_URL=your-production-database-url
NODE_ENV=production
BLOB_READ_WRITE_TOKEN=your-production-blob-token
```

## Key Differences

| Environment | NEXTAUTH_URL | Purpose |
|-------------|--------------|----------|
| Development | `http://localhost:3001` | Local testing only |
| Production | `https://veritas-bulletin.vercel.app` | Live deployment |

## Common Mistakes to Avoid

❌ **DON'T**: Use localhost URLs in production
❌ **DON'T**: Deploy .env.local to production
❌ **DON'T**: Hardcode localhost URLs in your code

✅ **DO**: Use environment variables with proper fallbacks
✅ **DO**: Set production URLs in Vercel dashboard
✅ **DO**: Test locally with localhost, deploy with production URLs

## How It Works

The application uses `process.env.NEXTAUTH_URL` to determine the base URL:
- In development: Falls back to `http://localhost:3001`
- In production: Uses the value set in Vercel environment variables

This ensures the app works correctly in both environments without code changes.