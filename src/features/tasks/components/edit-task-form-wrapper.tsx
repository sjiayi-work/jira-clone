import { Loader } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { useGetTask } from '../api/use-get-task';
import { EditTaskForm } from './edit-task-form';

interface EditTaskFormWrapperProps {
    id: string;
    onCancel: () => void;
}

/**
 * JC-25: Wrapper of the `<EditTaskForm>` component.
 * It gets required data such as list of projects and workspace members and pass them to the form component.
 * 
 * @param {EditTaskFormWrapperProps} props - Component properties.
 * @param {string} props.id - Task id.
 * @param {Function} props.onCancel - Custom function to pass to the `<EditTaskForm>` component.
 * 
 * @example <EditTaskFormWrapper onCancel={() => {}} />
 */

export const EditTaskFormWrapper = ({ id, onCancel }: EditTaskFormWrapperProps) => {
    const workspaceId = useWorkspaceId();
    const { data: projects, isLoading: isLoadingProject } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
    
    // JC-25: Load current task
    const { data: task, isLoading: isLoadingTask } = useGetTask({ taskId: id });
    
    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl
    }));
    
    const memberOptions = members?.documents.map((member) => ({
        id: member.$id,
        name: member.name
    }));
    
    const isLoading = isLoadingMembers || isLoadingProject || isLoadingTask;
    if (isLoading) {
        return (
            <Card className="w-full h-[714px] border-none shadow-none">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }
    
    if (!task) {
        return null;
    }
    
    return (
        <div>
            <EditTaskForm initialValues={task} onCancel={onCancel} projectOptions={projectOptions ?? []} memberOptions={memberOptions ?? []} />
        </div>
    );
};