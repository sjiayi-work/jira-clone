import { DATABASE_ID, PROJECTS_ID } from '@/config';
import { createSessionClient } from '@/lib/appwrite';

import { getMember } from '../members/utils';
import { Project } from './types';

interface GetProjectProps {
    projectId: string;
}

/**
 * JC-20: Server-side function to retrieve specific project in a workspace where the current authenticated user has joined.
 * 
 * @param props - Accepted parameters.
 * @param props.projectId - Project id.
 * @returns A project.
 */
export const getProject = async ({ projectId }: GetProjectProps) => {
    const { account, databases } = await createSessionClient();
    const user = await account.get();
    
    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);
    if (!project) {
        throw new Error('Project not found');
    }
    
    const member = await getMember({
        databases, 
        workspaceId: project.workspaceId, 
        userId: user.$id
    });
    
    if (!member) {
        throw new Error('Unauthorized');
    }
    
    return project;
};