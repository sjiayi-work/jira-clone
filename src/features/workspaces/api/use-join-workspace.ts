import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

/**
 * JC-17: Define a custom hook `useJoinWorkspace` that performs a create operation using React Query and Hono type inference.
 * - This hooks invokes `POST /api/workspaces/:workspaceId/join`
 */

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['join']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['join']['$post']>;

export const useJoinWorkspace = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.workspaces[':workspaceId']['join'].$post({ param, json });
            if (!response.ok) {
                throw new Error('Failed to join workspace');
            }
            
            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Workspace joined');
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
        },
        onError: () => {
            toast.error('Failed to join workspace');
        }
    });
    
    return mutation;
};