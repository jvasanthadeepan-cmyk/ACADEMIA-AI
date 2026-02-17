import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface RequireAuthProps {
    children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: '/auth/login' });
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
