import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Layers, BookOpen, ListChecks } from 'lucide-react';

interface PromptChipsProps {
    onPromptSelect: (prompt: string) => void;
}

export default function PromptChips({ onPromptSelect }: PromptChipsProps) {
    const prompts = [
        { icon: Lightbulb, label: 'Explain in Simple Terms', prompt: 'Please explain this concept in simple terms: ' },
        { icon: FileText, label: 'Make 5-Mark Answer', prompt: 'Create a 5-mark answer for: ' },
        { icon: Layers, label: 'Create Flashcards', prompt: 'Generate flashcards for: ' },
        { icon: BookOpen, label: 'Summarize Notes', prompt: 'Summarize these notes: ' },
        { icon: ListChecks, label: 'Generate MCQs', prompt: 'Generate multiple choice questions for: ' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => {
                const Icon = prompt.icon;
                return (
                    <Button
                        key={prompt.label}
                        variant="outline"
                        size="sm"
                        onClick={() => onPromptSelect(prompt.prompt)}
                        className="gap-2"
                    >
                        <Icon className="w-4 h-4" />
                        {prompt.label}
                    </Button>
                );
            })}
        </div>
    );
}
