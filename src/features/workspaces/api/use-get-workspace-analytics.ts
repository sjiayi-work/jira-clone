import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

interface UseGetWorkspaceAnalyticsProps {
    workspaceId: string;
}

export type WorkspaceAnalyticsResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['analytics']['$get'], 200>;

/**
 * JC-32: Custom hook `useGetWorkspaceAnalytics` that retrieves a project's analytic data.
 * 
 * @param {UseGetWorkspaceAnalyticsProps} props - Parameters accepted.
 * @param {string} props.workspaceId - Workspace id.
 * @linkplain This hook invokes `GET /api/workspaces/:workspaceId/analytics`.
 * @example const { data: analytics, isLoading } = useGetWorkspaceAnalytics({ workspaceId });
 */

export const useGetWorkspaceAnalytics = ({ workspaceId }: UseGetWorkspaceAnalyticsProps) => {
    const query = useQuery({
        queryKey: ['workspace-analytics', workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces[':workspaceId']['analytics'].$get({
                param: { workspaceId }
            });
            
            if (!response.ok) {
                throw new Error('Failed to retrieve workspace analytics');
            }
            
            const { data } = await response.json();
            return data;
        }
    });
    
    return query;
};