import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

/**
 * JC-18: Member Avatar component.
 * Displays the initial character of the member names.
 * 
 * @param {MemberAvatarProps} props - Component properties.
 * @param {string} props.name - The workspace name.
 * @param {string} [props.className] - CSS class to be applied on `<Avatar />` element.
 * @param {string} [props.fallbackClassName] - CSS class to be applied on `<AvatarFallback />` element.
 * 
 * @example
 * <MemberAvatar name="anthonio" />
 * <MemberAvatar name="John" className="size-10" fallbackClassName="text-lg" />
 */

interface MemberAvatarProps {
    name: string;
    className?: string;
    fallbackClassName?: string;
}

export const MemberAvatar = ({ name, className, fallbackClassName }: MemberAvatarProps) => {
    return (
        <Avatar className={cn('size-5 transition border border-neutral-300', className)}>
            <AvatarFallback className={cn('bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center', fallbackClassName)}>
                { name.charAt(0).toUpperCase() }
            </AvatarFallback>
        </Avatar>
    );
};