import { Task } from './TaskList';

interface User {
    id: string;
    username: string;
}

interface TaskCardProps {
    task: Task;
    users: User[];
    onStatusChange: (status: Task['status']) => void;
}

export default function TaskCard({ task, users, onStatusChange }: TaskCardProps) {
    const assignedUser = users.find((user) => user.id === task.assigned_to);

    return (
        <li className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-medium">{task.name}</h4>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <p className="text-xs mt-1 text-gray-500">
                        Assigned to: {assignedUser?.username || 'Unknown'}
                    </p>
                </div>
                {/* <select
                    value={task.status}
                    onChange={(e) => onStatusChange(e.target.value as Task['status'])}
                    className="text-sm border rounded px-2 py-1"
                >
                    <option value="to_do">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select> */}
                <p className='flexx justify-center items-center flex-col mt-4'>{task.status}</p>
            </div>
        </li>
    );
}
