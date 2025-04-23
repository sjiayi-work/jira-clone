import { useParams } from 'next/navigation';

/**
 * JC-29: Custom hook to safely extract and type the taskId from Next.js route parameters.
 * 
 * @returns {string} The taskId from the current route
 * 
 * @throws Will throw an error if used outside a route with a taskId parameter
 * 
 * @example
 * // In a page like `/tasks/[taskId]`
 * const taskId = useTaskId(); // Returns the taskId as string
 */

export const useTaskId = () => {
    const params = useParams();
    return params.taskId as string;
};