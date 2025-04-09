import { useRouter } from 'next/navigation';
import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

/**
 * JC-4: Define a custom hook `useLogout` that performs a logout operation using React Query
 *       and Hono type inference.
 * - This hooks invokes `POST /api/auth/logout`
 */

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>;

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.auth.logout.$post();
            return await response.json();
        },
        onSuccess: () => {
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ['current'] });
        }
    });
    
    return mutation;
};