import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Calendar, Target, Timer, Sparkles, Check } from 'lucide-react';
import { SiX, SiFacebook, SiLinkedin, SiInstagram } from 'react-icons/si';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Brain className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">ACADEMIA AI</span>
                    </div>
                    <Button onClick={() => navigate({ to: '/auth/login' })} variant="outline">
                        Login
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Academic Excellence
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                        Your Personal AI Academic Command Center
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Organize. Focus. Win.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 rounded-xl shadow-soft-lg hover:shadow-primary/20 transition-all"
                            onClick={() => navigate({ to: '/auth/signup' })}
                        >
                            Get Started
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-6 rounded-xl"
                            onClick={() => navigate({ to: '/auth/login' })}
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-background to-accent/5">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Everything You Need to Excel
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-border/50 shadow-soft hover:shadow-soft-lg transition-all">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Calendar className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Smart Study Planner</CardTitle>
                                <CardDescription>
                                    Organize your syllabus into manageable daily tasks with AI-powered scheduling
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 shadow-soft hover:shadow-soft-lg transition-all">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Brain className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>AI Study Assistant</CardTitle>
                                <CardDescription>
                                    Get instant explanations, summaries, flashcards, and practice questions
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 shadow-soft hover:shadow-soft-lg transition-all">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Career Roadmap Generator</CardTitle>
                                <CardDescription>
                                    Build a personalized path from your degree to your dream career
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 shadow-soft hover:shadow-soft-lg transition-all">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Timer className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Focus & Habit Tracker</CardTitle>
                                <CardDescription>
                                    Pomodoro timer, productivity tracking, and habit streaks to stay consistent
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="border-border/50 shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-2xl">Free Plan</CardTitle>
                                <CardDescription className="text-lg">Perfect to get started</CardDescription>
                                <div className="pt-4">
                                    <span className="text-4xl font-bold">₹0</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-primary" />
                                    <span>10 AI queries per day</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-primary" />
                                    <span>Study planner & calendar</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-primary" />
                                    <span>Focus tracker & Pomodoro</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-primary" />
                                    <span>Career roadmap generator</span>
                                </div>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate({ to: '/auth/signup' })}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </Card>

                        <Card className="border-primary shadow-soft-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-lg">
                                Popular
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                                <CardDescription className="text-lg">Unlimited everything</CardDescription>
                                <div className="pt-4">
                                    <span className="text-4xl font-bold">₹299</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-primary" />
                                    <span className="font-medium">Unlimited AI queries</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-primary" />
                                    <span>All Free features</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-primary" />
                                    <span>Priority support</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-primary" />
                                    <span>Advanced analytics</span>
                                </div>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button
                                    className="w-full"
                                    onClick={() => navigate({ to: '/auth/signup' })}
                                >
                                    Upgrade to Pro
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-lg font-bold">ACADEMIA AI</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Your personal AI academic command center for organized, focused, and winning study sessions.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-foreground transition-colors">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground transition-colors">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Connect With Us</h3>
                            <div className="flex gap-4">
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <SiX className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <SiFacebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <SiLinkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <SiInstagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
                        <p>
                            © {new Date().getFullYear()} ACADEMIA AI. Built with ❤️ using{' '}
                            <a
                                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                                    window.location.hostname
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                caffeine.ai
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
