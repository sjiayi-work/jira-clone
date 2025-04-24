import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';

import { WorkspaceIdSettingsClient } from './client';

/**
 * Workspace Settings page.
 * @linkplain /workspaces/:workspaceId/settings
 */

const WorkspaceIdSettingsPage = async () => {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    // JC-30: Move data retrieval to client page.
    return <WorkspaceIdSettingsClient />
}

export default WorkspaceIdSettingsPage;