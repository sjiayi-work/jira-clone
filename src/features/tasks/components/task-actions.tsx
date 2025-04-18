import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
    return (
        <div className="flex justify-end">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    { children }
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="font-medium p-[10px]" disabled={false} onClick={() => {}}>
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                        Task Details
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="font-medium p-[10px]" disabled={false} onClick={() => {}}>
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                        Open Project
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="font-medium p-[10px]" disabled={false} onClick={() => {}}>
                        <PencilIcon className="size-4 mr-2 stroke-2" />
                        Edit Task
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="text-amber-700 font-medium p-[10px] focus:text-amber-700" disabled={false} onClick={() => {}}>
                        <TrashIcon className="size-4 mr-2 stroke-2" />
                        Task Details
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};