import { useGetFocusSessions } from '../../hooks/useQueries';
import { useMemo } from 'react';

interface DayData {
    day: string;
    minutes: number;
}

export default function WeeklyProductivityMiniChart() {
    const { data: sessions } = useGetFocusSessions();

    const weeklyData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const now = new Date();
        const data: DayData[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const dayMinutes = (sessions || [])
                .filter((s) => {
                    const sessionTime = Number(s.date) / 1_000_000;
                    return sessionTime >= date.getTime() && sessionTime < nextDay.getTime();
                })
                .reduce((sum, s) => sum + Number(s.duration), 0);

            data.push({
                day: days[date.getDay()],
                minutes: dayMinutes,
            });
        }

        return data;
    }, [sessions]);

    const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1);

    return (
        <div className="space-y-4">
            <div className="flex items-end justify-between gap-2 h-32">
                {weeklyData.map((day, idx) => {
                    const height = (day.minutes / maxMinutes) * 100;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-accent rounded-t-lg relative" style={{ height: `${height}%`, minHeight: '4px' }}>
                                <div className="absolute inset-0 bg-primary rounded-t-lg" style={{ height: '100%' }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{day.day}</span>
                        </div>
                    );
                })}
            </div>
            <div className="text-center text-sm text-muted-foreground">
                Total: {weeklyData.reduce((sum, d) => sum + d.minutes, 0)} minutes this week
            </div>
        </div>
    );
}
