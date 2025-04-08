import 'server-only';   // <-- protect this file to be used by server components only
import { Account, Client } from 'node-appwrite';

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