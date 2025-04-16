'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useCreateProject } from '../api/use-create-project';
import { createProjectSchema } from '../schemas';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

interface CreateProjectFormProps {
    onCancel?: () => void;
}

/**
 * JC-19: Form component to create project.
 * 
 * @param { CreateProjectFormProps } props - Component properties.
 * @param { Function } [props.onCancel] - Function to execute on cancel of the form.
 * 
 * @example
 * <CreateProjectForm />
 * <CreateProjectForm onCancel={() => {}} />
 */
export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
    const workspaceId = useWorkspaceId();
    
    const formSchema = createProjectSchema.omit({ workspaceId: true });
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    });
    
    const inputRef = useRef<HTMLInputElement>(null);
    
    const { mutate, isPending } = useCreateProject();
    
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const finalValues = {
            ...values, 
            image: values.image instanceof File ? values.image : '',
            workspaceId
        };
        
        mutate({ form: finalValues }, {
            onSuccess: () => {
                form.reset();
                // TODO: redirect to project screen
            }
        });
    };
    
    // Handle image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file);
        }
    };
    
    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
            </CardHeader>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField name="name" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter project name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            {/* Upload image */}
                            <FormField name="image" control={form.control} render={({ field }) => (
                                <div className="flex flex-col gap-y-2">
                                    <div className="flex items-center gap-x-5">
                                        { field.value ? (
                                            <div className="size-[72px] relative rounded-md overflow-hidden">
                                                <Image src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                                                        alt="Logo" fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <Avatar className="size-[72px]">
                                                <AvatarFallback>
                                                    <ImageIcon className="size-[36px] text-neutral-400" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        
                                        <div className="flex flex-col">
                                            <p className="text-sm">Project Icon</p>
                                            <p className="text-sm text-muted-foreground">JPG, PNG, SVG or JPEG, max 1MB</p>
                                            <input className="hidden" type="file" accept=".jpg, .png, .jpeg, ,svg" 
                                                    ref={inputRef} onChange={handleImageChange} disabled={isPending}  />
                                            
                                            { field.value ? (
                                                <Button type="button" disabled={isPending} variant="destructive" size="xs"
                                                        className="w-fit mt-2" onClick={() => {
                                                            field.onChange(null);
                                                            if (inputRef.current) {
                                                                inputRef.current.value = '';
                                                            }
                                                        }}>
                                                    Remove Image
                                                </Button>
                                            ) : (
                                                <Button type="button" disabled={isPending} variant="teritary" size="xs"
                                                        className="w-fit mt-2" onClick={() => inputRef.current?.click()}>
                                                    Upload Image
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )} />
                        </div>
                        
                        <DottedSeparator className="py-7" />
                        
                        <div className="flex items-center justify-between">
                            <Button type="button" size="lg" variant="secondary" onClick={onCancel} disabled={isPending}
                                    className={cn(!onCancel && 'invisible')}>Cancel</Button>
                            <Button type="submit" size="lg" disabled={isPending}>Create Project</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};