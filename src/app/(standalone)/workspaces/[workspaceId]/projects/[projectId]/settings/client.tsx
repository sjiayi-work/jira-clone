'use client';

import { PageLoader } from '@/components/page-loader';
import { PageError } from '@/components/page-error';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';
import { useProjectId } from '@/features/projects/hooks/use-project-id';

/**
 * JC-30: Client component of Project Settings page.
 * 
 * @example <ProjectIdSettingsClient />
 */

export const ProjectIdSettingsClient = () => {
    const projectId = useProjectId();
    const { data: project, isLoading } = useGetProject({ projectId });
    
    if (isLoading) {
        return <PageLoader />
    }
    
    if (!project) {
        return <PageError message="Project not found" />
    }
    
    return (
        <div className="w-full lg:max-w-xl">
            <EditProjectForm initialValues={project} />
        </div>
    );
};