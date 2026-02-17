import { useMemo } from 'react';
import type { StudyTask } from 'declarations/backend/backend.did';

interface TaskCalendarViewProps {
    tasks: StudyTask[];
}

export default function TaskCalendarView({ tasks }: TaskCalendarViewProps) {
    const calendarData = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (number | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return { days, month, year };
    }, []);

    const getTasksForDay = (day: number | null) => {
        if (!day) return [];
        const targetDate = new Date(calendarData.year, calendarData.month, day);
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        return tasks.filter((task) => {
            const d = task.deadline;
            if (!d) return false;

            let taskTime: number;
            if (/^\d+$/.test(d.toString())) {
                taskTime = Number(d) / 1_000_000;
            } else {
                taskTime = new Date(d).getTime();
            }

            return taskTime >= targetDate.getTime() && taskTime < nextDay.getTime();
        });
    };

    const monthName = new Date(calendarData.year, calendarData.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">{monthName}</h3>
            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                        {day}
                    </div>
                ))}
                {calendarData.days.map((day, idx) => {
                    const dayTasks = getTasksForDay(day);
                    return (
                        <div
                            key={idx}
                            className={`min-h-24 p-2 rounded-lg border ${day ? 'border-border/50 bg-card hover:bg-accent/50' : 'border-transparent'
                                } transition-colors`}
                        >
                            {day && (
                                <>
                                    <div className="text-sm font-medium mb-1">{day}</div>
                                    <div className="space-y-1">
                                        {dayTasks.slice(0, 2).map((task, taskIdx) => (
                                            <div key={taskIdx} className="text-xs p-1 rounded bg-primary/10 text-primary truncate">
                                                {task.topic}
                                            </div>
                                        ))}
                                        {dayTasks.length > 2 && (
                                            <div className="text-xs text-muted-foreground">+{dayTasks.length - 2} more</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
