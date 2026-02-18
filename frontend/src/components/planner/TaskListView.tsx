import { useState, useMemo } from 'react';
import type { StudyTask } from 'declarations/backend/backend.did';
import { TaskStatus } from 'declarations/backend/backend.did';
import { useUpdateStudyTask, useDeleteStudyTask } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaskListViewProps {
    tasks: StudyTask[];
}

export default function TaskListView({ tasks }: TaskListViewProps) {
    const [filterSubject, setFilterSubject] = useState<string>('all');
    const updateTask = useUpdateStudyTask();
    const deleteTask = useDeleteStudyTask();

    const subjects = useMemo(() => {
        const uniqueSubjects = Array.from(new Set(tasks.map((t) => t.subject)));
        return uniqueSubjects;
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        if (filterSubject === 'all') return tasks;
        return tasks.filter((t) => t.subject === filterSubject);
    }, [tasks, filterSubject]);

    const handleToggleComplete = async (task: StudyTask) => {
        if (task.id === undefined) {
            toast.error('Task ID missing');
            return;
        }
        try {
            const newStatus = task.status === TaskStatus.completed ? TaskStatus.pending : TaskStatus.completed;
            await updateTask.mutateAsync({
                id: task.id,
                task: { ...task, status: newStatus },
            });
            toast.success(newStatus === TaskStatus.completed ? 'Task completed!' : 'Task marked as pending');
        } catch (error) {
            toast.error('Failed to update task');
            console.error(error);
        }
    };

    const handleDelete = async (id: bigint | undefined) => {
        if (id === undefined) {
            toast.error('Task ID missing');
            return;
        }
        try {
            await deleteTask.mutateAsync(id);
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
            console.error(error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Filter by subject:</Label>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                                {subject}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {filteredTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No tasks found. Add your first task to get started!</p>
            ) : (
                <div className="space-y-2">
                    {filteredTasks.map((task, idx) => {
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-colors"
                            >
                                <Checkbox
                                    checked={task.status === TaskStatus.completed}
                                    onCheckedChange={() => handleToggleComplete(task)}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium ${task.status === TaskStatus.completed ? 'line-through text-muted-foreground' : ''}`}>
                                        {task.topic}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{task.subject}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Due: {(() => {
                                            const d = task.deadline;
                                            if (!d) return 'No date';
                                            // Handle nanosecond timestamps (BigInt/string)
                                            if (/^\d+$/.test(d.toString())) {
                                                return new Date(Number(d) / 1_000_000).toLocaleDateString();
                                            }
                                            // Handle standard date strings (YYYY-MM-DD)
                                            const date = new Date(d);
                                            return date.toString() !== 'Invalid Date' ? date.toLocaleDateString() : 'Invalid Date';
                                        })()}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <span className={className}>{children}</span>;
}
