import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

/**
 * JC-4: Custom hook `useCurrent` that retrieves current logged in user.
 * - This hook invokes `GET /api/auth/current`
 */

export const useCurrent = () => {
    const query = useQuery({
        queryKey: ['current'],
        queryFn: async () => {
            const response = await client.api.auth.current.$get();
            if (!response.ok) {
                return null;
            }
            
            const { data } = await response.json();
            return data;
        }
    });
    
    return query;
};