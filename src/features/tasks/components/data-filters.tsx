import { FolderIcon, ListChecksIcon, UserIcon } from 'lucide-react';

import { DatePicker } from '@/components/date-picker';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { useTaskFilters } from '../hooks/use-task-filters';
import { TaskStatus } from '../types';

interface DataFiltersProps {
    hideProjectFilter?: boolean;
}

/**
 * JC-23: Data filters component.
 * 
 * @param {DataFiltersProps} props - Component properties.
 * @param {boolean} [props.hideProjectFilter] - A flag to control the filter visibility.
 * @returns The filter UI component.
 * 
 * @example 
 * <DataFilters />
 * <DataFilters hideProjectFilter />
 */

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
    const workspaceId = useWorkspaceId();
    
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
    
    const isLoading = isLoadingMembers || isLoadingProjects;
    
    const projectOptions = projects?.documents.map((project) => ({
        value: project.$id,
        label: project.name
    }));
    
    const memberOptions = members?.documents.map((member) => ({
        value: member.$id,
        label: member.name
    }));
    
    const [{ status, assigneeId, projectId, dueDate }, setFilters] = useTaskFilters();
    
    const onStatusChange = (value: string) => {
        if (value === 'all') {
            setFilters({ status: null });
        } else {
            setFilters({ status: value as TaskStatus });
        }
    };
    
    const onAssigneeChange = (value: string) => {
        if (value === 'all') {
            setFilters({ assigneeId: null });
        } else {
            setFilters({ assigneeId: value as string });
        }
    };
    
    const onProjectChange = (value: string) => {
        if (value === 'all') {
            setFilters({ projectId: null });
        } else {
            setFilters({ projectId: value });
        }
    };
    
    if (isLoading) {
        return null;
    }
    
    return (
        <div className="flex flex-col lg:flex-row gap-2">
            {/* Status */}
            <Select defaultValue={status || undefined} onValueChange={(value) => onStatusChange(value)}>
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <ListChecksIcon className="size-4 mr-2" />
                        <SelectValue placeholder="All statuses" />
                    </div>
                </SelectTrigger>
                
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectSeparator />
                    <SelectItem value={TaskStatus.BACKLOG}>{ TaskStatus.BACKLOG }</SelectItem>
                    <SelectItem value={TaskStatus.TODO}>{ TaskStatus.TODO }</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>{ TaskStatus.IN_PROGRESS }</SelectItem>
                    <SelectItem value={TaskStatus.IN_REVIEW}>{ TaskStatus.IN_REVIEW }</SelectItem>
                    <SelectItem value={TaskStatus.DONE}>{ TaskStatus.DONE }</SelectItem>
                </SelectContent>
            </Select>
            
            {/* Assignee */}
            <Select defaultValue={assigneeId || undefined} onValueChange={(value) => onAssigneeChange(value)}>
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <UserIcon className="size-4 mr-2" />
                        <SelectValue placeholder="All assignees" />
                    </div>
                </SelectTrigger>
                
                <SelectContent>
                    <SelectItem value="all">All assignees</SelectItem>
                    <SelectSeparator />
                    { memberOptions?.map((member) => (
                        <SelectItem key={member.value} value={member.value}>{ member.label }</SelectItem>
                    )) }
                </SelectContent>
            </Select>
            
            {/* Project */}
            { !hideProjectFilter && (
                <Select defaultValue={projectId || undefined} onValueChange={(value) => onProjectChange(value)}>
                    <SelectTrigger className="w-full lg:w-auto h-8">
                        <div className="flex items-center pr-2">
                            <FolderIcon className="size-4 mr-2" />
                            <SelectValue placeholder="All projects" />
                        </div>
                    </SelectTrigger>
                    
                    <SelectContent>
                        <SelectItem value="all">All projects</SelectItem>
                        <SelectSeparator />
                        { projectOptions?.map((project) => (
                            <SelectItem key={project.value} value={project.value}>{ project.label }</SelectItem>
                        )) }
                    </SelectContent>
                </Select>
            )}
            
            {/* Date Picker */}
            <DatePicker className="w-full lg:w-auto" placeholder="Due Date" value={dueDate ? new Date(dueDate) : undefined}
                        onChange={(date) => {
                            setFilters({
                                dueDate: date ? date.toISOString() : null
                            })
                        }} />
        </div>
    );
};