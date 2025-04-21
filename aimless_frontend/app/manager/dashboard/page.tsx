// app/manager/dashboard/page.tsx
'use client';

import ProjectList from '@/components/ProjectList';

export default function DashboardPage() {
    return (
        <div className="w-full max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
            <ProjectList />
        </div>
    );
}


