import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

/**
 * JC-18: Define a custom hook `useUpdateMember` that performs an update operation using React Query and Hono type inference.
 * - This hooks invokes `PATCH /api/members/:memberId`
 */

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.members[':memberId']['$patch']>;

export const useUpdateMember = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.members[':memberId'].$patch({ param, json });
            if (!response.ok) {
                throw new Error('Failed to update member');
            }
            
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Member updated');
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
        onError: () => {
            toast.error('Failed to update member');
        }
    });
    
    return mutation;
};