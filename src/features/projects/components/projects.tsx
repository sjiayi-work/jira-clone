'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

import { useGetProjects } from '../api/use-get-projects';
import { useCreateProjectModal } from '../hooks/use-create-project-modal';
import { ProjectAvatar } from './project-avatar';

/**
 * JC-19: Displays list of projects.
 */

export const Projects = () => {
    const workspaceId = useWorkspaceId();
    const pathname = usePathname();
    const projectId = null;     // TODO: use useProjectId hook
    const { data } = useGetProjects({ workspaceId });
    const { open } = useCreateProjectModal();
    
    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Projects</p>
                <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" 
                                 onClick={open} />
            </div>
            
            { data?.documents.map((project) => {
                const href = `/workspaces/${workspaceId}/projects/${projectId}`;
                const isActive = pathname === href;
                
                return (
                    <Link href={href} key={project.$id}>
                        <div className={cn('flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500', isActive && 'ng-white shadow-sm hover:opacity-100 text-primary')}>
                            <ProjectAvatar image={project.imageUrl} name={project.name} />
                            <span className="truncate">{ project.name }</span>
                        </div>
                    </Link>
                );
            } )}
        </div>
    );
};