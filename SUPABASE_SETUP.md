# Supabase Integration Setup Guide

This guide will help you set up Supabase for your news site deployment, replacing the previous Vercel Blob storage with Supabase storage and database.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Vercel account for deployment
3. Your project cloned locally

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `veritas-bulletin` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Supabase Configuration

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (starts with `eyJ`)
   - **service_role key** (starts with `eyJ`) - **Keep this secret!**

3. Go to **Settings > Database**
4. Copy the **Connection string** and note your database password

## Step 3: Set Up Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Enter bucket details:
   - **Name**: `images`
   - **Public bucket**: ✅ (checked)
4. Click "Create bucket"

## Step 4: Configure Environment Variables

### For Local Development

Update your `.env.local` file:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-DB-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Other existing variables...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-password
```

### For Production (Vercel)

In your Vercel dashboard, add these environment variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-DB-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
NODE_ENV=production
```

## Step 5: Set Up Database Schema

1. Run the following commands locally:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase database
npx prisma db push

# Optional: Seed the database
npm run seed
```

## Step 6: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Test image upload functionality:
   - Go to admin panel
   - Try uploading an image
   - Verify it appears in Supabase Storage

3. Test layout saving:
   - Change layout settings
   - Verify changes are saved to database

## Step 7: Deploy to Vercel

1. Push your changes to GitHub
2. Deploy to Vercel (it will automatically redeploy)
3. Verify all environment variables are set in Vercel dashboard
4. Test the production deployment

## Troubleshooting

### Database Connection Issues
- Verify your database password is correct
- Check that your Supabase project is not paused
- Ensure the connection string format is correct

### Storage Upload Issues
- Verify the 'images' bucket exists and is public
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Ensure storage policies allow uploads

### Layout API 500 Errors
- Run `npx prisma db push` to ensure all tables exist
- Check database connection in production
- Verify environment variables are set in Vercel

## Security Notes

1. **Never commit** `.env.local` to version control
2. **Keep service role key secret** - only use in server-side code
3. **Use anon key** for client-side operations
4. **Enable RLS policies** if you need more granular access control

## Migration from Vercel Blob

If you were previously using Vercel Blob:

1. Export existing images from Vercel Blob (if any)
2. Upload them to Supabase Storage
3. Update image URLs in your database
4. Remove `BLOB_READ_WRITE_TOKEN` from environment variables
5. Update any hardcoded Vercel Blob URLs

Your application is now fully integrated with Supabase for both database and file storage!