import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

/**
 * JC-7: Define a custom hook `useCreateWorkspace` that performs a create operation using React Query
 *       and Hono type inference.
 * - This hooks invokes `POST /api/workspaces`
 */

type ResponseType = InferResponseType<typeof client.api.workspaces['$post']>;
type RequestType = InferRequestType<typeof client.api.workspaces['$post']>;

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.workspaces.$post({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Workspace created');
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
        onError: () => {
            toast.error('Failed to create workspace');
        }
    });
    
    return mutation;
};