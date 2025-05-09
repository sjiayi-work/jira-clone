import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { InferResponseType } from 'hono';
import { toast } from 'sonner';

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
            
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
            
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Logged out');
            router.refresh();
            
            // JC-36: Invalidate everything when no queryKey specified
            queryClient.invalidateQueries();
        },
        onError: () => {
            toast.error('Failed to log out');
        }
    });
    
    return mutation;
};