import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';

import { TaskStatus } from '../types';

/**
 * JC-23: Custom hook for parsing and syncing task filter query parameters from the URL.
 * 
 * This uses `nuqs` to bind filter values to the URL, enabling deep linking and 
 * persistent filters across page reloads and navigation.
 * 
 * Filters include:
 * - projectId: string
 * - status: enum from TaskStatus
 * - assigneeId: string
 * - search: string
 * - dueDate: string (typically a date string)
 * 
 * @returns An object containing the current filter state and update functions.
 */
export const useTaskFilters = () => {
    return useQueryStates({
        projectId: parseAsString,
        status: parseAsStringEnum(Object.values(TaskStatus)),
        assigneeId: parseAsString,
        search: parseAsString,
        dueDate: parseAsString
    });
};