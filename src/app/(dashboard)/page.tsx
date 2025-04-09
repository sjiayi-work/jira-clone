import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/actions';

export default async function Home() {
    // JC-5: check and "protect" the page from loading if no user
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    return (
        <div>
            This is a home page
        </div>
    );
};