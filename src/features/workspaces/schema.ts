import { z } from 'zod';

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1, 'Required'),
    image: z.union([
        typeof File !== 'undefined' ? z.instanceof(File) : z.any(), 
        z.string().transform((value) => value === '' ? undefined : value)
    ]).optional()
});

// JC-13: Prepare schema for update workspace
export const updateWorkspaceSchema = z.object({
    name: z.string().trim().min(1, 'Must be 1 or more characters').optional(),
    image: z.union([
        typeof File !== 'undefined' ? z.instanceof(File) : z.any(), 
        z.string().transform((value) => value === '' ? undefined : value)
    ]).optional()
});