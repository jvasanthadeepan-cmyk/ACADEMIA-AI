import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useUpgradeToPro } from '../../hooks/useQueries';
import { useTheme } from '../../hooks/useTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings as SettingsIcon, Loader2, Moon, Sun } from 'lucide-react';
import { YearOfStudy, PlanType } from 'declarations/backend/backend.did';
import { toast } from 'sonner';
import LogoutButton from '../../components/auth/LogoutButton';
import UpgradeModal from '../../components/assistant/UpgradeModal';

export default function SettingsPage() {
    const { data: userProfile, isLoading } = useGetCallerUserProfile();
    const saveProfile = useSaveCallerUserProfile();
    const upgradeMutation = useUpgradeToPro();
    const { theme, toggleTheme } = useTheme();
    const [showUpgrade, setShowUpgrade] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        collegeName: '',
        course: '',
        yearOfStudy: YearOfStudy.year1,
        targetCareer: '',
    });

    useEffect(() => {
        if (userProfile) {
            setFormData({
                fullName: userProfile.fullName,
                collegeName: userProfile.collegeName,
                course: userProfile.course,
                yearOfStudy: userProfile.yearOfStudy,
                targetCareer: userProfile.targetCareer,
            });
        }
    }, [userProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await saveProfile.mutateAsync({
                ...formData,
                plan: userProfile?.plan || PlanType.free,
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <SettingsIcon className="w-8 h-8 text-primary" />
                    Settings
                </h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>

            <Card className="shadow-soft-lg border-border/50">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="collegeName">College Name</Label>
                                <Input
                                    id="collegeName"
                                    value={formData.collegeName}
                                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="course">Course</Label>
                                <Input
                                    id="course"
                                    value={formData.course}
                                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="yearOfStudy">Year of Study</Label>
                                <Select
                                    value={formData.yearOfStudy}
                                    onValueChange={(value) => setFormData({ ...formData, yearOfStudy: value as YearOfStudy })}
                                >
                                    <SelectTrigger id="yearOfStudy">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={YearOfStudy.year1}>Year 1</SelectItem>
                                        <SelectItem value={YearOfStudy.year2}>Year 2</SelectItem>
                                        <SelectItem value={YearOfStudy.year3}>Year 3</SelectItem>
                                        <SelectItem value={YearOfStudy.year4}>Year 4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetCareer">Target Career</Label>
                            <Input
                                id="targetCareer"
                                value={formData.targetCareer}
                                onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
                            />
                        </div>

                        <Button type="submit" disabled={saveProfile.isPending}>
                            {saveProfile.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="shadow-soft-lg border-border/50">
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-soft-lg border-border/50">
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Your current plan and billing</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                            <div>
                                <p className="font-medium">
                                    {userProfile?.plan === PlanType.pro ? 'Pro Plan' : 'Free Plan'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {userProfile?.plan === PlanType.pro
                                        ? 'Unlimited AI queries and all features'
                                        : '10 AI queries per day'}
                                </p>
                            </div>
                            {userProfile?.plan === PlanType.free && (
                                <Button onClick={() => setShowUpgrade(true)} variant="default">Upgrade to Pro</Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Note: Subscription benefits are active immediately after upgrade.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-soft-lg border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Account Actions</CardTitle>
                    <CardDescription>Sign out of your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <LogoutButton />
                </CardContent>
            </Card>

            <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
        </div>
    );
}
