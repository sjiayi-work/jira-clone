import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';

/**
 * JC-29: Task list page.
 * Accessible via URL: `/workspaces/[workspaceId]/tasks`
 */

const TasksPage = async () => {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }
    
    return (
        <div className="h-full flex flex-col">
            <TaskViewSwitcher />
        </div>
    );
};

export default TasksPage;