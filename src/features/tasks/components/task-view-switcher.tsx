'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DottedSeparator } from '@/components/dotted-separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useCreateTaskModal } from '../hooks/use-create-task-modal';

/**
 * JC-21: Task view with multiple tabls.
 * 
 * @example <TaskViewSwitcher />
 */

export const TaskViewSwitcher = () => {
    const { open } = useCreateTaskModal();
    
    return (
        <Tabs className="flex-1 w-full border rounded-lg">
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
                
                {/* Add filters */}
                Data filters
                <DottedSeparator className="my-4" />
                
                <>
                    <TabsContent className="mt-0" value="table">
                        Data table
                    </TabsContent>
                    <TabsContent className="mt-0" value="kanban">
                        Data kanban
                    </TabsContent>
                    <TabsContent className="mt-0" value="calendar">
                        Data calendar
                    </TabsContent>
                </>
            </div>
        </Tabs>
    );
};