'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date) => void;
    className?: string;
    placeholder?: string;
}

/**
 * JC-22: Date picker.
 * 
 * @param {DatePickerProps} props - Component properties.
 * @param {Date|undefined} props.value - Any date value to be showed.
 * @param {Function} props.onChange - Custom function to execute when date is changed on the shadcn `<Calendar>` component.
 * @param {string} [props.className] - CSS class to be applied on the shadcn `<Button>` component.
 * @param {string} [props.placeholder] - Custom placeholder.
 * 
 * @returns A Popover datepicker
 * 
 * @example <DatePicker value="21/5/2025" onChange={onChange} />
 */

export const DatePicker = ({ value, onChange, className, placeholder = 'Select date' }: DatePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="lg" 
                        className={cn('w-full justify-start text-left font-normal px-3', !value && 'text-muted-foreground', className)}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    { value ? format(value, 'PPP') : <span>{ placeholder }</span> }
                </Button>
            </PopoverTrigger>
            
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={value} onSelect={(date) => onChange(date as Date)} autoFocus />
            </PopoverContent>
        </Popover>
    );
};