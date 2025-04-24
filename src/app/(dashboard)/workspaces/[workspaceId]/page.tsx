import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';

import { WorkspaceIdClient } from './client';

/**
 * JC-11: Workspace page.
 */

const WorkspaceIdPage = async () => {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    // JC-32: Add client component for data retrieval
    return <WorkspaceIdClient />
};

export default WorkspaceIdPage;