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
        const credPath = path.join(process.cwd(), 'admin.credentials.json');
        try {
          const raw = fs.readFileSync(credPath, 'utf8');
          const { username, password } = JSON.parse(raw) as { username: string; password: string };
          if (
            credentials?.username &&
            credentials?.password &&
            credentials.username === username &&
            credentials.password === password
          ) {
            return {
              id: 'admin-file-user',
              email: 'admin@local',
              name: 'Admin',
              role: 'ADMIN',
              image: null
            };
          }
          return null;
        } catch (e) {
          console.error('Failed to read admin credentials file:', e);
          return null;
        }
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