import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

/**
 * JC-19: Define a custom hook `useCreateProject` that performs a create operation using React Query and Hono type inference.
 * - This hooks invokes `POST /api/projects`
 */

type ResponseType = InferResponseType<typeof client.api.projects['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.projects['$post']>;

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form }) => {
            const response = await client.api.projects.$post({ form });
            if (!response.ok) {
                throw new Error('Failed to create project');
            }
            
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Project created');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create project');
        }
    });
    
    return mutation;
};