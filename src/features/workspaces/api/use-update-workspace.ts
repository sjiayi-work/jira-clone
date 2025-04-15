import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

/**
 * JC-13: Define a custom hook `useUpdateWorkspace` that performs an update operation using React Query and Hono type inference.
 * - This hooks invokes `PATCH /api/workspaces/:workspaceId`
 */

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['$patch']>;

export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.workspaces[':workspaceId'].$patch({ form, param });
            const result = await response.json();
            
            if ('error' in result) {
                throw new Error(result.error);
            }
            
            return result;
        },
        onSuccess: ({ data }) => {
            toast.success('Workspace updated');
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
        },
        onError: () => {
            toast.error('Failed to update workspace');
        }
    });
    
    return mutation;
};