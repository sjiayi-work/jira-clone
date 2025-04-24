import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

/**
 * JC-20: Define a custom hook `useUpdateProject` that performs a create operation using React Query and Hono type inference.
 * - This hooks invokes `PATCH /api/projects`
 */

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['$patch']>;

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.projects[':projectId'].$patch({ form, param });
            if (!response.ok) {
                throw new Error('Failed to update project');
            }
            
            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Project updated');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project', data.$id] });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update project');
        }
    });
    
    return mutation;
};