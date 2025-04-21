'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './TaskList';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { useGlobalContext } from '@/context/Globalcontext';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface User {
    id: string;
    username: string;
    role: string;
}

export default function CreateTaskModal({
    open,
    setOpen,
    onCreate,
    projectId,
}: {
    open: boolean;
    setOpen: (val: boolean) => void;
    onCreate: (task: Task) => void;
    projectId: string;
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [priority, setPriority] = useState('Low');
    const { allusers, userdetails } = useGlobalContext();


    const handleSubmit = () => {
        if (!title.trim() || !assignedTo) return;

        const newTask: Task = {
            id: userdetails?.id, // use user ID or generate a new one
            title,
            description,
            assignedTo, // this is now the user ID
            priority,
            status: 'to_do',
        };

        onCreate(newTask);
        setTitle('');
        setDescription('');
        setAssignedTo('');
        setOpen(false);
        setPriority('Low');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                            <SelectValue placeholder="Assign priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>

                    </Select>
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                        <SelectTrigger>
                            <SelectValue placeholder="Assign to user" />
                        </SelectTrigger>
                        <SelectContent>
                            {allusers.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.username}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                    <Button onClick={handleSubmit} className="self-end">
                        Create Task
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
