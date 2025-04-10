import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

/**
 * JC-3: Custom `useRegister` hook to perform sign up operation using React Query and Hono type inference.
 * - This hook invokes `POST /api/auth/register`.
 */

type ResponseType = InferResponseType<typeof client.api.auth.register['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.register['$post']>;

export const useRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.auth.register.$post({json});
            
            if (!response.ok) {
                throw new Error('Failed to register');
            }
            
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Registered');
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ['current'] });
        },
        onError: () => {
            toast.error('Failed to register');
        }
    });
    
    return mutation;
};