import { differenceInDays, format } from 'date-fns';

import { cn } from '@/lib/utils';

interface TaskDateProps {
    value: string;
    className?: string;
}

/**
 * JC-24: Display task date in different colours.
 * @param {TaskDateProps} props Component properties.
 * @param {string} props.value The date string.
 * @param {string} [props.className] CSS class to be applied on the date value.
 * 
 * @example <TaskDate value="2025-04-17T16:00:00.000Z" className="text-sm" />
 */

export const TaskDate = ({ value, className }: TaskDateProps) => {
    const today = new Date();
    const endDate = new Date(value);
    const diffInDays = differenceInDays(endDate, today);
    
    let textColor = 'text-muted-foreground';
    if (diffInDays <= 3) {
        textColor = 'text-red-500';
    } else if (diffInDays <= 7) {
        textColor = 'text-orange-500';
    } else if (diffInDays <= 14) {
        textColor = 'text-yellow-500';
    }
    
    return (
        <div className={textColor}>
            <span className={cn('truncate', className)}>
                { format(new Date(value), 'PPP') }
            </span>
        </div>
    );
};