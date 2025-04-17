import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getCurrent } from '@/features/auth/queries';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { getProject } from '@/features/projects/queries';

interface ProjectIdPageProps {
    params: {
        projectId: string;
    }
}

/**
 * JC-20: Project page.
 * 
 * @param {ProjectIdPageProps} props - Page properties
 * @param {object} props.params - Object containing page parameters.
 * @param {string} props.params.projectId - Project Id.
 */

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    const { projectId } = await params;
    
    const project = await getProject({ projectId });
    
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
        </div>
    );
};

export default ProjectIdPage;