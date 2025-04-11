import { z } from 'zod';

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1, 'Required'),
    image: z.union([
        typeof File !== 'undefined' ? z.instanceof(File) : z.any(), 
        z.string().transform((value) => value === '' ? undefined : value)
    ]).optional()
});