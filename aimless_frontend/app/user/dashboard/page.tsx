'use client';

import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/Globalcontext';
import { supabase } from '@/lib/supabase';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'to_do' | 'in_progress' | 'completed';
    project_id: string;
    assigned_to: string;
}

export default function UserTasks() {
    const { userdetails } = useGlobalContext();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editTaskId, setEditTaskId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        if (!userdetails?.id) return;

        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from('task')
                .select('*')
                .eq('assigned_to', userdetails.id);

            if (error) {
                console.error('Error fetching tasks:', error.message);
                setError(error.message);
            } else {
                setTasks(data || []);
            }

            setLoading(false);
        };

        fetchTasks();
    }, [userdetails?.id]);

    const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
        const { error } = await supabase
            .from('task')
            .update({ status: newStatus })
            .eq('id', taskId);

        if (error) {
            console.error('Failed to update task status:', error.message);
        } else {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
        }
    };

    const startEditing = (task: Task) => {
        setEditTaskId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
    };

    const handleTaskUpdate = async (taskId: string) => {
        const { error } = await supabase
            .from('task')
            .update({ title: editTitle, description: editDescription })
            .eq('id', taskId);

        if (error) {
            console.error('Error updating task:', error.message);
        } else {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, title: editTitle, description: editDescription } : task
                )
            );
            setEditTaskId(null);
        }
    };

    if (!userdetails) return <p className="text-gray-500">Fetching user info...</p>;
    if (loading) return <p className="text-gray-500">Loading tasks...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;
    if (tasks.length === 0) return <p className="text-gray-500">No tasks assigned to you.</p>;

    return (
        <div className="w-full mx-auto py-10 px-4 min-h-[80vh] h-full">
            <h2 className="text-3xl font-bold mb-6">My Assigned Tasks</h2>
            <div className="flex flex-col gap-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="p-4 border rounded-lg shadow-sm bg-white flex flex-col sm:flex-row justify-between gap-4"
                    >
                        <div className="flex-1">
                            {editTaskId === task.id ? (
                                <>
                                    <input
                                        className="w-full mb-2 px-3 py-1 border rounded"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                    <textarea
                                        className="w-full px-3 py-1 border rounded"
                                        rows={3}
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={() => handleTaskUpdate(task.id)}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditTaskId(null)}
                                            className="px-3 py-1 text-sm bg-gray-300 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                    <button
                                        onClick={() => startEditing(task)}
                                        className="text-sm text-blue-600 underline"
                                    >
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col justify-between text-xs">
                            <label className="text-gray-500 font-medium mb-1">Status:</label>
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                                className="text-sm border rounded px-2 py-1"
                            >
                                <option value="to_do">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
