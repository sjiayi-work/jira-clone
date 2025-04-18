import { DragDropContext } from '@hello-pangea/dnd';
import { useState } from 'react';

import { KanbanColumnHeader } from './kanban-column-header';
import { Task, TaskStatus } from '../types';

const boards: TaskStatus[] = [TaskStatus.BACKLOG, TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.DONE];

type TasksState = {
    [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
    data: Task[];
}

/**
 * JC-26: Kanban component.
 * 
 * @param {DataKanbanProps} props - Component properties.
 * @param {Task[]} props.data - The list of tasks to display.
 * 
 * @example <DataKanban data={tasks} />
 */

export const DataKanban = ({ data }: DataKanbanProps) => {
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
        })
        
        return initialTasks;
    });
    
    return (
        <DragDropContext onDragEnd={() => {}}>
            <div className="flex overflow-x-auto">
                { boards.map((board) => {
                    return (
                        <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
                        </div>
                    );
                }) }
            </div>
        </DragDropContext>
    );
};