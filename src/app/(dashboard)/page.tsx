import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/actions';
import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspace-form';

export default async function Home() {
    // JC-5: check and "protect" the page from loading if no user
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    return (
        <div className="bg-neutral-500 p-4 h-full">
            <CreateWorkspaceForm />
        </div>
    );
};