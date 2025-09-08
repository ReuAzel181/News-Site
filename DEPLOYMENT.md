# Deployment Guide

## Environment Variables

For production deployment, you need to set the following environment variables:

### Required Variables

1. **NEXTAUTH_URL**
   - Set to your production domain
   - Example: `https://veritas-bulletin.vercel.app`
   - For Vercel: This is automatically set, but you can override it
   - **IMPORTANT**: Never use localhost URLs in production!

2. **NEXTAUTH_SECRET**
   - A random string used to encrypt JWT tokens
   - Generate using: `openssl rand -base64 32`
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

3. **DATABASE_URL**
   - For production: Use your Supabase PostgreSQL connection string
   - Get from Supabase Dashboard > Project Settings > Database > Connection string
   - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1`

4. **NODE_ENV**
   - Set to `production` for production builds

5. **Supabase Configuration**
   - **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anon/public key
   - **SUPABASE_SERVICE_ROLE_KEY**: Your Supabase service role key (for server-side operations)
   - Get these from Supabase Dashboard > Project Settings > API

### Vercel Deployment

1. In your Vercel dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add the required variables:
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-generated-secret
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
   NODE_ENV=production
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-admin-password
   ```

   **Note**: The NEXTAUTH_URL should match your actual Vercel deployment URL.
   Do NOT use localhost URLs in production environment variables.

4. Set up Supabase Database:
   - Create tables by running: `npx prisma db push` (locally first)
   - Or use Prisma migrations: `npx prisma migrate deploy`
   - Ensure your Supabase project has the 'images' storage bucket created

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

4. **File Upload Issues (500 Internal Server Error)**
   - Ensure Supabase storage bucket 'images' exists in your project
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set in environment variables
   - Check that the Supabase storage policies allow uploads
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

5. **Database Connection Issues**
   - Verify `DATABASE_URL` points to your Supabase PostgreSQL database
   - Ensure database password is correct in the connection string
   - Check that all required tables exist (run `npx prisma db push`)
   - Verify Supabase project is not paused or has connection limits