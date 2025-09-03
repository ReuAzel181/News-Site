# Deployment Guide

## Environment Variables

For production deployment, you need to set the following environment variables:

### Required Variables

1. **NEXTAUTH_URL**
   - Set to your production domain
   - Example: `https://your-domain.vercel.app`
   - For Vercel: This is automatically set, but you can override it

2. **NEXTAUTH_SECRET**
   - A random string used to encrypt JWT tokens
   - Generate using: `openssl rand -base64 32`
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

3. **DATABASE_URL**
   - For development: `"file:./dev.db"`
   - For production: Use your database provider's connection string

4. **NODE_ENV**
   - Set to `production` for production builds

### Vercel Deployment

1. In your Vercel dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add the required variables:
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-generated-secret
   DATABASE_URL=your-database-url
   NODE_ENV=production
   ```

### Authentication Setup

The application uses file-based authentication with credentials stored in `admin.credentials.json`:

```json
{
  "username": "your-username",
  "password": "your-password"
}
```

**Security Note**: Make sure this file is not committed to version control and is properly secured in production.

### Common Issues

1. **Configuration Error (404)**
   - Usually caused by missing or incorrect `NEXTAUTH_URL`
   - Ensure the URL matches your production domain exactly

2. **Authentication Failures**
   - Check that `NEXTAUTH_SECRET` is set and consistent
   - Verify `admin.credentials.json` exists and is readable

3. **Database Connection Issues**
   - Ensure `DATABASE_URL` is correctly formatted
   - For SQLite in production, consider using a persistent storage solution