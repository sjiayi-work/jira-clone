import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { SignInCard } from '@/features/auth/components/sign-in-card';

/**
 * JC-2: SignIn page.
 */

const SignInPage = async () => {
    // JC-5: check and "protect" the page from loading if user is logged in
    const user = await getCurrent();
    if (user) {
        redirect('/');
    }
    
    return <SignInCard />
};

export default SignInPage;