import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function LogoutButton() {
    const navigate = useNavigate();
    const { logout } = useInternetIdentity();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate({ to: '/auth/login' });
    };

    return (
        <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
        >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
        </Button>
    );
}
