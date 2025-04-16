import { useQueryState, parseAsBoolean } from 'nuqs';

/**
 * JC-19: Custom hook to control the visibility state of the "Create Project" modal
 * using a URL query parameter (`?create-project=true`).
 *
 * Uses `nuqs` to sync modal state with the URL:
 * - `isOpen`: Boolean state derived from the query param.
 * - `open()`: Sets `create-project=true` in the URL.
 * - `close()`: Removes the param (or sets it to false).
 *
 * Default behavior:
 * - Defaults to `false` when the param is missing.
 * - Automatically clears the param when set back to the default (false).
 *
 * This approach enables deep linking and preserves modal state across refreshes or shares.
 *
 * @returns Object with modal state and control functions.
 */
export const useCreateProjectModal = () => {
    const [isOpen, setIsOpen] = useQueryState('create-project', parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }));
    
    const open = () => {
        setIsOpen(true);
    };
    
    const close = () => {
        setIsOpen(false);
    };
    
    return { isOpen, open, close, setIsOpen };
};