import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import { zValidator} from '@hono/zod-validator';
import { ID } from 'node-appwrite';

import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';
import { loginSchema, signupSchema } from '../schemas';
import { AUTH_COOKIE } from '../constants';

const app = new Hono()
    .get('/current', sessionMiddleware, (c) => {
        const user = c.get('user');
        return c.json({ data: user });
    })
    .post('/login', zValidator('json', loginSchema), async (c) => {
        const { email, password } = c.req.valid('json');
        
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);
        
        setCookie(c, AUTH_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 *30
        });
        
        return c.json({ success: true });
    })
    .post('/register', zValidator('json', signupSchema), async (c) => {
        const { name, email, password } = c.req.valid('json');
        
        const { account } = await createAdminClient();
        // create user
        await account.create(ID.unique(), email, password, name);
        // create session
        const session = await account.createEmailPasswordSession(email, password);
        
        setCookie(c, AUTH_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 *30
        });
        
        return c.json({ success: true });
    })
    .post('/logout', sessionMiddleware, async (c) => {
        const account = c.get('account');
        await account.deleteSession('current');
        
        deleteCookie(c, AUTH_COOKIE);
        
        return c.json({ success: true });
    });

export default app;