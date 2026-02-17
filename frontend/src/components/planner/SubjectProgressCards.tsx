import { useMemo } from 'react';
import type { StudyTask } from 'declarations/backend/backend.did';
import { TaskStatus } from 'declarations/backend/backend.did';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SubjectProgressCardsProps {
    tasks: StudyTask[];
}

export default function SubjectProgressCards({ tasks }: SubjectProgressCardsProps) {
    const subjectProgress = useMemo(() => {
        const subjects = new Map<string, { total: number; completed: number }>();

        tasks.forEach((task) => {
            const current = subjects.get(task.subject) || { total: 0, completed: 0 };
            current.total++;
            if (task.status === TaskStatus.completed) {
                current.completed++;
            }
            subjects.set(task.subject, current);
        });

        return Array.from(subjects.entries()).map(([subject, stats]) => ({
            subject,
            ...stats,
            percentage: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
        }));
    }, [tasks]);

    if (subjectProgress.length === 0) {
        return null;
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectProgress.map((subject) => (
                <Card key={subject.subject} className="shadow-soft border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{subject.subject}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{Math.round(subject.percentage)}%</span>
                        </div>
                        <Progress value={subject.percentage} />
                        <p className="text-xs text-muted-foreground">
                            {subject.completed} of {subject.total} tasks completed
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
