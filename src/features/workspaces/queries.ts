'use server';

import { Query } from 'node-appwrite';

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { createSessionClient } from '@/lib/appwrite';

/**
 * JC-11: Server-side function to fetch all workspaces associated with the currently authenticated user.
 * Used for showing a user's list of accessible workspaces, typically on a dashboard or workspace switcher.
 */
export const getWorkspaces = async () => {
    const { account, databases } = await createSessionClient();
    
    const user = await account.get();
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)]);
    if (members.total === 0) {
        return {
            documents: [],
            total: 0
        };
    }
    
    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const queries = [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)];
    return await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, queries);
};