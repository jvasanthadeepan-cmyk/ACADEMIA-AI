import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Check } from 'lucide-react';
import { useUpgradeToPro } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
    const upgradeMutation = useUpgradeToPro();

    const handleUpgrade = async () => {
        try {
            await upgradeMutation.mutateAsync();
            toast.success('Upgraded to Pro! Enjoy unlimited queries.');
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to upgrade. Please try again.');
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-2xl">Upgrade to Pro</DialogTitle>
                    <DialogDescription className="text-center">
                        Daily limit reached. Unlock lifetime Pro access and all premium features for free!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                        <div className="text-center mb-4">
                            <span className="text-4xl font-bold">₹0</span>
                            <span className="text-muted-foreground"> / Free Forever</span>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>Unlimited AI queries</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>Priority support</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>Advanced analytics</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>All features unlocked</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-2">
                    <Button onClick={handleUpgrade} disabled={upgradeMutation.isPending} className="w-full" size="lg">
                        {upgradeMutation.isPending ? 'Upgrading...' : 'Upgrade Now'}
                    </Button>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
                        Maybe Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
