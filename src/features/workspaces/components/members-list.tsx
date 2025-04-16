'use client';

import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { MemberRole } from '@/features/members/types';
import { useConfirm } from '@/hooks/use-confirm';

import { useWorkspaceId } from '../hooks/use-workspace-id';

/**
 * JC-18: A component that displays list of members.
 * 
 * @example <MembersList />
 */

export const MembersList = () => {
    const workspaceId = useWorkspaceId();
    const { data } = useGetMembers({ workspaceId });
    const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
    const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
    
    const [ConfirmDialog, confirm] = useConfirm('Remove member', 'This member will be removed from the workspace', 'destructive');
    
    const handleUpdateMember = (memberId: string, role: MemberRole) => {
        updateMember({
            json: { role },
            param: { memberId }
        });
    };
    
    const handleDeleteMember = async (memberId: string) => {
        const ok = await confirm();
        if (!ok) {
            return;
        }
        
        deleteMember({ param: { memberId } }, {
            onSuccess: () => {
                window.location.reload();
            }
        });
    };
    
    return (
        <Card className="w-full h-full border-none shadow-none">
            <ConfirmDialog />
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button variant="secondary" size="sm" asChild>
                    <Link href={`/workspaces/${workspaceId}`}>
                        <ArrowLeftIcon className="size-4 mr-2" /> Back
                    </Link>
                </Button>
                <CardTitle className="text-xl font-bold">Member list</CardTitle>
            </CardHeader>
            
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7">
                { data?.documents.map((member, index) => (
                    <Fragment key={member.$id}>
                        <div className="flex items-center gap-2">
                            <MemberAvatar className="size-10" fallbackClassName="text-lg" name={member.name} />
                            
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">{ member.name }</p>
                                <p className="text-xs text-muted-foreground">{ member.email }</p>
                            </div>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="ml-auto" variant="secondary" size="icon">
                                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" align="end">
                                    <DropdownMenuItem className="font-medium" disabled={isUpdatingMember}
                                                        onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}>
                                        Set as Admnistrator
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="font-medium" disabled={isUpdatingMember}
                                                        onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}>
                                        Set as Member
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-amber-700" disabled={isDeletingMember}
                                                        onClick={() => handleDeleteMember(member.$id)}>
                                        Remove { member.name }
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        
                        { index < data.documents.length - 1 && (
                            <Separator className="my-2.5" />
                        ) }
                    </Fragment>
                ) )}
            </CardContent>
        </Card>
    );
};