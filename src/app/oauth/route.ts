import { cookies } from 'next/headers';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import { AUTH_COOKIE } from '@/features/auth/constants';
import { createAdminClient } from '@/lib/appwrite';

/**
 * JC-34: This file is adapted from Appwrite OAuth authentication with SSR:
 * @see {@link https://appwrite.io/docs/tutorials/nextjs-ssr-auth/step-7#oauth-callback}
 */

const app = new Hono()
    .get('/oauth', async (c) => {
        const userId = c.req.query('userId');
        const secret = c.req.query('secret');
        
        if (!userId || !secret) {
            return c.json({ error: 'Missing fields' }, 400);
        }
        
        const { account } = await createAdminClient();
        const session = await account.createSession(userId, secret);
        
        (await cookies()).set(AUTH_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });
        
        return c.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    });

export const GET = handle(app);