import { test as base } from '@playwright/test';
import { decode, JWT } from 'next-auth/jwt';

type CustomFixtures = {
  session: JWT;
  backendLink: string
}

export const test = base.extend<CustomFixtures>({
  session: async ({context}, use) => {
    // Retrieve the cookie and decode it with the secret
    const state = await context.storageState();
    const token = state.cookies.find(cookie => cookie.name === 'next-auth.session-token');
    if (!token) throw new Error('No token found in storage state');
    
    const decoded = await decode({ token: token.value, secret: process.env.NEXTAUTH_SECRET! });
    if (!decoded) throw new Error('Failed to decode token');
    
    await use(decoded);
  },
  
  backendLink: async ({}, use) => {
    const backendLink = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendLink) throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not set');
    await use(`${backendLink}/api/v1`);
  },
});