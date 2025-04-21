'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateProjectModal from './CreateProjectModal';
import { supabase } from '@/lib/supabase';
import { useGlobalContext } from '@/context/Globalcontext';

export interface Project {
    id: string;
    name: string;
    description: string;
    deadline: string;
    priority: string;
    created_by: string;
}

export default function ProjectList() {
    const { userdetails, projects, setProjects } = useGlobalContext();
    const [openCreate, setOpenCreate] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);

    const getPriorityBadge = (priority: string) => {
        const base = "text-xs font-semibold px-2 py-1 rounded-full";
        switch (priority) {
            case 'High':
                return `${base} bg-red-100 text-red-700`;
            case 'Medium':
                return `${base} bg-yellow-100 text-yellow-700`;
            case 'Low':
                return `${base} bg-green-100 text-green-700`;
            default:
                return `${base} bg-gray-200 text-gray-800`;
        }
    };

    const sender = userdetails?.id;

    const handleAddProject = async (project: Project) => {
        const { data, error } = await supabase
            .from('project')
            .insert({
                name: project.name,
                description: project.description,
                deadline: project.deadline,
                priority: project.priority,
                created_by: sender,
            })
            .select()
            .single();

        if (error) {
            console.error('Error inserting project:', error);
        } else {
            setProjects([...projects, data]);
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('project').delete().eq('id', id);
        if (error) {
            console.error('Delete error:', error.message);
        } else {
            setProjects(projects.filter((p) => p.id !== id));
        }
    };

    const handleUpdateProject = async (updated: Project) => {
        const { error } = await supabase
            .from('project')
            .update({
                name: updated.name,
                description: updated.description,
                deadline: updated.deadline,
                priority: updated.priority,
            })
            .eq('id', updated.id);

        if (error) {
            console.error('Update error:', error.message);
        } else {
            setProjects((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
            );
        }

        setEditProject(null);
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <Button onClick={() => setOpenCreate(true)}>+ New Project</Button>
            </div>

            {projects.length === 0 ? (
                <p className="text-muted-foreground">No projects yet. Create one!</p>
            ) : (
                <ul className="grid gap-4">
                    {projects.map((proj) => (
                        <li
                            key={proj.id}
                            className="border rounded-lg p-4 hover:bg-muted/20 transition flex justify-between items-start"
                        >
                            <div>
                                <a href={`/manager/projects/${proj.id}`} className="block">
                                    <h3 className="text-lg font-medium">{proj.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {proj.description || 'No description'}
                                    </p>
                                    <p className="text-xs mt-1 flex items-center gap-2">
                                        <span>Deadline: {proj.deadline}</span>
                                        <span className={getPriorityBadge(proj.priority)}>{proj.priority}</span>
                                    </p>
                                </a>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditProject(proj)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(proj.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <CreateProjectModal
                open={openCreate}
                setOpen={setOpenCreate}
                onCreate={handleAddProject}
            />

            {editProject && (
                <CreateProjectModal
                    open={!!editProject}
                    setOpen={() => setEditProject(null)}
                    onCreate={handleUpdateProject}
                    project={editProject}
                    isEdit
                />
            )}
        </div>
    );
}
