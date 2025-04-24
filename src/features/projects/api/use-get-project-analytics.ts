import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';

interface UseGetProjectAnalyticsProps {
    projectId: string;
}

export type ProjectAnalyticsResponseType = InferResponseType<typeof client.api.projects[':projectId']['analytics']['$get'], 200>;

/**
 * JC-31: Custom hook `useGetProjectAnalytics` that retrieves a project's analytic data.
 * 
 * @param {UseGetProjectAnalyticsProps} props - Parameters accepted.
 * @param {string} props.projectId - Project id.
 * @linkplain This hook invokes `GET /api/projects/:projectId/analytics`.
 * @example const { data: project, isLoading } = useGetProjectAnalytics({ projectId });
 */

export const useGetProjectAnalytics = ({ projectId }: UseGetProjectAnalyticsProps) => {
    const query = useQuery({
        queryKey: ['project-analytics', projectId],
        queryFn: async () => {
            const response = await client.api.projects[':projectId']['analytics'].$get({
                param: { projectId }
            });
            
            if (!response.ok) {
                throw new Error('Failed to retrieve project analytics');
            }
            
            const { data } = await response.json();
            return data;
        }
    });
    
    return query;
};