import { Loader } from 'lucide-react';

const StandaloneLoading = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
    )
};

export default StandaloneLoading;