import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAddFocusSession } from '../../hooks/useQueries';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const POMODORO_MINUTES = 25;
const POMODORO_SECONDS = POMODORO_MINUTES * 60;

export default function PomodoroTimer() {
    const [seconds, setSeconds] = useState(POMODORO_SECONDS);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const addSession = useAddFocusSession();

    useEffect(() => {
        if (isRunning && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        setIsCompleted(true);
                        handleComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, seconds]);

    const handleComplete = async () => {
        try {
            await addSession.mutateAsync({
                duration: BigInt(POMODORO_MINUTES),
                date: BigInt(Date.now() * 1_000_000),
            });
            toast.success('Pomodoro completed! Great work! 🎉');
        } catch (error) {
            toast.error('Failed to save session');
            console.error(error);
        }
    };

    const handleStart = () => {
        if (isCompleted) {
            setSeconds(POMODORO_SECONDS);
            setIsCompleted(false);
        }
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSeconds(POMODORO_SECONDS);
        setIsCompleted(false);
    };

    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    const progress = ((POMODORO_SECONDS - seconds) / POMODORO_SECONDS) * 100;

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-accent"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                        className="text-primary transition-all duration-1000"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl font-bold">
                            {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            {isCompleted ? 'Completed!' : isRunning ? 'Focus Time' : 'Ready'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                {!isRunning ? (
                    <Button onClick={handleStart} size="lg" className="gap-2">
                        <Play className="w-4 h-4" />
                        {isCompleted ? 'Start New' : 'Start'}
                    </Button>
                ) : (
                    <Button onClick={handlePause} size="lg" variant="secondary" className="gap-2">
                        <Pause className="w-4 h-4" />
                        Pause
                    </Button>
                )}
                <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </Button>
            </div>
        </div>
    );
}
