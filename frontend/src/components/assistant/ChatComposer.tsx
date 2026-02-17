import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface ChatComposerProps {
    onSend: (message: string) => Promise<void>;
    isLoading: boolean;
    disabled?: boolean;
}

export default function ChatComposer({ onSend, isLoading, disabled }: ChatComposerProps) {
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading || disabled) return;

        await onSend(message);
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? 'Daily limit reached. Upgrade to continue.' : 'Ask me anything...'}
                rows={2}
                className="resize-none"
                disabled={isLoading || disabled}
            />
            <Button type="submit" size="icon" disabled={isLoading || disabled || !message.trim()} className="shrink-0">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
        </form>
    );
}
