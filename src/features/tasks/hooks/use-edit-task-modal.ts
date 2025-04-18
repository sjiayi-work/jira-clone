import { useQueryState, parseAsString } from 'nuqs';

/**
 * JC-25: Custom hook to control the visibility state of the "Edit Task" modal
 * using a URL query parameter (`?edit-task=6801c5e7001cfec0b6da`).
 *
 * Uses `nuqs` to sync modal state with the URL:
 * - `taskId`: the current task ID from the URL (or null if not set)
 * - `open()`: Sets `edit-task=6801c5e7001cfec0b6da` in the URL.
 * - `close()`: Removes the param
 * 
 * @returns Object with modal state and control functions.
 */
export const useEditTaskModal = () => {
    const [taskId, setTaskId] = useQueryState('edit-task', parseAsString);
    
    const open = (id: string) => {
        setTaskId(id);
    };
    
    const close = () => {
        setTaskId(null);
    };
    
    return { taskId, open, close, setTaskId };
};