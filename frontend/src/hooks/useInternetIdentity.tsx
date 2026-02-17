import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface InternetIdentityContextType {
    identity: any | null;
    login: (userName?: string) => void;
    logout: () => void;
    isInitializing: boolean;
}

const InternetIdentityContext = createContext<InternetIdentityContextType | null>(null);

export const useInternetIdentity = () => {
    const context = useContext(InternetIdentityContext);
    if (!context) {
        throw new Error('useInternetIdentity must be used within an InternetIdentityProvider');
    }
    return context;
};

export const InternetIdentityProvider = ({ children }: { children: ReactNode }) => {
    const [identity, setIdentity] = useState<any | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const init = async () => {
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            if (isAuthenticated) {
                setIdentity({ getPrincipal: () => ({ toText: () => 'mock-principal' }) });
            } else {
                setIdentity(null);
            }
            setIsInitializing(false);
        };
        init();
    }, []);

    const login = (userName?: string) => {
        if (userName) localStorage.setItem('userName', userName);
        localStorage.setItem('isAuthenticated', 'true');
        setIdentity({ getPrincipal: () => ({ toText: () => 'mock-principal' }) });
    };

    const logout = () => {
        const email = localStorage.getItem('currentUserEmail');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPlan');
        setIdentity(null);
    };

    return (
        <InternetIdentityContext.Provider value={{ identity, login, logout, isInitializing }}>
            {children}
        </InternetIdentityContext.Provider>
    );
};
