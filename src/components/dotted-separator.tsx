import { cn } from '@/lib/utils';

interface DottedSeparatorProps {
    className?: string;
    color?: string;
    height?: string;
    dotSize?: string;
    gapSize?: string;
    direction?: 'horizontal' | 'vertical';
}

/**
 * JC-2: DottedSeparator component.
 * 
 * A component that displays dotted lines horizontally.
 * 
 * @typedef {'horizontal' | 'vertical'} direction
 * 
 * @param {DottedSeparatorProps} props - The properties available for the component.
 * @param {string} [props.className] - The css class to apply on the component.
 * @param {string} [props.color='#d4d4d8'] - The color of the dots.
 * @param {string} [props.height='2px'] - The height of the line.
 * @param {string} [props.dotSize='2px'] - The size of the dots.
 * @param {string} [props.gapSize='6px'] - The gap size between the dots.
 * @param {direction} [props.direction='horizontal'] - The direction of the line.
 * 
 * @example
 * <DottedSeparator />
 * <DottedSeparator direction='vertical' />
 */

export const DottedSeparator = ({ className, color = '#d4d4d8', height = '2px', dotSize = '2px', gapSize = '6px', direction = 'horizontal' }: DottedSeparatorProps) => {
    const isHorizontal = direction === 'horizontal';
    
    return (
        <div className={cn(isHorizontal ? 'w-full flex items-center' : 'h-full flex flex-col items-center', className)}>
            <div className={isHorizontal ? 'flex-grow' : 'flex-grow-0'} style={{
                width: isHorizontal ? '100%' : height,
                height: isHorizontal ? height : '100%',
                backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
                backgroundSize: isHorizontal ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}` : `${height} ${parseInt(dotSize) + parseInt(gapSize)} px`,
                backgroundRepeat: isHorizontal ? 'repeat-x' : 'repeat-y',
                backgroundPosition: 'center'
            }} />
        </div>
    );
};