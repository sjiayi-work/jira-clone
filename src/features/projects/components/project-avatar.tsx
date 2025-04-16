import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

/**
 * JC-19: Project Avatar component.
 * Displays either the image given, or a placeholder with the initial name.
 * 
 * @param {ProjectAvatarProps} props - Component properties.
 * @param {string} props.name - The workspace name.
 * @param {string} [props.image] - The workspace image url.
 * @param {string} [props.className] - The custom css class to be applied on `<Avatar />` element.
 * @param {string} [props.fallbackClassName] - CSS class to be applied on `<AvatarFallback />` element.
 * 
 * @example
 * <ProjectAvatar name="Jira" />
 */

interface ProjectAvatarProps {
    name: string;
    image?: string;
    className?: string;
    fallbackClassName?: string;
}

export const ProjectAvatar = ({ name, image, className, fallbackClassName }: ProjectAvatarProps) => {
    if (image) {
        return (
            <div className={cn('size-5 relative rounded-md overflow-hidden', className)}>
                <Image src={image} alt={name} fill className="object-cover" />
            </div>
        );
    }
    
    return (
        <Avatar className={cn('size-5 rounded-md', className)}>
            <AvatarFallback className={cn('text-white bg-blue-600 font-semibold text-sm uppercase rounded-md', fallbackClassName)}>
                { name[0] }
            </AvatarFallback>
        </Avatar>
    );
};