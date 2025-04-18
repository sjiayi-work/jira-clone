import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
};

/**
 * Generate an invitation code based on the length given.
 * @param length The length of the code to generate.
 * @returns Invitation code.
 */
export function generateInviteCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
};

/**
 * JC-24: Convert snake case to title case.
 * @param str The string value to convert.
 * @returns String in title case.
 */
export function snakeCaseToTitleCase(str: string): string {
    return str.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};