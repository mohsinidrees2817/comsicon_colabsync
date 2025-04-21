// app/manager/projects/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import TaskList from '@/components/TaskList';

export default function ProjectPage() {
    const params = useParams();
    const { id } = params;

    if (!id || typeof id !== 'string') return <p>Invalid project ID.</p>;

    return (
        <div className="w-full max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Project Tasks</h1>
            <TaskList projectId={id} />
        </div>
    );
}