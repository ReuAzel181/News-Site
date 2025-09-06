# Veritas Bulletin News Site

<div align="center">
  <img src="./public/favicon-dark.svg" alt="Veritas Bulletin Logo" width="100" height="100">
  <h3>A modern news platform built with Next.js</h3>
</div>

## Overview

Veritas Bulletin is a full-featured news website built with Next.js, Prisma, and TailwindCSS. It provides a clean, responsive interface for browsing news articles with features like categorization, search functionality, and a content management system for administrators.

## Features

- **Flat Design UI**: Minimalist two-dimensional design with sharp 90-degree corners, no drop shadows, and flat color fills
- **Responsive Layout**: Optimized for all device sizes from mobile to desktop
- **Dark/Light Mode**: Theme switching with system preference detection
- **News Categories**: Articles organized by categories with custom colors
- **Search Functionality**: Find articles by keywords
- **Admin Dashboard**: Content management system for creating and editing articles
- **Authentication**: Secure login for administrators
- **SEO Optimized**: Built-in sitemap and robots.txt generation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production recommended)
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS with custom components
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/veritas-bulletin.git
cd veritas-bulletin
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/        # React components
│   ├── contexts/         # React contexts
│   ├── controllers/      # API controllers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and libraries
│   ├── services/         # Service layer
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper utilities
```

## Database Schema

The application uses Prisma ORM with the following main models:

- **User**: Authentication and user management
- **Article**: News articles with content and metadata
- **Category**: Article categories with custom colors
- **Tag**: Article tags for better organization

## Deployment

Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Environment Variables

For production deployment, you need to set the following environment variables:

```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret
DATABASE_URL=your-database-url
NODE_ENV=production
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Prisma](https://prisma.io) - Next-generation ORM
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org) - Authentication for Next.js
