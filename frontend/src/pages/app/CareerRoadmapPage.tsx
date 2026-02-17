import { useState } from 'react';
import { useGetCareerRoadmap, useSaveCareerRoadmap } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import RoadmapTimeline from '../../components/roadmap/RoadmapTimeline';
import { generateCareerRoadmap } from '../../utils/localRoadmapGenerator';
import { toast } from 'sonner';
import { Loader2, Target, RefreshCw } from 'lucide-react';

export default function CareerRoadmapPage() {
    const { data: roadmap, isLoading, refetch } = useGetCareerRoadmap();
    const saveRoadmap = useSaveCareerRoadmap();
    const [formData, setFormData] = useState({
        degree: '',
        targetJob: '',
        timeline: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.degree.trim() || !formData.targetJob.trim() || !formData.timeline.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsGenerating(true);
        try {
            // Add a small delay for "thinking" effect
            await new Promise(resolve => setTimeout(resolve, 1500));

            const generated = generateCareerRoadmap(formData.degree, formData.targetJob, formData.timeline);
            await saveRoadmap.mutateAsync(generated);
            toast.success('Career roadmap generated!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate roadmap');
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = async () => {
        try {
            localStorage.removeItem('careerRoadmap');
            await refetch();
            toast.success('Roadmap reset');
        } catch (error) {
            toast.error('Failed to reset roadmap');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <Card className="p-8">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-32 ml-auto" />
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Target className="w-8 h-8 text-primary" />
                        Career Roadmap
                    </h1>
                    <p className="text-muted-foreground">Plan your path from degree to dream career</p>
                </div>
                {roadmap && (
                    <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground hover:text-destructive transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Generate New
                    </Button>
                )}
            </div>

            {!roadmap ? (
                <Card className="shadow-soft-lg border-border/50">
                    <CardHeader>
                        <CardTitle>Generate Your Roadmap</CardTitle>
                        <CardDescription>Tell us about your goals and we'll create a personalized career path</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="degree">Your Degree *</Label>
                                <Input
                                    id="degree"
                                    value={formData.degree}
                                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                    placeholder="e.g., Computer Science"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="targetJob">Target Job *</Label>
                                <Input
                                    id="targetJob"
                                    value={formData.targetJob}
                                    onChange={(e) => setFormData({ ...formData, targetJob: e.target.value })}
                                    placeholder="e.g., Software Engineer"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timeline">Timeline *</Label>
                                <Input
                                    id="timeline"
                                    value={formData.timeline}
                                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                    placeholder="e.g., 2 years"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isGenerating} className="w-full" size="lg">
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Roadmap'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    <RoadmapTimeline roadmap={roadmap} />
                </div>
            )}
        </div>
    );
}
