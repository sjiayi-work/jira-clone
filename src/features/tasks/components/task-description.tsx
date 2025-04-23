import { useState } from 'react';
import { PencilIcon, XIcon } from 'lucide-react';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { useUpdateTask } from '../api/use-update-task';
import { Task } from '../types';

interface TaskDescriptionProps {
    task: Task;
}

/**
 * JC-29: Component that displays either the task description or allow editing of task description.
 * 
 * @param {TaskDescriptionProps} props - Component properties.
 * @param {Task} props.task - Task data.
 * 
 * @example <TaskDescription task={task} />
 */

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(task.description || '');
    
    const { mutate: updateTask, isPending } = useUpdateTask();
    
    const handleSave = () => {
        updateTask({
            json: { description: value },
            param: { taskId: task.$id }
        }, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };
    
    return (
        <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Overview</p>
                <Button size="sm" variant="secondary" onClick={() => setIsEditing((prev) => !prev)}>
                    { isEditing ? (
                        <>
                            <XIcon  className="size-4 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <PencilIcon className="size-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            
            <DottedSeparator className="my-4" />
            
            { isEditing ? (
                <div className="flex flex-col gap-y-4">
                    <Textarea placeholder="Add a description..." value={value} rows={4} 
                              onChange={(e) => setValue(e.target.value)} disabled={isPending} />
                              
                    <Button className="w-fit ml-auto" size="sm" onClick={handleSave} disabled={isPending}>
                        { isPending ? 'Saving...' : 'Save changes' }
                    </Button>
                </div>
            ) : (
                <div>
                    { task.description || (
                        <span className="text-muted-foreground">No description set</span>
                    ) }
                </div>
            )}
        </div>
    );
};