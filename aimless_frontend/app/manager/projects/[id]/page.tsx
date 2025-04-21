'use client';

import { useParams } from 'next/navigation';
import TaskList from '@/components/TaskList';
import Chat from '@/components/Chat';
import { useGlobalContext } from '@/context/Globalcontext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function ProjectPage() {
    const { userdetails, projects, setProjects } = useGlobalContext();
    const [currentProject, setCurrentProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [avgTime, setAvgTime] = useState<number | null>(null);
    const [completionRate, setCompletionRate] = useState(0);
    const params = useParams();
    const { id } = params;

    const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // green, yellow, red

    useEffect(() => {
        if (!id || typeof id !== 'string') return;

        const found = projects.find((p) => p.id === id);
        if (found) {
            setCurrentProject(found);
        } else {
            const fetchProject = async () => {
                const { data } = await supabase.from('project').select('*').eq('id', id).single();
                if (data) {
                    setCurrentProject(data);
                    setProjects((prev) => [...prev, data]);
                }
            };
            fetchProject();
        }

        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from('task')
                .select('*')
                .eq('project_id', id);

            if (!error && data) {
                setTasks(data);

                // Task completion rate
                const completed = data.filter((task) => task.status === 'completed').length;
                setCompletionRate(data.length ? (completed / data.length) * 100 : 0);

                // Average time
                const totalTime = data.reduce((acc, curr) => acc + (curr.time_taken || 0), 0);
                setAvgTime(data.length ? totalTime / data.length : null);
            }
        };

        fetchTasks();
    }, [id]);

    const taskStatusData = [
        { name: 'To Do', value: tasks.filter(t => t.status === 'to_do').length },
        { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
        { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
    ];

    if (!id || typeof id !== 'string') return <p>Invalid project ID.</p>;

    return (
        <div className="w-full mx-auto py-10 px-4">
            {currentProject && (
                <>
                    <h1 className="text-3xl font-bold mb-4">Project Workspace: {currentProject.name}</h1>
                    <div className="bg-white border-b border-t p-4 shadow-sm mb-6">
                        <p className="text-sm mt-2 text-gray-500">
                            Deadline: {currentProject.deadline} | Priority:{' '}
                            <span className="font-semibold">{currentProject.priority}</span>
                        </p>
                    </div>
                </>
            )}

            {/* Dashboard */}


            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row gap-8 w-full">
                <div className="w-full">
                    <TaskList projectId={id} />
                </div>

                <div className="w-full max-w-[350px] border rounded-lg shadow-sm p-4 bg-white h-[600px] flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">Project Chat</h2>
                    <Chat projectId={id} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-semibold mb-2">Task Completion Rate</h2>
                    <p className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-semibold mb-2">Avg. Time per Task</h2>
                    <p className="text-2xl font-bold text-blue-600">
                        {avgTime !== null ? `${avgTime.toFixed(1)} hrs` : 'N/A'}
                    </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow col-span-1 md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Task Status Breakdown</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={taskStatusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                {taskStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
