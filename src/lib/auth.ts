import 'server-only';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import fs from 'fs';
import path from 'path';

export const authOptions: NextAuthOptions = {
  // Remove Prisma adapter for file-based admin credentials
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Use environment variables for production, fallback to file for development
        let adminUsername: string;
        let adminPassword: string;

        if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
          // Production: use environment variables
          adminUsername = process.env.ADMIN_USERNAME;
          adminPassword = process.env.ADMIN_PASSWORD;
        } else {
          // Development: try to read from file
          try {
            const credPath = path.join(process.cwd(), 'admin.credentials.json');
            const raw = fs.readFileSync(credPath, 'utf8');
            const { username, password } = JSON.parse(raw) as { username: string; password: string };
            adminUsername = username;
            adminPassword = password;
          } catch (e) {
            console.error('Failed to read admin credentials file and no environment variables set:', e);
            return null;
          }
        }

        if (
          credentials?.username &&
          credentials?.password &&
          credentials.username === adminUsername &&
          credentials.password === adminPassword
        ) {
          return {
            id: 'admin-user',
            email: 'admin@local',
            name: 'Admin',
            role: 'ADMIN',
            image: null
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'role' in user) {
        token.role = user.role || 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
};