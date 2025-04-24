import { useParams } from 'next/navigation';

/**
 * JC-30: Custom hook to safely extract and type the projectId from Next.js route parameters.
 * 
 * @returns {string} The projectId from the current route
 * 
 * @throws Will throw an error if used outside a route with a projectId parameter
 * 
 * @example
 * // In a page like `/projects/[projectId]`
 * const projectId = useProjectId(); // Returns the projectId as string
 */

export const useProjectId = () => {
    const params = useParams();
    return params.projectId as string;
};