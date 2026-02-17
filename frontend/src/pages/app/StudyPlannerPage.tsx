import { useState, useMemo } from 'react';
import { useGetStudyTasks, useAddStudyTask, useUpdateStudyTask, useDeleteStudyTask } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import StudyTaskForm from '../../components/planner/StudyTaskForm';
import TaskListView from '../../components/planner/TaskListView';
import TaskCalendarView from '../../components/planner/TaskCalendarView';
import SubjectProgressCards from '../../components/planner/SubjectProgressCards';
import SyllabusToPlanPanel from '../../components/planner/SyllabusToPlanPanel';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudyPlannerPage() {
    const { data: tasks, isLoading } = useGetStudyTasks();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showSyllabusPanel, setShowSyllabusPanel] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Study Planner</h1>
                    <p className="text-muted-foreground">Organize your study schedule and track progress</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowSyllabusPanel(true)} variant="outline">
                        Generate Plan
                    </Button>
                    <Button onClick={() => setShowTaskForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </div>
            </div>

            <SubjectProgressCards tasks={tasks || []} />

            <Card className="shadow-soft border-border/50">
                <CardHeader>
                    <CardTitle>Your Study Tasks</CardTitle>
                    <CardDescription>View and manage your study schedule</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="list" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="list">
                                <List className="w-4 h-4 mr-2" />
                                List View
                            </TabsTrigger>
                            <TabsTrigger value="calendar">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Calendar View
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="list" className="mt-6">
                            <TaskListView tasks={tasks || []} />
                        </TabsContent>
                        <TabsContent value="calendar" className="mt-6">
                            <TaskCalendarView tasks={tasks || []} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <StudyTaskForm open={showTaskForm} onOpenChange={setShowTaskForm} />
            <SyllabusToPlanPanel open={showSyllabusPanel} onOpenChange={setShowSyllabusPanel} />
        </div>
    );
}
