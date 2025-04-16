import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { sessionMiddleware } from '@/lib/session-middleware';

import { createProjectSchema } from '../schemas';

const app = new Hono()
    // JC-19: List projects in a workspace
    .get('/', sessionMiddleware, zValidator('query', z.object({ workspaceId: z.string() })), async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');
        
        const { workspaceId } = c.req.valid('query');
        if (!workspaceId) {
            return c.json({ error: 'Missing workspace Id' }, 400);
        }
        
        const member = await getMember({ databases, workspaceId, userId: user.$id });
        if (!member) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        
        const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.orderDesc('$createdAt')
        ]);
        
        return c.json({ data: projects });
    })
    // JC-19: Create a project.
    .post('/', sessionMiddleware, zValidator('form', createProjectSchema), async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');
        const storage = c.get('storage');
        
        const { name, image, workspaceId } = c.req.valid('form');
        
        const member = await getMember({ databases, workspaceId, userId: user.$id });
        if (!member) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        
        let uploadedImageUrl: string | undefined;
        
        // Upload image to bucket
        if (image) {
            const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
            const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
        }
        
        const project = await databases.createDocument(DATABASE_ID, PROJECTS_ID, ID.unique(), { 
            name, 
            imageUrl: uploadedImageUrl,
            workspaceId
        });
        
        return c.json({ data: project });
    });

export default app;