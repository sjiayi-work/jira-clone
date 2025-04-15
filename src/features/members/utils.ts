import { Databases, Query } from 'node-appwrite';

import { DATABASE_ID, MEMBERS_ID } from '@/config';

interface GetMemberProps {
    databases: Databases;
    workspaceId: string;
    userId: string;
}

/**
 * JC-13: Fetches a single member document from the database based on a specific workspace ID and user ID.
 *
 * @param {Databases} databases - The Appwrite Databases instance.
 * @param {string} workspaceId - The ID of the workspace to search within.
 * @param {string} userId - The ID of the user to find in the workspace.
 *
 * @returns {Promise<Document | undefined>} The first matching member document, or undefined if no match is found.
 */
export const getMember = async ({ databases, workspaceId, userId }: GetMemberProps) => {
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal('workspaceId', workspaceId),
        Query.equal('userId', userId)
    ]);
    
    return members.documents[0];
};