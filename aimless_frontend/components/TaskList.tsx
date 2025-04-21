'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateTaskModal from './CreateTaskModal';
import TaskCard from './TaskCard';
import { supabase } from '@/lib/supabase';
import { useGlobalContext } from '@/context/Globalcontext';

export interface Task {
    id: string;
    name: string;
    description: string;
    status: 'to_do' | 'in_progress' | 'completed';
    assigned_to: string;
    priority?: string;
}

interface TaskListProps {
    projectId: string;
}

export default function TaskList({ projectId }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [open, setOpen] = useState(false);
    const { allusers } = useGlobalContext(); // ✅ get users

    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from('task')
                .select('*')
                .eq('project_id', projectId);

            if (error) {
                console.error('Error fetching tasks:', error.message);
            } else {
                setTasks(data);
            }
        };

        fetchTasks();
    }, [projectId]);

    const handleCreate = async (task: Omit<Task, 'id'>) => {
        const { data, error } = await supabase
            .from('task')
            .insert({
                name: task.title,
                description: task.description,
                status: task.status,
                assigned_to: task.assignedTo,
                project_id: projectId,
                priority: task.priority,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating task:', error.message);
        } else {
            setTasks((prev) => [...prev, data]);
        }
    };

    const handleStatusChange = async (id: number, status: Task['status']) => {
        const { error } = await supabase
            .from('task')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating task status:', error.message);
        } else {
            setTasks((prev) =>
                prev.map((task) => (task.id === id ? { ...task, status } : task))
            );
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Tasks</h2>
                <Button onClick={() => setOpen(true)}>+ New Task</Button>
            </div>

            {tasks.length === 0 ? (
                <p className="text-muted-foreground">No tasks yet. Add some!</p>
            ) : (
                <ul className="grid gap-4">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            users={allusers}
                            onStatusChange={(status) => handleStatusChange(task.id, status)}
                        />
                    ))}
                </ul>
            )}

            <CreateTaskModal
                open={open}
                setOpen={setOpen}
                onCreate={handleCreate}
                projectId={projectId}
            />
        </div>
    );
}
