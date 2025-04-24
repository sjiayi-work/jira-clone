import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['$delete']>;

/**
 * JC-20: Define a custom hook `useDeleteProject` that performs a delete operation using React Query and Hono type inference.
 * 
 * @linkplain This hooks invokes `DELETE /api/projects/:projectId`
 * @example const { mutate, isPending } = useDeleteProject();
 */
export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.projects[':projectId'].$delete({ param });
            if (!response.ok) {
                throw new Error('Failed to delete project');
            }
            
            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Project deleted');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project', data.$id] });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete project');
        }
    });
    
    return mutation;
};