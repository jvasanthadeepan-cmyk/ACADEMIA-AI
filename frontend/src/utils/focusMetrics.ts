import { FocusSession } from 'declarations/backend/backend.did';

export function calculateFocusMetrics(sessions: FocusSession[]): {
    dailyScore: number;
    streak: number;
    totalMinutes: number;
} {
    const now = Date.now();
    const todayStart = new Date(now).setHours(0, 0, 0, 0);
    const todayEnd = new Date(now).setHours(23, 59, 59, 999);

    // Calculate daily score (today's minutes)
    const todayMinutes = sessions
        .filter((s) => {
            const sessionTime = Number(s.date) / 1_000_000;
            return sessionTime >= todayStart && sessionTime <= todayEnd;
        })
        .reduce((sum, s) => sum + Number(s.duration), 0);

    const targetMinutes = 120; // 2 hours daily target
    const dailyScore = Math.min(100, Math.round((todayMinutes / targetMinutes) * 100));

    // Calculate streak (consecutive days with at least one session)
    let streak = 0;
    let checkDate = new Date(now);
    checkDate.setHours(0, 0, 0, 0);

    while (true) {
        const dayStart = checkDate.getTime();
        const dayEnd = new Date(checkDate).setHours(23, 59, 59, 999);

        const hasSession = sessions.some((s) => {
            const sessionTime = Number(s.date) / 1_000_000;
            return sessionTime >= dayStart && sessionTime <= dayEnd;
        });

        if (hasSession) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }

        // Limit to reasonable check (e.g., 365 days)
        if (streak > 365) break;
    }

    // Calculate total minutes this week
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const totalMinutes = sessions
        .filter((s) => {
            const sessionTime = Number(s.date) / 1_000_000;
            return sessionTime >= weekStart.getTime();
        })
        .reduce((sum, s) => sum + Number(s.duration), 0);

    return { dailyScore, streak, totalMinutes };
}
