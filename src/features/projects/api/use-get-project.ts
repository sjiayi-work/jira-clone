import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

interface UseGetProjectProps {
    projectId: string;
}

/**
 * JC-30: Custom hook `useGetProject` that retrieves specific project details.
 * 
 * @param {UseGetProjectProps} props - Parameters accepted.
 * @param {string} props.projectId - Project id.
 * @linkplain This hook invokes `GET /api/projects/:projectId`.
 * @example const { data } = useGetProject({ projectId });
 */

export const useGetProject = ({ projectId }: UseGetProjectProps) => {
    const query = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const response = await client.api.projects[':projectId'].$get({
                param: { projectId }
            });
            
            if (!response.ok) {
                throw new Error('Failed to retrieve project');
            }
            
            const { data } = await response.json();
            return data;
        }
    });
    
    return query;
};