import { PropsWithChildren } from 'react';
import { useMedia } from 'react-use';

import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from './ui/drawer';

/**
 * JC-11: Responsive Modal.
 * Open the child component in a dialog when on desktop view; otherwise open the child component in a drawer.
 * 
 * @param {ResponsiveModalProps} props - Component properties.
 * @param {boolean} props.open - Flag indicates the dialog or drawer should be opened or closed.
 * @param {void} props.onOpenChange - Custom method to execute when dialog is opened / closed.
 * 
 * @example
 * <ResponsiveModal open={true} onOpenChange=(() => {}) />
 */

interface ResponsiveModalProps extends PropsWithChildren {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({ children, open, onOpenChange }: ResponsiveModalProps) => {
    const isDesktop = useMedia('(min-width: 1024px)', true);
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="hide-scrollbar w-full sm:max-w-lg p-0 border-none overflow-y-auto max-h-[85vh]">
                    {/* Add empty <DialogTitle> to solve error */}
                    <DialogTitle className="hidden"></DialogTitle>
                    { children }
                </DialogContent>
            </Dialog>
        );
    }
    
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                {/* Add empty <DrawerTitle> to solve error */}
                <DrawerTitle className="hidden"></DrawerTitle>
                <div className="hide-scrollbar overflow-y-auto max-h-[85vh]">
                    { children }
                </div>
            </DrawerContent>
        </Drawer>
    );
};