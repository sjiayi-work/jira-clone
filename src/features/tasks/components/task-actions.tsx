import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';

import { useDeleteTask } from '../api/use-delete-task';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';

interface TaskActionsProps extends PropsWithChildren {
    id: string;
    projectId: string;
}

/**
 * JC-24: Display list of task actions.
 * 
 * @param {TaskActionsProps} props - Component properties.
 * @param {string} props.id - Task id.
 * @param {string} props.projectId - Project id.
 * @param {ReactNode} [props.children] - Children elements to be wrapped by current component.
 * 
 * @example
 * <TaskActions id={id} projectId={projectId}>
 *      <Button variant="ghost" className="size-8 p-0">
 *          <MoreVertical className="size-4" />
 *      </Button>
 * </TaskActions>
 */

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    
    // JC-25: Implement edit and delete actions
    const [ConfirmDialog, confirm] = useConfirm('Delete Task', 'This action cannot be undone', 'destructive');
    const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();
    const { open } = useEditTaskModal();
    
    const onDelete = async () => {
        const ok = await confirm();
        if (!ok) {
            return;
        }
        
        deleteTask({ param: { taskId: id }});
    };
    
    // JC-25: Action to navigate to task page
    const onOpenTask = () => {
        router.push(`/workspaces/${workspaceId}/tasks/${id}`);
    };
    
    // JC-25: Action to navgiate to project page
    const onOpenProject = () => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
    };
    
    return (
        <div className="flex justify-end">
            <ConfirmDialog />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    { children }
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="font-medium p-[10px]" onClick={onOpenTask}>
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                        Task Details
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="font-medium p-[10px]" onClick={onOpenProject}>
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                        Open Project
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="font-medium p-[10px]" onClick={() => open(id)}>
                        <PencilIcon className="size-4 mr-2 stroke-2" />
                        Edit Task
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="text-amber-700 font-medium p-[10px] focus:text-amber-700" 
                                      disabled={isDeletingTask} onClick={onDelete}>
                        <TrashIcon className="size-4 mr-2 stroke-2" />
                        Delete Task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};