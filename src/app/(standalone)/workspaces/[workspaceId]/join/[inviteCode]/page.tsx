import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { getWorkspaceInfo } from '@/features/workspaces/queries';

/**
 * JC-17: Join workspace page.
 * 
 * @link /workspaces/[workspaceId]/join/[inviteCode]
 */

interface WorkspaceIdJoinPageProps {
    params: {
        workspaceId: string;
    }
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    const { workspaceId } = await params;
    const workspace = await getWorkspaceInfo({ workspaceId });
    if (!workspace) {
        redirect('/');
    }
    
    return (
        <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm initialValues={workspace} />
        </div>
    );
}

export default WorkspaceIdJoinPage;