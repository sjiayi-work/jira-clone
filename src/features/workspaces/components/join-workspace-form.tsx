'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useJoinWorkspace } from '../api/use-join-workspace';
import { useInviteCode } from '../hooks/use-invite-code';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import { Workspace } from '../types';

interface JoinWorkspaceFormProps {
    initialValues: Workspace;
}

/**
 * JC-17: JoinWorkspaceForm component.
 * 
 * @param props - Component properties.
 * @param props.initialValues - The default values.
 * @param props.initialValues.name - The workspace name.
 * 
 * @example <JoinWorkspaceForm initialValues={workspace} />
 */
export const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const inviteCode = useInviteCode();
    const { mutate, isPending } = useJoinWorkspace();
    
    const onSubmit = () => {
        mutate({
            param: {
                workspaceId: workspaceId
            },
            json: {
                code: inviteCode
            }
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`);
            }
        });
    };
    
    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
                <CardDescription>You&apos;ve been invited to join <strong>{ initialValues.name }</strong> workspace</CardDescription>
            </CardHeader>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-y-2 gap-x-2">
                    <Button className="w-full lg:w-fit" variant="secondary" type="button" size="lg" disabled={isPending}>
                        <Link href="/">Cancel</Link>
                    </Button>
                    <Button className="w-full lg:w-fit" size="lg" type="button" onClick={onSubmit} disabled={isPending}>Join Workspace</Button>
                </div>
            </CardContent>
        </Card>
    );
};