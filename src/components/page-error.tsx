import { AlertTriangle } from 'lucide-react';

interface PageErrorProps {
    message?: string;
}

/**
 * JC-29: Component that displays error.
 * @param {PageErrorProps} props - Component properties.
 * @param {string} [props.message='Something went wrong'] - Custom error to be displayed.
 * 
 * @example
 * <PageError />
 * <PageError message="Task not found" />
 */

export const PageError = ({ message = 'Something went wrong' }: PageErrorProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <AlertTriangle className="size-6 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-muted-foreground">{ message }</p>
        </div>
    );
};