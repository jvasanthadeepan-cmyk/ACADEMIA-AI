import { useState } from 'react';
import { useGetFlashcards, useAddFlashcard, useDeleteFlashcard } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Library,
    Plus,
    Trash2,
    RotateCw,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    Loader2,
    Brain,
    Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function FlashcardPage() {
    const { data: flashcards, isLoading } = useGetFlashcards();
    const addFlashcard = useAddFlashcard();
    const deleteFlashcard = useDeleteFlashcard();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const [newFront, setNewFront] = useState('');
    const [newBack, setNewBack] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFront.trim() || !newBack.trim()) return;

        try {
            await addFlashcard.mutateAsync({
                front: newFront.trim(),
                back: newBack.trim(),
                category: 'General',
                level: 1
            });
            setNewFront('');
            setNewBack('');
            setIsCreating(false);
            toast.success('Flashcard added!');
        } catch (error) {
            toast.error('Failed to add flashcard');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteFlashcard.mutateAsync(id);
            if (currentIndex >= (flashcards?.length || 1) - 1) {
                setCurrentIndex(Math.max(0, (flashcards?.length || 1) - 2));
            }
            toast.success('Flashcard deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % (flashcards?.length || 1));
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + (flashcards?.length || 1)) % (flashcards?.length || 1));
    };

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    const currentCard = flashcards?.[currentIndex];

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Library className="w-8 h-8 text-primary" />
                        Active Recall Flashcards
                    </h1>
                    <p className="text-muted-foreground">Master complex topics with spaced repetition</p>
                </div>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Card
                    </Button>
                )}
            </div>

            {isCreating && (
                <Card className="animate-in slide-in-from-top-4 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-sm">New Flashcard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Front (Question/Concept)</Label>
                                <Input
                                    placeholder="e.g., What is Photosynthesis?"
                                    value={newFront}
                                    onChange={(e) => setNewFront(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Back (Answer/Explanation)</Label>
                                <Textarea
                                    placeholder="The process by which plants use sunlight..."
                                    value={newBack}
                                    onChange={(e) => setNewBack(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={addFlashcard.isPending}>
                                    {addFlashcard.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Card'}
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {!flashcards || flashcards.length === 0 ? (
                <Card className="p-20 text-center border-dashed bg-muted/20">
                    <div className="flex flex-col items-center gap-4">
                        <Sparkles className="w-10 h-10 text-primary opacity-50" />
                        <h3 className="text-xl font-bold">Your Library is Empty</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">
                            Create your first card to start mastering new subjects.
                        </p>
                        <Button onClick={() => setIsCreating(true)} variant="outline" className="mt-4">
                            Add First Card
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-8">
                    {/* Flashcard Component */}
                    <div className="perspective-1000 h-[350px] w-full max-w-2xl mx-auto">
                        <div
                            className={cn(
                                "relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer",
                                isFlipped && "rotate-y-180"
                            )}
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {/* Front Side */}
                            <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center bg-card border-2 border-primary/20 rounded-3xl shadow-soft-lg group">
                                <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest text-primary/40">Question</span>
                                <p className="text-2xl font-bold leading-tight">{currentCard?.front}</p>
                                <div className="absolute bottom-6 text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                                    <RotateCw className="w-3 h-3" />
                                    Click to Flip
                                </div>
                            </div>

                            {/* Back Side */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 text-center bg-primary text-primary-foreground border-2 border-primary rounded-3xl shadow-soft-lg">
                                <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest text-primary-foreground/40">Answer</span>
                                <p className="text-xl leading-relaxed whitespace-pre-wrap">{currentCard?.back}</p>
                                <div className="absolute bottom-6 flex items-center gap-4">
                                    <button className="text-xs hover:underline opacity-60">Still Learning</button>
                                    <button className="text-xs hover:underline flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Got it!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-8">
                        <Button variant="outline" size="icon" onClick={prevCard} className="w-12 h-12 rounded-full">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div className="text-center">
                            <span className="text-lg font-black tracking-tighter">
                                {currentIndex + 1} <span className="text-muted-foreground font-normal">/</span> {flashcards.length}
                            </span>
                        </div>
                        <Button variant="outline" size="icon" onClick={nextCard} className="w-12 h-12 rounded-full">
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => currentCard && handleDelete(currentCard.id)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete this card
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20">
                <Card className="bg-muted/30 border-none p-6 text-center">
                    <h4 className="font-bold flex items-center justify-center gap-2 mb-2">
                        <Brain className="w-4 h-4" />
                        Why Active Recall?
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        Testing yourself by retrieving information from memory strengthens your neural connections far more than just re-reading.
                    </p>
                </Card>
                <Card className="bg-muted/30 border-none p-6 text-center">
                    <h4 className="font-bold flex items-center justify-center gap-2 mb-2">
                        <Timer className="w-4 h-4" />
                        Daily Habits
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        Reviewing just 10 cards a day can keep you ahead in your course by 40% according to academic research.
                    </p>
                </Card>
            </div>
        </div>
    );
}

// Add these styles to your index.css if not present
// .perspective-1000 { perspective: 1000px; }
// .preserve-3d { transform-style: preserve-3d; }
// .backface-hidden { backface-visibility: hidden; }
// .rotate-y-180 { transform: rotateY(180deg); }
