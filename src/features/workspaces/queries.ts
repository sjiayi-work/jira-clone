'use server';

import { Query } from 'node-appwrite';

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { createSessionClient } from '@/lib/appwrite';
import { getMember } from '../members/utils';
import { Workspace } from './types';

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

// JC-13: Retrieve a workspace by its id.
interface GetWorkspaceProps {
    workspaceId: string;
}

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
    const { account, databases } = await createSessionClient();
    const user = await account.get();
    
    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) {
        throw new Error('Unauthorized');
    }
    
    return await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);
};

interface GetWorkspaceInfoProps {
    workspaceId: string;
}

/**
 * JC-17: Get workspace details without needing membership.
 * @param props - Required parameters.
 * @param props.workspaceId - Workspace id. 
 * @returns An object containing properties: name
 */
export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps) => {
    const { databases } = await createSessionClient();
    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);
    
    return {
        name: workspace.name
    };
};