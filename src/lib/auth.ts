import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getUserByEmail, createUser, generateUUID } from './db';
import { D1Database } from '@cloudflare/workers-types';

export const authOptions = (db: D1Database): NextAuthOptions => ({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await getUserByEmail({ db }, credentials.email);
        
        if (!user) {
          return null;
        }
        
        // In a real application, you would verify the password hash here
        // For now, we're just checking if the user exists
        
        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.profile_image,
          userType: user.user_type
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
      }
      
      // If this is an OAuth sign-in
      if (account && account.provider && !token.id) {
        const existingUser = await getUserByEmail({ db }, token.email as string);
        
        if (existingUser) {
          token.id = existingUser.id;
          token.userType = existingUser.user_type;
        } else {
          // Create a new user
          const userId = await generateUUID();
          const newUser = {
            id: userId,
            email: token.email as string,
            username: token.name as string,
            profile_image: token.picture,
            user_type: 'lover', // Default to art lover for OAuth sign-ups
            oauth_provider: account.provider,
            oauth_id: account.providerAccountId
          };
          
          await createUser({ db }, newUser);
          
          token.id = userId;
          token.userType = 'lover';
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/auth/register'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key'
});

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    id: string;
    userType: string;
  }
  
  interface Session {
    user: {
      id: string;
      userType: string;
      email: string;
      name?: string | null;
      image?: string | null;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    userType?: string;
  }
}
