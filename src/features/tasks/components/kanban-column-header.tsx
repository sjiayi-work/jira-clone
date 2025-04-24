import React from 'react';
import { CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, CircleIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { snakeCaseToTitleCase } from '@/lib/utils';

import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { TaskStatus } from '../types';

interface KanbanColumnHeaderProps {
    board: TaskStatus;
    taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG]: (
        <CircleDashedIcon className="size-[18px] text-pink-400" />
    ),
    [TaskStatus.TODO]: (
        <CircleIcon className="size-[18px] text-red-400" />
    ),
    [TaskStatus.IN_PROGRESS]: (
        <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
    ),
    [TaskStatus.IN_REVIEW]: (
        <CircleDotIcon className="size-[18px] text-blue-400" />
    ),
    [TaskStatus.DONE]: (
        <CircleCheckIcon className="size-[18px] text-emerald-400" />
    )
};

/**
 * JC-26: The header component of the Kanban layout.
 * 
 * @param {KanbanColumnHeaderProps} props - Component properties.
 * @param {TaskStatus} props.board - The task status.
 * @param {number} props.taskCount - Total number of tasks with this status.
 * 
 * @example <KanbanColumnHeader board="BACKLOG" taskCount={12} />
 */

export const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
    const { open } = useCreateTaskModal();
    
    const icon = statusIconMap[board];
    
    return (
        <div className="px-2 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                { icon }
                <h2 className="text-sm font-medium">{ snakeCaseToTitleCase(board) }</h2>
                <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
                    { taskCount }
                </div>
            </div>
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="size-5" variant="ghost" size="icon" onClick={open}>
                            <PlusIcon className="size-4 text-neutral-500" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add Task</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};