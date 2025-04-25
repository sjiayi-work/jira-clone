import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.tasks['bulk-update']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks['bulk-update']['$post']>;

/**
 * JC-27: Define a custom hook `useBulkUpdateTasks` that performs an update operation using React Query and Hono type inference.
 * - This hooks invokes `POST /api/tasks/bulk-update`.
 * 
 * @example const { mutate, isPending } = useBulkUpdateTasks();
 */

export const useBulkUpdateTasks = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.tasks['bulk-update'].$post({ json });
            if (!response.ok) {
                throw new Error('Failed to bulk update tasks');
            }
            
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Tasks updated');
            queryClient.invalidateQueries({ queryKey: ['project-analytics'] });
            queryClient.invalidateQueries({ queryKey: ['workspace-analytics'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to bulk update tasks');
        }
    });
    
    return mutation;
};