import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

interface useGetTaskProps {
    taskId: string;
}

/**
 * JC-25: Custom hook `useGetTask` that retrieves specific task.
 * - This hook invokes `GET /api/tasks/:taskId`.
 * 
 * @example const { data: task } = useGetTask({ taskId });
 */

export const useGetTask = ({ taskId }: useGetTaskProps) => {
    const query = useQuery({
        queryKey: ['task', taskId],
        queryFn: async () => {
            const response = await client.api.tasks[':taskId'].$get({
                param: { taskId }
            });
            
            if (!response.ok) {
                throw new Error('Failed to retrieve task');
            }
            
            const { data } = await response.json();
            return data;
        }
    });
    
    return query;
};