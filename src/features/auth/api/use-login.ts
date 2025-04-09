import { useRouter } from 'next/navigation';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

/**
 * JC-3: Define a custom hook `useLogin` that performs a login operation using React Query
 *       and Hono type inference.
 * - This hooks invokes `POST /api/auth/login`
 */

type ResponseType = InferResponseType<typeof client.api.auth.login['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.login['$post']>;

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.auth.login.$post({json});
            return await response.json();
        },
        onSuccess: () => {
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ['current'] });
        }
    });
    
    return mutation;
};