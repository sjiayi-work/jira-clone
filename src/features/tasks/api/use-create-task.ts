import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.tasks['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks['$post']>;

/**
 * JC-22: Define a custom hook `useCreateTask` that performs a create operation using React Query and Hono type inference.
 * - This hooks invokes `POST /api/tasks`.
 * 
 * @example const { mutate, isPending } = useCreateTask();
 */

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.tasks.$post({ json });
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Task created');
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create task');
        }
    });
    
    return mutation;
};