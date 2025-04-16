import { VariantProps } from 'class-variance-authority';
import { JSX, useState } from 'react';

import { ResponsiveModal } from '@/components/responsive-modal';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * JC-15: Displays a dynamic confirmation dialog.
 * 
 * @param title - Dialog title.
 * @param message - Dialog description.
 * @param variant - The variant of the confirm button.
 * @returns An array of JSX.Element (the dialog) and a Promise (confirm method)
 * 
 * @example
 * const [DeleteDialog, confirmDelete] = useConfirm('Delete Workspace', 'This action cannot be undone', 'destructive');
 */

export const useConfirm = (title: string, message: string, variant: VariantProps<typeof buttonVariants>['variant'] = 'primary'): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);
    
    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({ resolve });
        });
    };
    
    const handleClose = () => {
        setPromise(null);
    };
    
    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };
    
    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };
    
    const ConfirmationDialog = () => (
        <ResponsiveModal open={promise != null} onOpenChange={handleClose}>
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader>
                    <CardTitle>{ title }</CardTitle>
                    <CardDescription>{ message }</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                        <Button className="w-full lg:w-auto" variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button className="w-full lg:w-auto" variant={variant} onClick={handleConfirm}>Confirm</Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModal>
    );
    
    return [ConfirmationDialog, confirm];
};