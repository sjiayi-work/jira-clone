import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

interface UseGetWorkspaceProps {
    workspaceId: string;
}

/**
 * JC-30: Custom hook `useGetWorkspace` that retrieves specific workspace.
 * 
 * @param {UseGetWorkspaceProps} props
 * @param {string} props.workspaceId - Workspace Id.
 * @linkplain This hook invokes `GET /api/workspaces/:workspaceId`
 * @example const { data, isLoading } = useGetWorkspace({ workspaceId });
 */

export const useGetWorkspace = ({ workspaceId }: UseGetWorkspaceProps) => {
    const query = useQuery({
        queryKey: ['workspace', workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces[':workspaceId'].$get({
                param: { workspaceId }
            });
            
            if (!response.ok) {
                throw new Error('Failed to retrieve workspace');
            }
            
            const { data } = await response.json();
            return data;
        }
    });
    
    return query;
};