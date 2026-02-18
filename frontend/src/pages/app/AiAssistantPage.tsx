import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useGetChatHistory, useAddChatMessage, useClearChatHistory } from '../../hooks/useQueries';
import { useAssistantQuota } from '../../hooks/useAssistantQuota';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Send, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ChatThread from '../../components/assistant/ChatThread';
import UpgradeModal from '../../components/assistant/UpgradeModal';
import { getAIResponse } from '../../services/aiService';

export default function AiAssistantPage() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);

    const { data: chatHistory, isLoading: historyLoading } = useGetChatHistory();
    const addMessage = useAddChatMessage();
    const clearHistory = useClearChatHistory();
    const quota = useAssistantQuota();

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!input.trim() || isLoading) return;

        if (!quota.canSend) {
            setShowUpgrade(true);
            return;
        }

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        try {
            await addMessage.mutateAsync({
                role: 'user',
                content: userMessage,
                timestamp: new Date().toISOString(),
            });

            const response = await getAIResponse(userMessage);

            await addMessage.mutateAsync({
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString(),
            });

            toast.success('Response received');
        } catch (error) {
            toast.error('Failed to get a response from AI');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = async () => {
        if (confirm('Are you sure you want to clear your chat history? This cannot be undone.')) {
            setIsClearing(true);
            try {
                await clearHistory.mutateAsync();
                toast.success('Chat history cleared');
            } catch (error) {
                toast.error('Failed to clear chat history');
            } finally {
                setIsClearing(false);
            }
        }
    };

    const handleSuggest = (prompt: string) => {
        setInput(prompt);
    };

    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast.error('Speech recognition not supported in this browser');
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + ' ' + transcript);
        };

        recognition.start();
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-8 h-8 text-primary" />
                        AI Study Assistant
                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-full animate-pulse">Live</span>
                    </h1>
                    <p className="text-muted-foreground">Neuro-sync study support</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium">
                            {quota.isPro ? 'Pro Plan: Unlimited' : `Quota: ${quota.remaining}/${quota.limit} today`}
                        </p>
                        {!quota.isPro && (
                            <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setShowUpgrade(true)}>
                                Upgrade for more
                            </Button>
                        )}
                    </div>
                    {chatHistory && chatHistory.length > 0 && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleClearChat}
                            disabled={isClearing}
                            className="text-destructive hover:bg-destructive/10"
                        >
                            {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                    )}
                </div>
            </div>

            <Card className="flex-1 flex flex-col min-h-0 border-border/50 shadow-soft-lg overflow-hidden backdrop-blur-sm bg-card/80">
                <CardHeader className="border-b bg-muted/30 py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Cognitive Knowledge Engine v4.0
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
                        {historyLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
                            </div>
                        ) : (
                            <ChatThread messages={chatHistory || []} />
                        )}
                    </div>

                    <div className="p-4 md:p-6 border-t bg-card">
                        {chatHistory?.length === 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 animate-in slide-in-from-bottom-5 duration-700">
                                <Button variant="outline" size="sm" onClick={() => handleSuggest("Explain Photosynthesis in detail")} className="justify-start text-xs h-auto py-2 hover:border-primary/50">
                                    "Explain Photosynthesis in detail"
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleSuggest("Give me a study plan for Quantum Physics")} className="justify-start text-xs h-auto py-2 hover:border-primary/50">
                                    "Give me a study plan for Quantum Physics"
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleSuggest("Generate an MCQ on DNA")} className="justify-start text-xs h-auto py-2 border-primary/30 text-primary hover:bg-primary/5">
                                    <Sparkles className="w-3 h-3 mr-2" />
                                    "Generate an MCQ on DNA"
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleSuggest("Quiz me on Newton's Laws")} className="justify-start text-xs h-auto py-2 border-primary/30 text-primary hover:bg-primary/5">
                                    <Sparkles className="w-3 h-3 mr-2" />
                                    "Quiz me on Newton's Laws"
                                </Button>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <div className="relative flex-1">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask your academic query..."
                                    className="resize-none min-h-[60px] max-h-[150px] bg-muted/50 focus:bg-background transition-all pr-12"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "absolute right-2 bottom-2 h-8 w-8 rounded-full",
                                        isListening && "text-primary bg-primary/10 animate-pulse"
                                    )}
                                    onClick={startListening}
                                >
                                    <div className={cn(
                                        "w-2 h-2 rounded-full bg-primary absolute -top-1 -right-1",
                                        !isListening && "hidden"
                                    )} />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                </Button>
                            </div>
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-auto px-4 shadow-lg shadow-primary/20">
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </Button>
                        </form>
                        <p className="text-[10px] text-center mt-2 text-muted-foreground">
                            Press Enter to send, Shift + Enter for new line
                        </p>
                    </div>
                </CardContent>
            </Card>

            <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
        </div>
    );
}
