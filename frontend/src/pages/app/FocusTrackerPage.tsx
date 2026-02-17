import { useGetFocusSessions, useAddFocusSession } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PomodoroTimer from '../../components/focus/PomodoroTimer';
import WeeklyProductivityMiniChart from '../../components/charts/WeeklyProductivityMiniChart';
import { calculateFocusMetrics } from '../../utils/focusMetrics';
import { Timer, TrendingUp, Flame } from 'lucide-react';
import { useMemo } from 'react';

export default function FocusTrackerPage() {
    const { data: sessions, isLoading } = useGetFocusSessions();

    const metrics = useMemo(() => {
        if (!sessions) return { dailyScore: 0, streak: 0, totalMinutes: 0 };
        return calculateFocusMetrics(sessions);
    }, [sessions]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Timer className="w-8 h-8 text-primary" />
                    Focus Tracker
                </h1>
                <p className="text-muted-foreground">Track your study sessions and build productive habits</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-soft border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Daily Focus Score</CardTitle>
                        <TrendingUp className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metrics.dailyScore}%</div>
                        <p className="text-xs text-muted-foreground mt-2">Based on today's sessions</p>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <Flame className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metrics.streak}</div>
                        <p className="text-xs text-muted-foreground mt-2">Consecutive days</p>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Time</CardTitle>
                        <Timer className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metrics.totalMinutes}</div>
                        <p className="text-xs text-muted-foreground mt-2">Minutes this week</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-soft-lg border-border/50">
                    <CardHeader>
                        <CardTitle>Pomodoro Timer</CardTitle>
                        <CardDescription>25-minute focus sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PomodoroTimer />
                    </CardContent>
                </Card>

                <Card className="shadow-soft-lg border-border/50">
                    <CardHeader>
                        <CardTitle>Weekly Productivity</CardTitle>
                        <CardDescription>Your focus time over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WeeklyProductivityMiniChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
