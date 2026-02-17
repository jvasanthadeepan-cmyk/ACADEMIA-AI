import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Brain, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

interface ChatThreadProps {
    messages: ChatMessage[];
}

export default function ChatThread({ messages }: ChatThreadProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const formatDate = (timestamp: string) => {
        try {
            if (/^\d+$/.test(timestamp)) {
                return new Date(Number(timestamp) / 1_000_000).toLocaleString();
            }
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return 'Just now';
            return date.toLocaleString();
        } catch (e) {
            return 'Just now';
        }
    };

    if (!messages || messages.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Brain className="w-12 h-12 mb-4" />
                <p className="text-sm">No messages yet. Start your academic journey!</p>
            </div>
        );
    }

    return (
        <div ref={scrollRef} className="space-y-6 overflow-y-auto">
            {messages.map((msg, i) => (
                <MessageItem key={i} msg={msg} formatDate={formatDate} />
            ))}
        </div>
    );
}

function MessageItem({ msg, formatDate }: { msg: ChatMessage; formatDate: (t: string) => string }) {
    const isAssistant = msg.role === 'assistant';
    const isMCQ = msg.content.includes('QUESTIONS_START');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Parse MCQ if present
    const parseMCQ = (content: string) => {
        try {
            const raw = content.split('QUESTIONS_START')[1].split('QUESTIONS_END')[0].trim();
            const lines = raw.split('\n');
            const question = lines.find(l => l.startsWith('Question:'))?.replace('Question:', '').trim();
            const options = {
                A: lines.find(l => l.startsWith('A)'))?.replace('A)', '').trim(),
                B: lines.find(l => l.startsWith('B)'))?.replace('B)', '').trim(),
                C: lines.find(l => l.startsWith('C)'))?.replace('C)', '').trim(),
                D: lines.find(l => l.startsWith('D)'))?.replace('D)', '').trim(),
            };
            const correct = lines.find(l => l.startsWith('Correct:'))?.replace('Correct:', '').trim();
            const explanation = lines.find(l => l.startsWith('Explanation:'))?.replace('Explanation:', '').trim();

            return { question, options, correct, explanation };
        } catch (e) {
            return null;
        }
    };

    const mcqData = isMCQ ? parseMCQ(msg.content) : null;

    return (
        <div className={cn(
            "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
            isAssistant ? "justify-start" : "justify-end"
        )}>
            <div className={cn(
                "flex gap-3 max-w-[85%] md:max-w-[75%]",
                !isAssistant && "flex-row-reverse"
            )}>
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
                    isAssistant ? "bg-primary/10 text-primary" : "bg-primary text-secondary"
                )}>
                    {isAssistant ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                    <div className={cn(
                        "rounded-2xl px-4 py-3 shadow-soft",
                        isAssistant
                            ? "bg-card border border-border/50 text-card-foreground rounded-tl-none"
                            : "bg-primary text-primary-foreground rounded-tr-none"
                    )}>
                        {isMCQ && mcqData ? (
                            <div className="space-y-4 py-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Quiz Mode</span>
                                </div>
                                <p className="font-semibold text-base leading-snug">{mcqData.question}</p>
                                <div className="grid gap-2 mt-4">
                                    {(Object.entries(mcqData.options) as [string, string][]).map(([key, val]) => {
                                        if (!val) return null;
                                        const isSelected = selectedOption === key;
                                        const isCorrect = key === mcqData.correct;
                                        const showResult = selectedOption !== null;

                                        return (
                                            <Button
                                                key={key}
                                                variant="outline"
                                                className={cn(
                                                    "justify-start h-auto py-3 px-4 text-left border-border/40 hover:bg-muted/50 transition-all",
                                                    isSelected && "ring-2 ring-primary",
                                                    showResult && isCorrect && "bg-green-500/10 border-green-500/50 hover:bg-green-500/10",
                                                    showResult && isSelected && !isCorrect && "bg-red-500/10 border-red-500/50 hover:bg-red-500/10"
                                                )}
                                                onClick={() => {
                                                    if (!selectedOption) {
                                                        setSelectedOption(key);
                                                        setShowExplanation(true);
                                                        if (key === mcqData.correct) {
                                                            toast.success('Correct Answer!', { icon: <CheckCircle2 className="text-green-500" /> });
                                                        } else {
                                                            toast.error('Incorrect', { icon: <XCircle className="text-red-500" /> });
                                                        }
                                                    }
                                                }}
                                            >
                                                <span className="font-bold mr-3 opacity-50">{key}</span>
                                                <span className="flex-1">{val}</span>
                                                {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 ml-2 text-green-500" />}
                                                {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-2 text-red-500" />}
                                            </Button>
                                        );
                                    })}
                                </div>

                                {showExplanation && (
                                    <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex gap-2 text-primary mb-1">
                                            <Info className="w-4 h-4 mt-0.5" />
                                            <span className="font-bold text-xs">Explanation</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {mcqData.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {msg.content}
                            </div>
                        )}

                        <p className={cn(
                            "text-[10px] mt-2 opacity-70",
                            isAssistant ? "text-muted-foreground" : "text-primary-foreground"
                        )}>
                            {formatDate(msg.timestamp)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
