'use client';

import Link from 'next/link';
import { PencilIcon } from 'lucide-react';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';
import { useGetProjectAnalytics } from '@/features/projects/api/use-get-project-analytics';
import { Analytics } from '@/components/analytics';

/**
 * JC-30: Client component of Project page.
 * 
 * @example <ProjectIdClient />
 */

export const ProjectIdClient = () => {
    const projectId = useProjectId();
    const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
    // JC-31: Get analytics
    const { data: analytics, isLoading: isLoadingAnalytics } = useGetProjectAnalytics({ projectId });
    
    const isLoading = isLoadingProject || isLoadingAnalytics;
    
    if (isLoading) {
        return <PageLoader />
    }
    
    if (!project) {
        return <PageError message="Project not found" />
    }
    
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar name={project.name} image={project.imageUrl} className="size-8" />
                    <p className="text-lg font-semibold">{ project.name }</p>
                </div>
                
                <div>
                    <Button variant="secondary" size="sm" asChild>
                        <Link href={`/workspaces/${project.workspaceId}/projects/${projectId}/settings`}>
                            <PencilIcon className="size-4 mr-2" />Edit Project
                        </Link>
                    </Button>
                </div>
            </div>
            
            {/* JC-31: Display Analytics component */}
            { analytics && <Analytics data={analytics} /> }
            
            <TaskViewSwitcher hideProjectFilter />
        </div>
    );
};