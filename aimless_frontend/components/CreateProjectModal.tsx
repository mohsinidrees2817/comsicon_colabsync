'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Project } from './ProjectList';
import { supabase } from '@/lib/supabase';

export default function CreateProjectModal({
    open,
    setOpen,
    onCreate,
    project,
    isEdit = false,
}: {
    open: boolean;
    setOpen: (val: boolean) => void;
    onCreate: (project: Project) => void;
    project?: Project;
    isEdit?: boolean;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description);
            setDeadline(project.deadline);
            setPriority(project.priority);
        } else {
            setName('');
            setDescription('');
            setDeadline('');
            setPriority('Medium');
        }
    }, [project]);

    const handleSubmit = () => {
        if (!name.trim()) return;

        const updated: Project = {
            id: project?.id || '',
            name,
            description,
            deadline,
            priority,
        };

        onCreate(updated);
        setOpen(false);
        setName('');
        setDescription('');
        setDeadline('');
        setPriority('Medium');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Project Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Textarea
                        placeholder="Project Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Deadline</label>
                        <Input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                            className="border rounded px-3 py-2 text-sm"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <Button onClick={handleSubmit} className="self-end">
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
