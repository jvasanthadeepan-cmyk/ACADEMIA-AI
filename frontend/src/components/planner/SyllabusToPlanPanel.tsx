import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddStudyTask } from '../../hooks/useQueries';
import { generateStudyPlan } from '../../utils/localPlanner';
import type { StudyTask } from 'declarations/backend/backend.did';
import { TaskStatus } from 'declarations/backend/backend.did';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SyllabusToPlanPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SyllabusToPlanPanel({ open, onOpenChange }: SyllabusToPlanPanelProps) {
    const addTask = useAddStudyTask();
    const [syllabusText, setSyllabusText] = useState('');
    const [subject, setSubject] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!syllabusText.trim() || !subject.trim() || !startDate || !endDate) {
            toast.error('Please fill in all fields');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            toast.error('End date must be after start date');
            return;
        }

        setIsGenerating(true);
        try {
            const plan = generateStudyPlan(syllabusText, start, end);

            for (const task of plan) {
                await addTask.mutateAsync({
                    subject,
                    topic: task.topic,
                    deadline: (BigInt(task.deadline.getTime()) * BigInt(1_000_000)).toString(),
                    status: TaskStatus.pending,
                });
            }

            toast.success(`Generated ${plan.length} study tasks!`);
            setSyllabusText('');
            setSubject('');
            setStartDate('');
            setEndDate('');
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate plan');
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Generate Study Plan</DialogTitle>
                    <DialogDescription>
                        Enter your syllabus and we'll create a structured daily study plan for you
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g., Data Structures"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="syllabus">Syllabus Content *</Label>
                        <Textarea
                            id="syllabus"
                            value={syllabusText}
                            onChange={(e) => setSyllabusText(e.target.value)}
                            placeholder="Paste your syllabus here... (e.g., Arrays, Linked Lists, Trees, Graphs, Sorting Algorithms)"
                            rows={6}
                            className="resize-none"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date *</Label>
                            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
                            Cancel
                        </Button>
                        <Button onClick={handleGenerate} disabled={isGenerating}>
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate Plan'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
