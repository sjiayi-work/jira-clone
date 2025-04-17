import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

interface useGetTasksProps {
    workspaceId: string;
}

/**
 * JC-22: Custom hook `useGetTasks` that retrieves all workspaces.
 * - This hook invokes `GET /api/workspaces`.
 * 
 * @example const { data } = useGetTasks({ workspaceId });
 */

export const useGetTasks = ({ workspaceId }: useGetTasksProps) => {
    const query = useQuery({
        queryKey: ['tasks', workspaceId],
        queryFn: async () => {
            const response = await client.api.tasks.$get({
                query: { workspaceId }
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