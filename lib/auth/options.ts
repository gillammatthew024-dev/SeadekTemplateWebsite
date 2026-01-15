// lib/auth/options.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          return null;
        }

        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        
        if (!adminPasswordHash) {
          console.error('ADMIN_PASSWORD_HASH not configured');
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, adminPasswordHash);
        
        if (isValid) {
          return {
            id: 'admin',
            email: 'admin@localhost',
            role: 'admin'
          };
        }

        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
  },
  pages: {
    signIn: '/admin',
    error: '/admin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
  
};