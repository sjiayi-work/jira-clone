import 'server-only';   // <-- protect this file to be used by server components only
import { Account, Client, Databases } from 'node-appwrite';
import { cookies } from 'next/headers';

import { AUTH_COOKIE } from '@/features/auth/constants';

/**
 * JC-4: Setup Appwrite admin client.
 */

export async function createAdminClient() {
    const client = new Client().setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
                                .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
                                .setKey(process.env.NEXT_APPWRITE_KEY!);
                                
    return {
        get account() {
            return new Account(client);
        }
    }
};

/**
 * JC-14: Setup Appwrite session client.
 */
export async function createSessionClient() {
    const client = new Client().setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
                                .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
                                
    const session = (await cookies()).get(AUTH_COOKIE);
    if (!session || !session.value) {
        throw new Error('Unauthorized');
    }
    
    client.setSession(session.value);
    
    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        }
    };
};