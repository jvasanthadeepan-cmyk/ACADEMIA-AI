import { CareerRoadmap } from 'declarations/backend/backend.did';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Wrench, Briefcase, Code } from 'lucide-react';

interface RoadmapTimelineProps {
    roadmap: CareerRoadmap;
}

export default function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
    // Defensive checks for arrays to prevent crashes
    const skills = roadmap.skillRoadmap || [];
    const tools = roadmap.recommendedTools || [];
    const projects = roadmap.projectSuggestions || [];
    const internship = roadmap.internshipPath || [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="shadow-soft-lg border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">
                        {roadmap.degree || 'Degree'} → {roadmap.targetJob || 'Target Job'}
                    </CardTitle>
                    <p className="text-muted-foreground font-medium">Estimated Timeline: {roadmap.timeline || 'TBD'}</p>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-soft border-border/50 hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            Skill Roadmap
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-3">
                            {skills.length > 0 ? skills.map((skill, idx) => (
                                <li key={idx} className="flex gap-3 items-start">
                                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <span className="text-sm leading-relaxed">{skill}</span>
                                </li>
                            )) : <p className="text-sm text-muted-foreground italic">No skills listed</p>}
                        </ol>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50 hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Wrench className="w-5 h-5 text-primary" />
                            Recommended Tools
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid grid-cols-1 gap-2">
                            {tools.length > 0 ? tools.map((tool, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm bg-accent/30 p-2 rounded-md">
                                    <Wrench className="w-3 h-3 text-primary opacity-50" />
                                    <span>{tool}</span>
                                </li>
                            )) : <p className="text-sm text-muted-foreground italic">No tools recommended</p>}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50 hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Code className="w-5 h-5 text-primary" />
                            Project Suggestions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {projects.length > 0 ? projects.map((project, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <span className="leading-relaxed">{project}</span>
                                </li>
                            )) : <p className="text-sm text-muted-foreground italic">No projects suggested</p>}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50 hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Briefcase className="w-5 h-5 text-primary" />
                            Internship Path
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {internship.length > 0 ? internship.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <span className="leading-relaxed">{step}</span>
                                </li>
                            )) : <p className="text-sm text-muted-foreground italic">No internship steps listed</p>}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
