import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetStudyTasks, useGetTaskSummary } from '../../hooks/useQueries';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { useMemo } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
    const { data: tasks, isLoading: tasksLoading } = useGetStudyTasks();
    const { data: taskSummary } = useGetTaskSummary();

    const subjectDistribution = useMemo(() => {
        if (!tasks) return [];
        const distribution: Record<string, number> = {};
        tasks.forEach(task => {
            distribution[task.subject] = (distribution[task.subject] || 0) + 1;
        });
        return Object.entries(distribution).map(([name, value]) => ({ name, value }));
    }, [tasks]);

    const completionStatus = useMemo(() => {
        if (!tasks) return [];
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.length - completed;
        return [
            { name: 'Completed', value: completed },
            { name: 'Pending', value: pending }
        ];
    }, [tasks]);

    // Mock productivity data - in a real app this would come from backend
    const weeklyProductivity = [
        { name: 'Mon', hours: 4 },
        { name: 'Tue', hours: 5.5 },
        { name: 'Wed', hours: 3 },
        { name: 'Thu', hours: 6 },
        { name: 'Fri', hours: 4.5 },
        { name: 'Sat', hours: 7 },
        { name: 'Sun', hours: 2 },
    ];

    if (tasksLoading) {
        return <div className="p-8">Loading analytics...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            <div>
                <h1 className="text-3xl font-bold">Analytics & Insights</h1>
                <p className="text-muted-foreground">Deep dive into your academic performance</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-soft border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{tasks?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{taskSummary?.completionPercentage.toFixed(1) || 0}%</div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{subjectDistribution.length}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Focus Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">32.5</div>
                        <p className="text-xs text-muted-foreground">This week</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-soft border-border/50">
                    <CardHeader>
                        <CardTitle>Task Distribution by Subject</CardTitle>
                        <CardDescription>Which subjects have the most tasks?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={subjectDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {subjectDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50">
                    <CardHeader>
                        <CardTitle>Task Completion Status</CardTitle>
                        <CardDescription>Completed vs Pending Tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={completionStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell key="cell-completed" fill="#00C49F" />
                                    <Cell key="cell-pending" fill="#FF8042" />
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-soft border-border/50">
                <CardHeader>
                    <CardTitle>Weekly Study Hours</CardTitle>
                    <CardDescription>Hours spent studying per day</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={weeklyProductivity}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
