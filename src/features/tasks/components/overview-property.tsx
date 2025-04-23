import { PropsWithChildren } from 'react';

interface OverviewPropertyProps extends PropsWithChildren {
    label: string;
}

/**
 * JC-29: Component that displays a labeled property value in a consistent layout
 * 
 * @param {OverviewPropertyProps} props - Component properties.
 * @param {string} props.label - The label of the component.
 * @param {ReactNode} [props.children] - The children components to be displayed.
 * 
 * @example
 * <OverviewProperty label="Created">
 *      <span>October 15, 2023</span>
 * </OverviewProperty>
 */

export const OverviewProperty = ({ label, children }: OverviewPropertyProps) => {
    return (
        <div className="flex items-center gap-x-2">
            <div className="min-w-[100px]">
                <p className="text-sm text-muted-foreground">{ label }</p>
            </div>
            <div className="flex items-center gap-x-2">{ children }</div>
        </div>
    );
};