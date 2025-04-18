import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';
import { TaskStatus } from '../types';

interface useGetTasksProps {
    workspaceId: string;
    projectId?: string | null;
    status?: TaskStatus | null;
    assigneeId?: string | null;
    dueDate?: string | null;
    search?: string | null;
}

/**
 * JC-22: Custom hook `useGetTasks` that retrieves all tasks in a workspace.
 * - This hook invokes `GET /api/tasks`.
 * 
 * @example const { data } = useGetTasks({ workspaceId });
 */

export const useGetTasks = ({ workspaceId, projectId, status, assigneeId, dueDate, search }: useGetTasksProps) => {
    const query = useQuery({
        queryKey: ['tasks', workspaceId, projectId, status, search, assigneeId, dueDate],
        queryFn: async () => {
            const response = await client.api.tasks.$get({
                query: {
                    workspaceId, 
                    projectId: projectId || undefined,
                    status: status || undefined,
                    search: search || undefined,
                    assigneeId: assigneeId || undefined,
                    dueDate: dueDate || undefined,
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to retrieve tasks');
            }
            
            const { data } = await response.json();
            return data;
        }
    });
    
    return query;
};