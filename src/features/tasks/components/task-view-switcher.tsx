'use client';

import { Loader, PlusIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { DottedSeparator } from '@/components/dotted-separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { useGetTasks } from '../api/use-get-tasks';
import { DataFilters } from './data-filters';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { useTaskFilters } from '../hooks/use-task-filters';

/**
 * JC-21: Task view component with multiple tabls.
 * 
 * @example <TaskViewSwitcher />
 */

export const TaskViewSwitcher = () => {
    const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();
    
    const [view, setView] = useQueryState('task-view', {
        defaultValue: 'table'
    });
    
    const workspaceId = useWorkspaceId();
    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId, projectId, assigneeId, status, dueDate });
    const { open } = useCreateTaskModal();
    
    return (
        <Tabs className="flex-1 w-full border rounded-lg" defaultValue={view} onValueChange={setView}>
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
                            Table
                        </TabsTrigger>
                        
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
                            Kanban
                        </TabsTrigger>
                        
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    
                    <Button className="w-full lg:w-auto" size="sm" onClick={open}>
                        <PlusIcon className="size-4 mr-2" />New
                    </Button>
                </div>
                
                <DottedSeparator className="my-4" />
                
                {/* JC-23: Add filters */}
                <DataFilters />
                
                <DottedSeparator className="my-4" />
                
                { isLoadingTasks ? (
                    <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                        <Loader className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <TabsContent className="mt-0" value="table">
                            {/* JC-24: Implement data table */}
                            <DataTable columns={columns} data={tasks?.documents || []} />
                        </TabsContent>
                        <TabsContent className="mt-0" value="kanban">
                            { JSON.stringify(tasks) }
                        </TabsContent>
                        <TabsContent className="mt-0" value="calendar">
                            { JSON.stringify(tasks) }
                        </TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    );
};