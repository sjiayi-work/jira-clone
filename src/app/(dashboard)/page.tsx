import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { getWorkspaces } from '@/features/workspaces/queries';

export default async function DashboadPage() {
    // JC-5: check and "protect" the page from loading if no user
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    // JC-11: Redirect to the first workspace page, or go to the create page.
    const workspaces = await getWorkspaces();
    if (workspaces.total === 0) {
        redirect('/workspaces/create');
    } else {
        redirect(`/workspaces/${workspaces.documents[0].$id}`);
    }
};