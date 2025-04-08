import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';

/**
 * JC-3: Custom `useRegister` hook to perform sign up operation using React Query and Hono type inference.
 * - This hook invokes `POST /api/auth/register`.
 */

type ResponseType = InferResponseType<typeof client.api.auth.register['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.register['$post']>;

export const useRegister = () => {
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.auth.register.$post({json});
            return await response.json();
        }
    });
    
    return mutation;
};