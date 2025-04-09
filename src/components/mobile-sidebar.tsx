'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MenuIcon } from 'lucide-react';

import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Sidebar } from './sidebar';

/**
 * JC-6: Mobile sidebar component.
 * 
 * @example
 * <MobileSidebar />
 */

export const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);
    
    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="secondary" className="lg:hidden" size="icon">
                    <MenuIcon className="size-4 text-neutral-500" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
};