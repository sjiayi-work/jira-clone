import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.tasks[':taskId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[':taskId']['$delete']>;

/**
 * JC-25: Define a custom hook `useDeleteTask` that performs a delete operation using React Query and Hono type inference.
 * 
 * @linkplain This hooks invokes `DELETE /api/tasks/:taskId`.
 * @example const { mutate, isPending } = useDeleteTask();
 */

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.tasks[':taskId'].$delete({ param });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            
            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Task deleted');
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task', data.$id] });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete task');
        }
    });
    
    return mutation;
};