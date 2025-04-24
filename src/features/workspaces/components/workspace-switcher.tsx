'use client';

import { useRouter } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useGetWorkspaces } from '../api/use-get-workspaces';
import { WorkspaceAvatar } from './workspace-avatar';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import { useCreateWorkspaceModal } from '../hooks/use-create-workspace-modal';

/**
 * JC-9: Workspace Switcher component.
 * Displays all the workspaces in a dropdown.
 * 
 * @example <WorkspaceSwitcher />
 */

export const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { data: workspaces } = useGetWorkspaces();
    const { open } = useCreateWorkspaceModal();
    
    // JC-11: Redirect to workspace page
    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`);
    };
    
    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Workspaces</p>
                
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" 
                                             onClick={open} />
                        </TooltipTrigger>
                        <TooltipContent>Add workspace</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            
            <Select onValueChange={onSelect} value={workspaceId}>
                <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
                    <SelectValue placeholder="No workspace selected" />
                </SelectTrigger>
                <SelectContent>
                    { workspaces?.documents.map((workspace) => (
                        <SelectItem key={workspace.$id} value={workspace.$id}>
                            <div className="flex justify-start items-center gap-3 font-medium">
                                <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} />
                                <span className="truncate">{ workspace.name }</span>
                            </div>
                        </SelectItem>
                    )) }
                </SelectContent>
            </Select>
        </div>
    );
};