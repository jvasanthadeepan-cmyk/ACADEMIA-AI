import { useGetDashboardData, useGetStudyTasks, useGetTaskSummary } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, TrendingUp, Calendar } from 'lucide-react';
import QuickAskCard from '../../components/assistant/QuickAskCard';
import WeeklyProductivityMiniChart from '../../components/charts/WeeklyProductivityMiniChart';
import { useMemo } from 'react';

export default function DashboardPage() {
    const { data: dashboardData, isLoading: dashboardLoading } = useGetDashboardData();
    const { data: tasks, isLoading: tasksLoading } = useGetStudyTasks();
    const { data: taskSummary } = useGetTaskSummary();

    const todayTasks = useMemo(() => {
        if (!tasks) return [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return tasks.filter((task) => {
            const taskDate = new Date(Number(task.deadline) / 1_000_000);
            return taskDate >= today && taskDate < tomorrow;
        });
    }, [tasks]);

    const upcomingExams = useMemo(() => {
        if (!tasks) return [];
        const now = Date.now();
        const twoWeeks = 14 * 24 * 60 * 60 * 1000;

        return tasks
            .filter((task) => {
                const taskTime = Number(task.deadline) / 1_000_000;
                return taskTime > now && taskTime < now + twoWeeks;
            })
            .sort((a, b) => Number(a.deadline) - Number(b.deadline))
            .slice(0, 5);
    }, [tasks]);

    const focusScore = useMemo(() => {
        if (!dashboardData?.focusStats) return 0;
        const { totalTime } = dashboardData.focusStats;
        const targetMinutes = 120; // 2 hours daily target
        const score = Math.min(100, (Number(totalTime) / targetMinutes) * 100);
        return Math.round(score);
    }, [dashboardData]);

    if (dashboardLoading || tasksLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {dashboardData?.profile?.fullName || 'Student'}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-soft border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
                        <TrendingUp className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{focusScore}%</div>
                        <Progress value={focusScore} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">Daily productivity target</p>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{todayTasks.length}</div>
                        <p className="text-xs text-muted-foreground mt-2">Tasks due today</p>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Clock className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{taskSummary?.completionPercentage.toFixed(0) || 0}%</div>
                        <p className="text-xs text-muted-foreground mt-2">Overall progress</p>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <Calendar className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{Number(taskSummary?.totalTasks || 0)}</div>
                        <p className="text-xs text-muted-foreground mt-2">Active study tasks</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Today's Tasks */}
                <Card className="shadow-soft border-border/50">
                    <CardHeader>
                        <CardTitle>Today's Study Tasks</CardTitle>
                        <CardDescription>Tasks scheduled for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {todayTasks.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No tasks due today. Great job!</p>
                        ) : (
                            <div className="space-y-3">
                                {todayTasks.map((task, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                                        <CheckCircle2
                                            className={`w-5 h-5 mt-0.5 ${
                                                task.status === 'completed' ? 'text-primary' : 'text-muted-foreground'
                                            }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{task.topic}</p>
                                            <p className="text-xs text-muted-foreground">{task.subject}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Exams */}
                <Card className="shadow-soft border-border/50">
                    <CardHeader>
                        <CardTitle>Upcoming Exams</CardTitle>
                        <CardDescription>Deadlines in the next 2 weeks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {upcomingExams.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No upcoming deadlines</p>
                        ) : (
                            <div className="space-y-3">
                                {upcomingExams.map((task, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                                        <Calendar className="w-5 h-5 mt-0.5 text-primary" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{task.topic}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(Number(task.deadline) / 1_000_000).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Weekly Productivity */}
                <Card className="shadow-soft border-border/50">
                    <CardHeader>
                        <CardTitle>Weekly Productivity</CardTitle>
                        <CardDescription>Your focus time over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WeeklyProductivityMiniChart />
                    </CardContent>
                </Card>

                {/* Quick Ask */}
                <QuickAskCard />
            </div>
        </div>
    );
}
