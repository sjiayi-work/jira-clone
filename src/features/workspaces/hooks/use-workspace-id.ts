import { useParams } from 'next/navigation';

/**
 * JC-11: Custom hook to extract the `workspaceId` route parameter from the URL.
 *
 * This relies on Next.js App Router's `useParams` hook and assumes that 
 * the dynamic route is defined as `/workspace/[workspaceId]` or similar.
 * 
 * ⚠️ Make sure that the route param is named exactly `workspaceId` 
 * in the route definition — otherwise this will return `undefined`.
 *
 * @returns {string} The workspace ID from the current route.
 */
export const useWorkspaceId = () => {
    const params = useParams();
    // must match the param name exactly
    return params.workspaceId as string;
};