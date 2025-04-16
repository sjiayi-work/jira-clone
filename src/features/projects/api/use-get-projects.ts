import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

interface UseGetProjectsProps {
    workspaceId: string;
}

/**
 * JC-19: Custom hook `useGetProjects` that retrieves all workspaces.
 * - This hook invokes `GET /api/workspaces`.
 * 
 * @example const { data } = useGetProjects({ workspaceId });
 */

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
    const query = useQuery({
        queryKey: ['projects', workspaceId],
        queryFn: async () => {
            const response = await client.api.projects.$get({
                query: { workspaceId }
            });
            
            if (!response.ok) {
                throw new Error('Failed to retrieve projects');
            }
            
            const { data } = await response.json();
            return data;
        }
    });
    
    return query;
};