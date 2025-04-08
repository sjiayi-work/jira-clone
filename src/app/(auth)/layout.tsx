'use client';

import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

/**
 * JC-2: Auth layout.
 */

const AuthLayout = ({ children }: PropsWithChildren) => {
    const pathname = usePathname();
    const isSignIn = pathname === '/sign-in';
    
    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center">
                    <Image height={56} width={152} src="/logo.svg" alt="Logo" />
                    
                    {/* use asChild to convert the button to a link */}
                    <Button variant="secondary" asChild>
                        <Link href={isSignIn ? '/sign-up' : '/sign-in'}>
                            { isSignIn ? 'Sign Up' : 'Login' }
                        </Link>
                    </Button>
                </nav>
                <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
                    { children }
                </div>
            </div>
        </main>
    );
}

export default AuthLayout;