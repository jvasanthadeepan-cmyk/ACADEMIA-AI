import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddStudyTask } from '../../hooks/useQueries';
import type { StudyTask } from 'declarations/backend/backend.did';
import { TaskStatus } from 'declarations/backend/backend.did';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface StudyTaskFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function StudyTaskForm({ open, onOpenChange }: StudyTaskFormProps) {
    const addTask = useAddStudyTask();
    const [formData, setFormData] = useState({
        subject: '',
        topic: '',
        deadline: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const deadlineDate = new Date(formData.deadline);
            await addTask.mutateAsync({
                subject: formData.subject,
                topic: formData.topic,
                deadline: BigInt(deadlineDate.getTime() * 1_000_000),
                status: TaskStatus.pending,
            });
            toast.success('Task added successfully!');
            setFormData({ subject: '', topic: '', deadline: '' });
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to add task');
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Study Task</DialogTitle>
                    <DialogDescription>Create a new task for your study schedule</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                            id="subject"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="e.g., Mathematics"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic *</Label>
                        <Input
                            id="topic"
                            required
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            placeholder="e.g., Calculus Chapter 3"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline *</Label>
                        <Input
                            id="deadline"
                            type="date"
                            required
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={addTask.isPending}>
                            {addTask.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add Task'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
