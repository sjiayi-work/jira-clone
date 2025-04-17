'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/date-picker';
import { DottedSeparator } from '@/components/dotted-separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

import { useCreateTask } from '../api/use-create-task';
import { createTaskSchema } from '../schemas';
import { TaskStatus } from '../types';

interface CreateTaskFormProps {
    projectOptions: {
        id: string;
        name: string;
        imageUrl: string;
    }[];
    memberOptions: {
        id: string;
        name: string;
    }[];
    onCancel?: () => void;
}

/**
 * JC-22: Form component to create task.
 * 
 * @param {CreateTaskFormProps} props - Component properties.
 * @param {object[]} props.projectOptions - List of projects.
 * @param {object[]} props.memberOptions - List of members.
 * @param {Function} [props.onCancel] - Function to execute on cancel of the form.
 * 
 * @example <CreateTaskForm projectOptions={[]} memberOptions={[]} onCancel={() => {}} />
 */
export const CreateTaskForm = ({ projectOptions, memberOptions, onCancel }: CreateTaskFormProps) => {
    const workspaceId = useWorkspaceId();
    
    const formSchema = createTaskSchema.omit({ workspaceId: true });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    });
    
    const { mutate, isPending } = useCreateTask();
    
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutate({ json: { ...values, workspaceId } }, {
            onSuccess: () => {
                form.reset();
                onCancel?.();
            }
        });
    };
    
    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
            </CardHeader>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            {/* Name */}
                            <FormField name="name" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter task name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            {/* Due Date */}
                            <FormField name="dueDate" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                        <DatePicker {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            {/* Assignee */}
                            <FormField name="assigneeId" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assignee</FormLabel>
                                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select assignee" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        
                                        <SelectContent>
                                            { memberOptions.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    <div className="flex items-center gap-x-2">
                                                        <MemberAvatar className="size-6" name={member.name} />
                                                        { member.name }
                                                    </div>
                                                </SelectItem>
                                            )) }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            {/* Status */}
                            <FormField name="status" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        
                                        <SelectContent>
                                            <SelectItem value={TaskStatus.TODO}>{ TaskStatus.TODO }</SelectItem>
                                            <SelectItem value={TaskStatus.BACKLOG}>{ TaskStatus.BACKLOG }</SelectItem>
                                            <SelectItem value={TaskStatus.IN_PROGRESS}>{ TaskStatus.IN_PROGRESS }</SelectItem>
                                            <SelectItem value={TaskStatus.IN_REVIEW}>{ TaskStatus.IN_REVIEW }</SelectItem>
                                            <SelectItem value={TaskStatus.DONE}>{ TaskStatus.DONE }</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            {/* Project */}
                            <FormField name="projectId" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project</FormLabel>
                                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select project" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        
                                        <SelectContent>
                                            { projectOptions.map((project) => (
                                                <SelectItem key={project.id} value={project.id}>
                                                    <div className="flex items-center gap-x-2">
                                                        <ProjectAvatar className="size-6" name={project.name} image={project.imageUrl} />
                                                        { project.name }
                                                    </div>
                                                </SelectItem>
                                            )) }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        
                        <DottedSeparator className="py-7" />
                        
                        <div className="flex items-center justify-between">
                            <Button type="button" size="lg" variant="secondary" onClick={onCancel} disabled={isPending}
                                    className={cn(!onCancel && 'invisible')}>Cancel</Button>
                            <Button type="submit" size="lg" disabled={isPending}>Create Task</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};