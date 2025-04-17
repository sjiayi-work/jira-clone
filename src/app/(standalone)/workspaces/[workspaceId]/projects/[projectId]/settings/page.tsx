import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { getProject } from '@/features/projects/queries';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';

interface ProjectIdSettingsPageProps {
    params: {
        projectId: string;
    }
}

/**
 * JC-20: Project settings page.
 * 
 * @param {ProjectIdSettingsPageProps} props - Page properties.
 * @param {object} props.params - Object containing page parameters.
 * @param {string} props.params.projectId - Project Id.
 */

const ProjectIdSettingsPage = async ({ params }: ProjectIdSettingsPageProps) => {
    const user = getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    const { projectId } = await params;
    const project = await getProject({ projectId });
    
    return (
        <div className="w-full lg:max-w-xl">
            <EditProjectForm initialValues={project} />
        </div>
    );
};

export default ProjectIdSettingsPage;