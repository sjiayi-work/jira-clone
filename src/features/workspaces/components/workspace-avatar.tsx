import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

/**
 * JC-9: Workspace Avatar component.
 * Displays either the image given, or a placeholder with the initial name.
 * 
 * @param {WorkspaceAvatarProps} props - Component properties.
 * @param {string} props.name - The workspace name.
 * @param {string} [props.image] - The workspace image url.
 * @param {string} [props.className] - The custom css class to be applied.
 * 
 * @example
 * <WorkspaceAvatar name="Jira" />
 */

interface WorkspaceAvatarProps {
    name: string;
    image?: string;
    className?: string;
}

export const WorkspaceAvatar = ({ name, image, className }: WorkspaceAvatarProps) => {
    if (image) {
        return (
            <div className={cn('size-10 relative rounded-md overflow-hidden', className)}>
                <Image src={image} alt={name} fill className="object-cover" />
            </div>
        );
    }
    
    return (
        <Avatar className={cn('size-10 rounded-md', className)}>
            <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
                { name[0] }
            </AvatarFallback>
        </Avatar>
    );
};