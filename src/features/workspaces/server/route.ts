import { zValidator } from '@hono/zod-validator';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, TASKS_ID, WORKSPACES_ID } from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { TaskStatus } from '@/features/tasks/types';
import { sessionMiddleware } from '@/lib/session-middleware';
import { generateInviteCode } from '@/lib/utils';

import { createWorkspaceSchema, updateWorkspaceSchema } from '../schema';
import { Workspace } from '../types';

const INVITE_CODE_LENGTH = 6;

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
            inviteCode: generateInviteCode(INVITE_CODE_LENGTH)
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
    })
    // JC-13: Update workspace settings
    .patch('/:workspaceId', sessionMiddleware, zValidator('form', updateWorkspaceSchema), async (c) => {
        const databases = c.get('databases');
        const storage = c.get('storage');
        const user = c.get('user');
        
        const { workspaceId } = c.req.param();
        const { name, image } = c.req.valid('form');
        
        const member = await getMember({ 
            databases, 
            workspaceId, 
            userId: user.$id
        });
        
        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        
        let uploadedImageUrl: string | undefined;
        
        if (image) {
            const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
            const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
        }
        
        const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, { name, imageUrl: uploadedImageUrl });
        return c.json({ data: workspace });
    })
    // JC-15: Delete a workspace
    .delete('/:workspaceId', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');
        
        const { workspaceId } = c.req.param();
        
        const member = await getMember({ databases, workspaceId, userId: user.$id });
        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        
        // TODO: delete members, projects and tasks
        
        await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);
        
        return c.json({ data: { $id: workspaceId } });
    })
    // JC-16: Update workspace invite code
    .post('/:workspaceId/reset-invite-code', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');
        
        const { workspaceId } = c.req.param();
        
        const member = await getMember({ databases, workspaceId, userId: user.$id });
        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        
        const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
            inviteCode: generateInviteCode(INVITE_CODE_LENGTH)
        });
        
        return c.json({ data: workspace });
    })
    // JC-17: Join workspace
    .post('/:workspaceId/join', sessionMiddleware, zValidator('json', z.object({ code: z.string() })), async (c) => {
        const { workspaceId } = c.req.param();
        const { code } = c.req.valid('json');
        
        const databases = c.get('databases');
        const user = c.get('user');
        const userId = user.$id;
        
        const member = await getMember({ databases, workspaceId, userId: userId });
        if (member) {
            return c.json({ error: 'Already a member' }, 400);
        }
        
        const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);
        if (workspace.inviteCode !== code) {
            return c.json({ error: 'Invalid invite code' }, 400);
        }
        
        // create member
        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), { 
            workspaceId,
            userId,
            role: MemberRole.MEMBER
        });
        
        return c.json({ data: workspace });
    })
    // JC-30: Retrieve a workspace
    .get('/:workspaceId', sessionMiddleware, async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');
        const { workspaceId } = c.req.param();
        
        const member = await getMember({ databases, workspaceId, userId: user.$id });
        if (!member) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        
        const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);
        return c.json({ data: workspace });
    })
    // JC-32: Get workspace analytics
    .get('/:workspaceId/analytics', sessionMiddleware, async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');
        const { workspaceId } = c.req.param();
        
        const member = await getMember({
            databases,
            workspaceId: workspaceId,
            userId: user.$id
        });
        
        if (!member) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));
        
        const thisMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]);
        
        const lastMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
        ]);
        
        const taskCount = thisMonthTasks.total;
        const taskDifference = taskCount - lastMonthTasks.total;
        
        // Tasks with assignees
        
        const thisMonthAssignedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.equal('assigneeId', member.$id),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]);
        
        const lastMonthAssignedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.equal('assigneeId', member.$id),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
        ]);
        
        const assignedTaskCount = thisMonthAssignedTasks.total;
        const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total;
        
        // Incomplete tasks
        
        const thisMonthIncompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.notEqual('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]);
        
        const lastMonthIncompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.notEqual('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
        ]);
        
        const incompleteTaskCount = thisMonthIncompleteTasks.total;
        const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks.total;
        
        // Completed Tasks
        
        const thisMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.equal('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]);
        
        const lastMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.equal('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
        ]);
        
        const completedTaskCount = thisMonthCompletedTasks.total;
        const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks.total;
        
        // Overdue Tasks
        
        const thisMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.notEqual('status', TaskStatus.DONE),
            Query.lessThan('dueDate', now.toISOString()),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]);
        
        const lastMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('workspaceId', workspaceId),
            Query.notEqual('status', TaskStatus.DONE),
            Query.lessThan('dueDate', now.toISOString()),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
        ]);
        
        const overdueTaskCount = thisMonthOverdueTasks.total;
        const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total;
        
        return c.json({
            data: {
                taskCount,
                taskDifference,
                assignedTaskCount,
                assignedTaskDifference,
                completedTaskCount,
                completedTaskDifference,
                incompleteTaskCount,
                incompleteTaskDifference,
                overdueTaskCount,
                overdueTaskDifference
            }
        });
    });

export default app;