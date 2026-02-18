import { ReactNode, useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Brain, LayoutDashboard, Calendar, MessageSquare, Target, Timer, Settings, Menu, Bell, User, PieChart, LogOut, Activity, Library } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
    { icon: Library, label: 'Flashcards', path: '/app/flashcards' },
    { icon: PieChart, label: 'Analytics', path: '/app/analytics' },
    { icon: Calendar, label: 'Study Planner', path: '/app/study-planner' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/app/ai-assistant' },
    { icon: Target, label: 'Career Roadmap', path: '/app/career-roadmap' },
    { icon: Activity, label: 'Habit Tracker', path: '/app/habit-tracker' },
    { icon: Timer, label: 'Focus Tracker', path: '/app/focus-tracker' },
    { icon: Settings, label: 'Settings', path: '/app/settings' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const { location } = useRouterState();
    const currentPath = location.pathname;
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: userProfile } = useGetCallerUserProfile();
    const { logout } = useInternetIdentity();

    const handleLogout = async () => {
        await logout();
        navigate({ to: '/auth/login' });
    };

    const NavContent = () => (
        <div className="flex flex-col h-full bg-card text-card-foreground">
            <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold">ACADEMIA AI</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    // handle nested paths? simple check for now
                    const isActive = currentPath.startsWith(item.path);
                    return (
                        <Button
                            key={item.path}
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={`w-full justify-start ${isActive ? 'bg-secondary' : ''}`}
                            onClick={() => {
                                navigate({ to: item.path });
                                setMobileOpen(false);
                            }}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {item.label}
                        </Button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border/50 bg-card">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="p-0 w-64 border-r border-border/50">
                    <NavContent />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between px-4 py-3 h-16">
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                            </Sheet>
                        </div>

                        <div className="flex-1" />

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="p-2 space-y-2">
                                        <div className="text-xs p-2 rounded bg-muted/50">
                                            <p className="font-semibold text-primary">New Feature!</p>
                                            <p className="text-muted-foreground">ChatGPT-style AI Assistant is now live.</p>
                                        </div>
                                        <div className="text-xs p-2 rounded bg-muted/50">
                                            <p className="font-semibold">Study Goal</p>
                                            <p className="text-muted-foreground">You completed your focus session yesterday.</p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-xs justify-center text-muted-foreground">
                                        No new notifications
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2 pl-0">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ml-2">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="hidden sm:inline font-medium">{userProfile?.fullName || 'User'}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate({ to: '/app/settings' })}>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}
