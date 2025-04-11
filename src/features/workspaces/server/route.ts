import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';

import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { MemberRole } from '@/features/members/types';
import { sessionMiddleware } from '@/lib/session-middleware';
import { generateInviteCode } from '@/lib/utils';

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
            imageUrl: uploadedImageUrl,
            inviteCode: generateInviteCode(6)
        });
        
        // JC-10: Create member
        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
            userId: user.$id,
            workspaceId: workspace.$id,
            role: MemberRole.ADMIN
        });
        
        return c.json({ data: workspace });
    })
    // JC-9: List all workspaces
    .get('/', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');
        
        const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)]);
        if (members.total === 0) {
            return c.json({
                data: {
                    documents: [],
                    total: 0
                }
            });
        }
        
        const workspaceIds = members.documents.map((member) => member.workspaceId);
        const queries = [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)];
        const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, queries);
        return c.json({ data: workspaces });
    });

export default app;