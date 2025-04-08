import { PropsWithChildren } from 'react';

/**
 * JC-2: Sign in layout.
 */

const SignInLayout = ({ children }: PropsWithChildren) => {
    return (
        <div>
            { children }
        </div>
    );
}

export default SignInLayout;