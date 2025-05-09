import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['reset-invite-code']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['reset-invite-code']['$post']>;

/**
 * JC-16: Define a custom hook `useResetInviteCode` that performs an update operation using React Query and Hono type inference.
 * 
 * @linkplain This hooks invokes `POST /api/workspaces/:workspaceId/reset-invite-code`
 * @example const { mutate, isPending } = useResetInviteCode();
 */
export const useResetInviteCode = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.workspaces[':workspaceId']['reset-invite-code'].$post({param});
            if (!response.ok) {
                throw new Error('Failed to reset workspace invite code');
            }
            
            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Invite code reset');
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
        },
        onError: () => {
            toast.error('Failed to reset workspace invite code');
        }
    });
    
    return mutation;
};