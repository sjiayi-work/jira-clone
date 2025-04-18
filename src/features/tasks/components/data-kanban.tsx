import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';

import { KanbanCard } from './kanban-card';
import { KanbanColumnHeader } from './kanban-column-header';
import { KanbanInfo, Task, TaskStatus } from '../types';

const boards: TaskStatus[] = [TaskStatus.BACKLOG, TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.DONE];

type TasksState = {
    [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
    data: Task[];
    onChange: (tasks: KanbanInfo[]) => void;
}

/**
 * JC-26: Kanban component.
 * 
 * @param {DataKanbanProps} props - Component properties.
 * @param {Task[]} props.data - The list of tasks to display.
 * @param {Function} props.onChange - Custom function to execute during drag ends.
 * 
 * @example <DataKanban data={tasks} onChange={onChange} />
 */

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
    const [tasks, setTasks] = useState<TasksState>(() => {
        const initialTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: []
        };
        
        data.forEach((task) => {
            initialTasks[task.status].push(task);
        });
        
        // Sort it
        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
        });
        
        return initialTasks;
    });
    
    useEffect(() => {
        const newTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: []
        };
        
        data.forEach((task) => {
            newTasks[task.status].push(task);
        });
        
        // Sort it
        Object.keys(newTasks).forEach((status) => {
            newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
        });
        
        setTasks(newTasks);
        
    }, [data]);
    
    // JC-27: Update tasks when the drag event ends
    const onDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) {
            return;
        }
        
        const { source, destination } = result;
        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;
        
        const updatesPayload: KanbanInfo[] = [];
        
        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            
            // Safely remove the task from the source column
            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index, 1);
            
            // If there is no moved task (shouldn't happen, but just in case), return the previous state
            if (!movedTask) {
                console.error('No task found at the source index');
                return prevTasks;
            }
            
            // Create a new task object with potentially updated status
            const updatedMovedTask = sourceStatus !== destStatus ? { ...movedTask, status: destStatus } : movedTask;
            
            // Update the source column
            newTasks[sourceStatus] = sourceColumn;
            
            // Add the task to the destination column
            const destColumn = [...newTasks[destStatus]];
            destColumn.splice(destination.index, 0, updatedMovedTask);
            newTasks[destStatus] = destColumn;
            
            // Update the moved task
            updatesPayload.push({
                $id: updatedMovedTask.$id,
                status: destStatus,
                position: Math.min((destination.index + 1) * 1000, 1_000_000)
            });
            
            // Update positions for affected tasks in the destination column
            newTasks[destStatus].forEach((task, index) => {
                if (task && task.$id !== updatedMovedTask.$id) {
                    const newPosition = Math.min((index + 1) * 1000, 1_000_000);
                    
                    if (task.position !== newPosition) {
                        updatesPayload.push({
                            $id: task.$id,
                            status: destStatus,
                            position: newPosition
                        });
                    }
                }
            });
            
            // If the task moved between columns, update positions in the source column
            if (sourceStatus !== destStatus) {
                newTasks[sourceStatus].forEach((task, index) => {
                    if (task) {
                        const newPosition = Math.min((index + 1) * 1000, 1_000_000);
                        if (task.position !== newPosition) {
                            updatesPayload.push({
                                $id: task.$id,
                                status: sourceStatus,
                                position: newPosition
                            });
                        }
                    }
                });
            }
            
            return newTasks;
        });
        
        onChange(updatesPayload);
        
    }, [onChange]);
    
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                { boards.map((board) => {
                    return (
                        <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
                            
                            {/* JC-27: Add drag & drop layout */}
                            <Droppable droppableId={board}>
                                {(provided) => (
                                    <div className="min-h-[200px] py-1.5" {...provided.droppableProps} ref={provided.innerRef}>
                                        { tasks[board].map((task, index) => (
                                            <Draggable key={task.$id} draggableId={task.$id} index={index}>
                                                {(provided) => (
                                                    <div {...provided.draggableProps} {...provided.dragHandleProps} 
                                                         ref={provided.innerRef}>
                                                        <KanbanCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        )) }
                                        
                                        { provided.placeholder }
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                }) }
            </div>
        </DragDropContext>
    );
};