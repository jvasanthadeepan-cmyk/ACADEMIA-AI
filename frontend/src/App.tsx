import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/app/DashboardPage';
import StudyPlannerPage from './pages/app/StudyPlannerPage';
import AiAssistantPage from './pages/app/AiAssistantPage';
import CareerRoadmapPage from './pages/app/CareerRoadmapPage';
import FlashcardPage from './pages/app/FlashcardPage';
import HabitTrackerPage from './pages/app/HabitTrackerPage';
import FocusTrackerPage from './pages/app/FocusTrackerPage';
import SettingsPage from './pages/app/SettingsPage';
import AnalyticsPage from './pages/app/AnalyticsPage';
import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/auth/RequireAuth';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
    component: () => (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Outlet />
            <Toaster />
        </ThemeProvider>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LandingPage,
});

const authLoginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth/login',
    component: LoginPage,
});

const authSignupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth/signup',
    component: SignupPage,
});

const appLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/app',
    component: () => (
        <RequireAuth>
            <AppLayout>
                <Outlet />
            </AppLayout>
        </RequireAuth>
    ),
});

const dashboardRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/dashboard',
    component: DashboardPage,
});

const analyticsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/analytics',
    component: AnalyticsPage,
});

const studyPlannerRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/study-planner',
    component: StudyPlannerPage,
});

const aiAssistantRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/ai-assistant',
    component: AiAssistantPage,
});

const careerRoadmapRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/career-roadmap',
    component: CareerRoadmapPage,
});

const habitTrackerRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/habit-tracker',
    component: HabitTrackerPage,
});

const flashcardRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/flashcards',
    component: FlashcardPage,
});

const focusTrackerRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/focus-tracker',
    component: FocusTrackerPage,
});

const settingsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/settings',
    component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    authLoginRoute,
    authSignupRoute,
    appLayoutRoute.addChildren([
        dashboardRoute,
        analyticsRoute,
        studyPlannerRoute,
        aiAssistantRoute,
        careerRoadmapRoute,
        habitTrackerRoute,
        flashcardRoute,
        focusTrackerRoute,
        settingsRoute,
    ]),
]);

const router = createRouter({ routeTree, defaultPreload: 'intent' });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return <RouterProvider router={router} />;
}
