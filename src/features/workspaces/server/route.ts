import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID } from 'node-appwrite';

import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from '@/config';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createWorkspaceSchema } from '../schema';

const app = new Hono()
    // JC-7: Create a workspace
    .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');
        const storage = c.get('storage');
        
        const { name, image } = c.req.valid('form');
        
        let uploadedImageUrl: string | undefined;
        
        // JC-8: Upload image to bucket
        if (image) {
            const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
            const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
        }
        
        const workspace = await databases.createDocument(DATABASE_ID, WORKSPACES_ID, ID.unique(), { 
            name, 
            userId: user.$id,
            imageUrl: uploadedImageUrl
        });
        return c.json({ data: workspace });
    })
    // JC-9: List all workspaces
    .get('/', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        
        const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID);
        return c.json({ data: workspaces });
    });

export default app;