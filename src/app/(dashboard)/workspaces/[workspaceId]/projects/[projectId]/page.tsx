import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';

import { ProjectIdClient } from './client';

/**
 * JC-20: Project page.
 * 
 * @linkplain /workspaces/:workspaceId/projects/:projectId
 */

const ProjectIdPage = async () => {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    // JC-30: Move data retrieval to client page.
    return <ProjectIdClient />
};

export default ProjectIdPage;