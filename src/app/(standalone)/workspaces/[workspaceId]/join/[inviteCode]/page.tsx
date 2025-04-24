import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';

import { WorkspaceIdJoinClient } from './client';

/**
 * JC-17: Join workspace page.
 * 
 * @linkplain /workspaces/:workspaceId/join/:inviteCode
 */

const WorkspaceIdJoinPage = async () => {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    // JC-30: Move data retrieval to client page.
    return <WorkspaceIdJoinClient />
}

export default WorkspaceIdJoinPage;