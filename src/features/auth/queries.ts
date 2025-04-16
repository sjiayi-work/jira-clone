'use server';

import { createSessionClient } from '@/lib/appwrite';

/**
 * JC-5: Retrieve current authenticated user account details.
 * @returns {Models.User<Models.Preferences>}
 */
export const getCurrent = async () => {
    try {
        const { account } = await createSessionClient();
        return await account.get();
        
    } catch {
        return null;
    }
};