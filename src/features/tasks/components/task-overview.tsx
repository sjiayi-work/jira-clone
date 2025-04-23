import { PencilIcon } from 'lucide-react';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskDate } from '@/components/task-date';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { snakeCaseToTitleCase } from '@/lib/utils';

import { useEditTaskModal } from '../hooks/use-edit-task-modal';
import { OverviewProperty } from './overview-property';
import { Task } from '../types';

interface TaskOverviewProps {
    task: Task;
}

/**
 * JC-29: Component to display task overview.
 * 
 * @param {TaskOverviewProps} props - Component properties.
 * @param {Task} props.task - Task data.
 * 
 * @example <TaskOverview task={task} />
 */

export const TaskOverview = ({ task }: TaskOverviewProps) => {
    const { open } = useEditTaskModal();
    
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Overview</p>
                    <Button size="sm" variant="secondary" onClick={() => open(task.$id)}>
                        <PencilIcon className="size-4 mr-2" />
                        Edit
                    </Button>
                </div>
                
                <DottedSeparator className="my-4" />
                
                <div className="flex flex-col gap-y-4">
                    <OverviewProperty label="Assignee">
                        <MemberAvatar className="size-6" name={task.assignee.name} />
                        <p className="text-sm font-medium">{ task.assignee.name }</p>
                    </OverviewProperty>
                    <OverviewProperty label="Due Date">
                        <TaskDate className="text-sm font-medium" value={task.dueDate} />
                    </OverviewProperty>
                    <OverviewProperty label="Status">
                        <Badge variant={task.status}>
                            { snakeCaseToTitleCase(task.status) }
                        </Badge>
                    </OverviewProperty>
                </div>
            </div>
        </div>
    );
};