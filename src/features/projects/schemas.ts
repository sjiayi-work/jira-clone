import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string().trim().min(1, 'Required'),
    image: z.union([
        typeof File !== 'undefined' ? z.instanceof(File) : z.any(), 
        z.string().transform((value) => value === '' ? undefined : value)
    ]).optional(),
    workspaceId: z.string()
});

// JC-20: Schema for update project
export const updateProjectSchema = z.object({
    name: z.string().trim().min(1, 'Minimum 1 character required').optional(),
    image: z.union([
        typeof File !== 'undefined' ? z.instanceof(File) : z.any(), 
        z.string().transform((value) => value === '' ? undefined : value)
    ]).optional()
});