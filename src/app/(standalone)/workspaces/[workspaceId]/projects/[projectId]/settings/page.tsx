import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';

import { ProjectIdSettingsClient } from './client';

/**
 * JC-20: Project settings page.
 * 
 * @linkplain /workspaces/:workspaceId/projects/:projectId/settings
 */

const ProjectIdSettingsPage = async () => {
    const user = getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    // JC-30: Move data retrieval to client page.
    return <ProjectIdSettingsClient />
};

export default ProjectIdSettingsPage;