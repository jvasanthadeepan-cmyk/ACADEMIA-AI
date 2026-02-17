import { useState } from 'react';
import { useGetHabits, useAddHabit, useToggleHabit, useDeleteHabit } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Activity,
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
    Flame,
    Calendar as CalendarIcon,
    BarChart3,
    Sparkles,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, isSameDay, isAfter, subDays } from 'date-fns';

export default function HabitTrackerPage() {
    const { data: habits, isLoading } = useGetHabits();
    const addHabitMutation = useAddHabit();
    const toggleHabitMutation = useToggleHabit();
    const deleteHabitMutation = useDeleteHabit();

    const [newHabitName, setNewHabitName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Get last 7 days for the tracker header
    const today = new Date();
    const weekDays = [...Array(7)].map((_, i) => subDays(today, 6 - i));

    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;

        try {
            await addHabitMutation.mutateAsync({
                name: newHabitName.trim(),
                icon: 'Activity',
                color: 'primary',
            });
            setNewHabitName('');
            setIsCreating(false);
            toast.success('Habit added successfully!');
        } catch (error) {
            toast.error('Failed to add habit');
        }
    };

    const handleToggle = async (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        try {
            await toggleHabitMutation.mutateAsync({ id: habitId, date: dateStr });
        } catch (error) {
            toast.error('Failed to update habit');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this habit?')) {
            try {
                await deleteHabitMutation.mutateAsync(id);
                toast.success('Habit deleted');
            } catch (error) {
                toast.error('Failed to delete habit');
            }
        }
    };

    const calculateStreak = (completedDays: string[]) => {
        if (!completedDays.length) return 0;
        let streak = 0;
        let checkDate = new Date();

        while (true) {
            const dateStr = format(checkDate, 'yyyy-MM-dd');
            if (completedDays.includes(dateStr)) {
                streak++;
                checkDate = subDays(checkDate, 1);
            } else {
                // Check if today is missed but yesterday was complete
                if (streak === 0 && isSameDay(checkDate, new Date())) {
                    checkDate = subDays(checkDate, 1);
                    continue;
                }
                break;
            }
        }
        return streak;
    };

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Activity className="w-8 h-8 text-primary" />
                        Habit Tracker
                    </h1>
                    <p className="text-muted-foreground">Build consistency and master your routine</p>
                </div>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)} className="gap-2 shadow-soft">
                        <Plus className="w-4 h-4" />
                        New Habit
                    </Button>
                )}
            </div>

            {isCreating && (
                <Card className="animate-in slide-in-from-top-4 duration-300 shadow-soft-lg border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-sm">Create New Habit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddHabit} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="e.g., Read for 30 mins, Gym, Meditation..."
                                    value={newHabitName}
                                    onChange={(e) => setNewHabitName(e.target.value)}
                                    className="bg-background"
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" disabled={addHabitMutation.isPending}>
                                {addHabitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6">
                {habits?.length === 0 && !isCreating ? (
                    <Card className="p-12 text-center border-dashed bg-muted/20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold">No habits tracked yet</h3>
                                <p className="text-sm text-muted-foreground mt-1">Consistency is key. Start your first habit today!</p>
                            </div>
                            <Button onClick={() => setIsCreating(true)} variant="outline" className="mt-4">
                                Add First Habit
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {/* Tracker Header */}
                        <div className="hidden md:flex ml-[250px] justify-between px-4 pb-2">
                            {weekDays.map((day, i) => (
                                <div key={i} className="w-10 text-center flex flex-col items-center gap-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">{format(day, 'EEE')}</span>
                                    <span className={cn(
                                        "text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full",
                                        isSameDay(day, today) ? "bg-primary text-primary-foreground" : "bg-muted/50"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {habits?.map((habit) => {
                            const streak = calculateStreak(habit.completedDays);
                            return (
                                <Card key={habit.id} className="group overflow-hidden shadow-soft hover:shadow-soft-lg transition-all border-border/50">
                                    <div className="flex flex-col md:flex-row p-4 md:items-center gap-6">
                                        <div className="w-full md:w-[250px] flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                    <Activity className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-sm leading-tight">{habit.name}</h3>
                                                    <div className="flex items-center gap-1 text-orange-500">
                                                        <Flame className="w-3 h-3 fill-orange-500" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">{streak} Day Streak</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive h-8 w-8"
                                                onClick={() => handleDelete(habit.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="flex-1 flex justify-between px-2">
                                            {weekDays.map((day, i) => {
                                                const dateStr = format(day, 'yyyy-MM-dd');
                                                const isCompleted = habit.completedDays.includes(dateStr);
                                                return (
                                                    <div key={i} className="flex flex-col items-center gap-1">
                                                        <span className="md:hidden text-[10px] uppercase font-bold text-muted-foreground">{format(day, 'E')}</span>
                                                        <button
                                                            onClick={() => handleToggle(habit.id, day)}
                                                            className={cn(
                                                                "w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center transition-all duration-300",
                                                                isCompleted
                                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                                                    : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
                                                            )}
                                                        >
                                                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-5 h-5 opacity-20" />}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Monthly mini-chart placeholder */}
                                    <div className="h-1 bg-muted">
                                        <div
                                            className="h-full bg-primary transition-all duration-500"
                                            style={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
                                        />
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="text-primary" />
                        <h4 className="font-bold">Consistency</h4>
                    </div>
                    <p className="text-2xl font-black">
                        {habits?.length
                            ? Math.round((habits.reduce((acc, h) => acc + h.completedDays.length, 0) / (habits.length * 30)) * 100)
                            : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Combined monthly score</p>
                </Card>
                <Card className="bg-orange-500/5 border-orange-500/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Flame className="text-orange-500" />
                        <h4 className="font-bold text-orange-600">Best Streak</h4>
                    </div>
                    <p className="text-2xl font-black text-orange-600">
                        {habits?.length
                            ? Math.max(...habits.map(h => calculateStreak(h.completedDays)))
                            : 0} Days
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Keep the momentum going!</p>
                </Card>
                <Card className="bg-green-500/5 border-green-500/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="text-green-500" />
                        <h4 className="font-bold text-green-600">Habits Active</h4>
                    </div>
                    <p className="text-2xl font-black text-green-600">{habits?.length || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Daily routines in progress</p>
                </Card>
            </div>
        </div>
    );
}
