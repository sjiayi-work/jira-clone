import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon, TrashIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Project } from '@/features/projects/types';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';

import { useDeleteTask } from '../api/use-delete-task';
import { Task } from '../types';

interface TaskBreadcrumbsProps {
    project: Project;
    task: Task;
}

/**
 * JC-29: Component that displays project and task in breadcrumbs.
 * 
 * @param {TaskBreadcrumbsProps} props - Component properties.
 * @param {Project} props.project - Project data.
 * @param {Task} props.task - Task data.
 * 
 * @example <TaskBreadcrumbs project={project} task={task} />
 */

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    
    const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();
    const [ConfirmDialog, confirm] = useConfirm('Delete Task', 'This action cannot be undone', 'destructive');
    
    const handleDeleteTask = async () => {
        const ok = await confirm();
        if (!ok) {
            return;
        }
        
        deleteTask({ param: { taskId: task.$id }}, {
            onSuccess: () => {
                router.push(`/workspaces/${workspaceId}/tasks`);
            }
        });
    };
    
    return (
        <div className="flex items-center gap-x-2">
            <ConfirmDialog />
            
            <ProjectAvatar className="size-6 lg:size-8" name={project.name} image={project.imageUrl} />
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
                    { project.name }
                </p>
            </Link>
            
            <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
            
            <p className="text-sm lg:text-lg font-semibold">{ task.name }</p>
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="ml-auto" variant="destructive" size="sm" onClick={handleDeleteTask} disabled={isDeletingTask}>
                            <TrashIcon className="size-4 lg:mr-2" />
                            <span className="hidden lg:block">Delete Task</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="lg:hidden">
                        <p>Delete Task</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};