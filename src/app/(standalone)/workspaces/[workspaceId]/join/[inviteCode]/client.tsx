'use client';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

/**
 * JC-30: Client component of Workspace Join page.
 * 
 * @example <WorkspaceIdJoinClient />
 */

export const WorkspaceIdJoinClient = () => {
    const workspaceId = useWorkspaceId();
    const { data: workspace, isLoading } = useGetWorkspace({ workspaceId });
    
    if (isLoading) {
        return <PageLoader />
    }
    
    if (!workspace) {
        return <PageError />
    }
    
    return (
        <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm initialValues={workspace} />
        </div>
    );
};