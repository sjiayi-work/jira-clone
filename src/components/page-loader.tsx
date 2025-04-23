import { Loader } from 'lucide-react';

/**
 * JC-29: Generic component that displays loader icon.
 * 
 * @example <PageLoader />
 */

export const PageLoader = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
    );
};