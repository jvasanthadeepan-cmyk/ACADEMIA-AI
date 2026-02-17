import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { useAddChatMessage } from '../../hooks/useQueries';
import { useAssistantQuota } from '../../hooks/useAssistantQuota';
import { toast } from 'sonner';
import UpgradeModal from './UpgradeModal';
import { getAIResponse } from '../../services/aiService';

export default function QuickAskCard() {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const addMessage = useAddChatMessage();
    const quota = useAssistantQuota();

    const handleAsk = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!question.trim() || isProcessing) return;

        if (!quota.canSend) {
            setShowUpgrade(true);
            return;
        }

        const userQuery = question.trim();
        setIsProcessing(true);
        setResponse('');

        try {
            // 1. Get ChatGPT-like response
            const aiResponse = await getAIResponse(userQuery);

            // 2. Save user message
            await addMessage.mutateAsync({
                role: 'user',
                content: userQuery,
                timestamp: new Date().toISOString(),
            });

            // 3. Save AI message
            await addMessage.mutateAsync({
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString(),
            });

            setResponse(aiResponse);
            setQuestion('');
            toast.success('Generated detailed answer!');
        } catch (error) {
            toast.error('Failed to get response');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card className="shadow-soft border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5" />
                    Knowledge Engine
                </CardTitle>
                <CardDescription className="text-xs">
                    {quota.isPro ? 'Pro: Unlimited ChatGPT Queries' : `${quota.remaining} Queries Remaining`}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleAsk} className="relative">
                    <Textarea
                        placeholder="Ask me an academic question like ChatGPT..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows={3}
                        className="resize-none pr-10 text-sm bg-background border-primary/10 transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAsk();
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        disabled={isProcessing || !question.trim()}
                        className="absolute right-2 bottom-2 text-primary hover:bg-primary/10 transition-colors"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </form>

                {response && (
                    <div className="p-4 rounded-lg bg-background border border-border/50 text-sm animate-in fade-in slide-in-from-top-2 duration-400">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span className="font-semibold text-xs uppercase tracking-tight opacity-70">Answer</span>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {response.length > 300 ? `${response.substring(0, 300)}...` : response}
                        </p>
                        {response.length > 300 && (
                            <Button
                                variant="link"
                                className="p-0 h-auto text-xs mt-2"
                                onClick={() => toast.info("View full conversation in AI Assistant page!")}
                            >
                                Read full answer in AI Assistant
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>

            <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
        </Card>
    );
}
