'use client';

import { usePathname } from 'next/navigation';

import { UserButton } from '@/features/auth/components/user-button';

import { MobileSidebar } from './mobile-sidebar';

// JC-33: Define dynamic title and description for each path
const pathnameMap = {
    'tasks': { title: 'My Tasks', description: 'View all of your tasks here' },
    'projects': { title: 'My Projects', description: 'View all of your projects here' }
};

const defaultMap = {
    title: 'Home',
    description: 'Monitor all of your projects and tasks here'
};

/**
 * JC-6: Navbar component.
 * @example <Navbar />
 */

export const Navbar = () => {
    /**
     * Example pathname:
     * - /workspaces/:workspaceId
     * - /workspaces/:workspaceId/projects/:projectId
     * - /workspaces/:workspaceId/tasks
     */
    const pathname = usePathname();
    const pathnameParts = pathname.split('/');
    const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;   // eg: either '', 'projects' or 'tasks'
    
    const { title, description } = pathnameMap[pathnameKey] || defaultMap;
    
    return (
        <nav className="pt-4 px-6 flex items-center justify-between">
            <div className="flex-col hidden lg:flex">
                <h1 className="text-2xl font-semibold">{ title }</h1>
                <p className="text-muted-foreground">{ description }</p>
            </div>
            
            <MobileSidebar />
            <UserButton />
        </nav>
    );
};