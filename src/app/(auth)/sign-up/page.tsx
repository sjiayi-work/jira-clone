import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/actions';
import { SignUpCard } from '@/features/auth/components/sign-up-card';

/**
 * JC-2: SignUp page.
 */

const SignUpPage = async () => {
    // JC-5: check and "protect" the page from loading if user is logged in
    const user = await getCurrent();
    if (user) {
        redirect('/');
    }
    
    return <SignUpCard />;
};

export default SignUpPage;