import { Loader } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { CreateTaskForm } from './create-task-form';

interface CreateTaskFormWrapperProps {
    onCancel: () => void;
}

/**
 * JC-22: Wrapper of the `<CreateTaskForm>` component.
 * It gets required data such as list of projects and workspace members and pass them to the form component.
 * 
 * @param {CreateTaskFormWrapperProps} props - Component properties.
 * @param {Function} props.onCancel - Custom function to pass to the `<CreateTaskForm>` component.
 * 
 * @example <CreateTaskFormWrapper onCancel={() => {}} />
 */

export const CreateTaskFormWrapper = ({ onCancel }: CreateTaskFormWrapperProps) => {
    const workspaceId = useWorkspaceId();
    const { data: projects, isLoading: isLoadingProject } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
    
    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl
    }));
    
    const memberOptions = members?.documents.map((member) => ({
        id: member.$id,
        name: member.name
    }));
    
    const isLoading = isLoadingMembers || isLoadingProject;
    if (isLoading) {
        return (
            <Card className="w-full h-[714px] border-none shadow-none">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }
    
    return (
        <div>
            <CreateTaskForm onCancel={onCancel} projectOptions={projectOptions ?? []} memberOptions={memberOptions ?? []} />
        </div>
    );
};