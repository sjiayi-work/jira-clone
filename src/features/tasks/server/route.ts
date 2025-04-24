import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Project } from '@/features/projects/types';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';

import { createTaskSchema } from '../schemas';
import { Task, TaskStatus } from '../types';

const app = new Hono()
    // JC-21: Create a task
    .post('/', sessionMiddleware, zValidator('json', createTaskSchema), async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');
        
        const { name, status, workspaceId, projectId, dueDate, assigneeId } = c.req.valid('json');
        
        const member = await getMember({ databases, workspaceId, userId: user.$id });
        if (!member) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        
        const highestPositionTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('status', status),
            Query.equal('workspaceId', workspaceId),
            Query.orderAsc('position'),
            Query.limit(1)
        ]);
        
        const newPosition = highestPositionTask.documents.length > 0 ? highestPositionTask.documents[0].position + 1000 : 1000;
        
        const task = await databases.createDocument(DATABASE_ID, TASKS_ID, ID.unique(), {
            name,
            status,
            workspaceId,
            projectId,
            dueDate,
            assigneeId,
            position: newPosition
        });
        
        return c.json({ data: task });
    })
    // JC-21: List all tasks in a project
    .get('/', sessionMiddleware, zValidator('query', z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish()
    })), async (c) => {
        const { users } = await createAdminClient();
        const databases = c.get('databases');
        const user = c.get('user');
        
        const { workspaceId, projectId, assigneeId, status, search, dueDate } = c.req.valid('query');
        
        const member = await getMember({ databases, workspaceId, userId: user.$id });
        if (!member) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        
        const queries = [
            Query.equal('workspaceId', workspaceId),
            Query.orderDesc('$createdAt')
        ];
        
        if (projectId) {
            console.log('Project Id : ' + projectId);
            queries.push(Query.equal('projectId', projectId));
        }
        
        if (status) {
            console.log('status: ' + status);
            queries.push(Query.equal('status', status));
        }
        
        if (assigneeId) {
            console.log('assigneeId: ' + assigneeId);
            queries.push(Query.equal('assigneeId', assigneeId));
        }
        
        if (dueDate) {
            console.log('dueDate: ' + dueDate);
            queries.push(Query.equal('dueDate', dueDate));
        }
        
        if (search) {
            console.log('search: ' + search);
            queries.push(Query.equal('name', search));
        }
        
        const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, queries);
        
        const documents = tasks.documents;
        const projectIds = documents.map((task) => task.projectId);
        const assigneeIds = documents.map((task) => task.assigneeId);
        
        const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, projectIds.length > 0 ? [Query.contains('$id', projectIds)] : []);
        const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : []);
        const assignees = await Promise.all(
            members.documents.map(async (member) => {
                const user = await users.get(member.userId);
                
                return {
                    ...member,
                    name: user.name,
                    email: user.email
                };
            })
        );
        
        const populatedTasks = documents.map((task) => {
            const project = projects.documents.find((project) => project.$id === task.projectId);
            const assignee = assignees.find((assignee) => assignee.$id === task.assigneeId);
            
            return {
                ...task,
                project,
                assignee
            };
        });
        
        return c.json({ data: { ...tasks, documents: populatedTasks }});
    })
    // JC-25: Delete a task
    .delete('/:taskId', sessionMiddleware, async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');
        
        const { taskId } = c.req.param();
        const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);
        
        const member = await getMember({
            databases, 
            workspaceId: task.workspaceId, 
            userId: user.$id
        });
        
        if (!member) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        
        // Delete task
        await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);
        
        return c.json({ data: { $id: taskId } });
    })
    // JC-25: Update a task
    .patch('/:taskId', sessionMiddleware, zValidator('json', createTaskSchema.partial()), async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');
        
        const { name, status, description, projectId, dueDate, assigneeId } = c.req.valid('json');
        const { taskId } = c.req.param();
        
        const existingTask = await databases.getDocument(DATABASE_ID, TASKS_ID, taskId);
        
        const member = await getMember({
            databases, 
            workspaceId: existingTask.workspaceId, 
            userId: user.$id
        });
        
        if (!member) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        
        const task = await databases.updateDocument(DATABASE_ID, TASKS_ID, taskId, {
            name,
            status,
            projectId,
            dueDate,
            assigneeId,
            description
        });
        
        return c.json({ data: task });
    })
    // JC-25: Retrieve a task
    .get('/:taskId', sessionMiddleware, async (c) => {
        const currentUser = c.get('user');
        const databases = c.get('databases');
        const { taskId } = c.req.param();
        
        const { users } = await createAdminClient();
        
        const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);
        
        const currentMember = await getMember({
            databases,
            workspaceId: task.workspaceId,
            userId: currentUser.$id
        });
        
        if (!currentMember) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        
        const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, task.projectId);
        const member = await databases.getDocument(DATABASE_ID, MEMBERS_ID, task.assigneeId);
        
        const user = await users.get(member.userId);
        
        const assignee = {
            ...member,
            name: user.name,
            email: user.email
        };
        
        const data = {
            ...task,
            project, 
            assignee
        };
        
        return c.json({
            data: data
        });
    })
    // JC-27: Bulk update tasks.
    .post('/bulk-update', sessionMiddleware, zValidator('json', z.object({
        tasks: z.array(z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000)
        }))
    })), async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');
        const { tasks } = c.req.valid('json');
        
        const tasksToUpdate = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [Query.contains('$id', tasks.map(task => task.$id))]);
        
        const workspaceIds = new Set(tasksToUpdate.documents.map(task => task.workspaceId));
        if (workspaceIds.size !== 1) {
            return c.json({ error: 'All tasks must belong to the same workspace' }, 400);
        }
        
        const workspaceId = workspaceIds.values().next().value;
        if (!workspaceId) {
            return c.json({ error: 'Workspace ID is required' }, 400);
        }
        
        const member = await getMember({ databases, workspaceId, userId: user.$id });
        if (!member) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        
        const updatedTasks = await Promise.all(tasks.map(async (task) => {
            const { $id, status, position } = task;
            return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, { status, position });
        }));
        
        return c.json({ data: updatedTasks });
    });

export default app;