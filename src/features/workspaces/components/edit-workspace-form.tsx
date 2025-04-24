'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, CopyIcon, ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';

import { useDeleteWorkspace } from '../api/use-delete-workspace';
import { useResetInviteCode } from '../api/use-reset-invite-code';
import { useUpdateWorkspace } from '../api/use-update-workspace';
import { updateWorkspaceSchema } from '../schema';
import { Workspace } from '../types';

/**
 * JC-13: Form component to create workspace.
 * 
 * @example
 * <EditWorkspaceForm />
 * <EditWorkspaceForm onCancel={() => {}} />
 */

interface EditWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
}

export const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {
    const router = useRouter();
    
    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl || ''
        }
    });
    
    const inputRef = useRef<HTMLInputElement>(null);
    
    const { mutate, isPending } = useUpdateWorkspace();
    const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
    const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode();
    
    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        const finalValues = {
            ...values, 
            image: values.image instanceof File ? values.image : ''
        };
        
        mutate({ form: finalValues, param: { workspaceId: initialValues.$id } });
    };
    
    // Handle image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file);
        }
    };
    
    // JC-15: Handle workspace deletion
    const [DeleteDialog, confirmDelete] = useConfirm('Delete Workspace', 'This action cannot be undone', 'destructive');
    const handleDelete = async () => {
        const ok = await confirmDelete();
        if (!ok) {
            return;
        }
        
        deleteWorkspace({
            param: {
                workspaceId: initialValues.$id
            }
        }, {
            onSuccess: () => {
                // this will remove any cache and hard reload the page
                window.location.href = '/';
            }
        });
    };
    
    // JC-16: Reset invite code
    const [fullInviteLink, setFullInviteLink] = useState('');
    useEffect(() => {
        setFullInviteLink(`${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`);
    }, [initialValues]);
    
    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(fullInviteLink).then(() => toast.success('Invite link copied to clipboard'));
    };
    
    const [ResetDialog, confirmReset] = useConfirm('Reset invite link', 'This will invalidate the current invite link', 'destructive');
    const handleResetInviteCode = async () => {
        const ok = await confirmReset();
        if (!ok) {
            return;
        }
        
        resetInviteCode({
            param: {
                workspaceId: initialValues.$id
            }
        });
    };
    
    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog />
            <ResetDialog />
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <Button size="sm" variant="secondary" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
                        <ArrowLeftIcon className="size-4 mr-2" />
                        Back
                    </Button>
                    <CardTitle className="text-xl font-bold">{ initialValues.name }</CardTitle>
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
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter workspace name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                
                                {/* JC-8: Upload image */}
                                <FormField name="image" control={form.control} render={({ field }) => {
                                    // Safe preview logic inside render
                                    let previewImage: string = '';
                                    
                                    if (typeof window !== 'undefined' && field.value) {
                                        previewImage = field.value instanceof File ? URL.createObjectURL(field.value) : field.value;
                                    }
                                    
                                    return (
                                        <div className="flex flex-col gap-y-2">
                                            <div className="flex items-center gap-x-5">
                                                { previewImage ? (
                                                    <div className="size-[72px] relative rounded-md overflow-hidden">
                                                        <Image src={previewImage}
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
                                                    <p className="text-sm">Workspace Icon</p>
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
                                    );
                                }} />
                            </div>
                            
                            <DottedSeparator className="py-7" />
                            
                            <div className="flex items-center justify-between">
                                <Button type="button" size="lg" variant="secondary" onClick={onCancel} disabled={isPending}
                                        className={cn(!onCancel && 'invisible')}>Cancel</Button>
                                <Button type="submit" size="lg" disabled={isPending}>Save Changes</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            
            {/* JC-16: Reset invite zone */}
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Invite Members</h3>
                        <p className="text-sm text-muted-foreground">Use the invite link to add members to your workspace</p>
                        <div className="mt-4">
                            <div className="flex items-center gap-x-2">
                                <Input disabled value={fullInviteLink} />
                                <Button variant="secondary" className="size-12" onClick={handleCopyInviteLink}>
                                    <CopyIcon className="size-5" />
                                </Button>
                            </div>
                        </div>
                        
                        <DottedSeparator className="py-7" />
                        
                        <Button type="button" className="mt-6 w-fit ml-auto" size="sm" variant="destructive" 
                                disabled={isPending || isDeletingWorkspace} onClick={handleResetInviteCode}>
                            Reset Invite Link
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            {/* JC-15: Add delete button */}
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">Deleting a workspace is irreversible and will remove all associated data</p>
                        
                        <DottedSeparator className="py-7" />
                        
                        <Button type="button" className="mt-6 w-fit ml-auto" size="sm" variant="destructive" 
                                disabled={isPending || isResettingInviteCode} onClick={handleDelete}>
                            Delete Workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};