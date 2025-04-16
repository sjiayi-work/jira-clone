import { useParams } from 'next/navigation';

/**
 * JC-17: Custom hook to extract the `inviteCode` route parameter from the URL.
 *
 * This relies on Next.js App Router's `useParams` hook and assumes that 
 * the dynamic route is defined as `/workspace/[workspaceId]/join/[inviteCode]` or similar.
 * 
 * ⚠️ Make sure that the route param is named exactly `inviteCode` 
 * in the route definition — otherwise this will return `undefined`.
 *
 * @returns {string} The workspace ID from the current route.
 */
export const useInviteCode = () => {
    const params = useParams();
    // must match the param name exactly
    return params.inviteCode as string;
};