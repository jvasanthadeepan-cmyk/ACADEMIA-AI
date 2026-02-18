import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface InternetIdentityContextType {
    identity: any | null;
    login: (userName?: string, email?: string) => void;
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
            const email = localStorage.getItem('userEmail');
            if (isAuthenticated && email) {
                setIdentity({
                    getPrincipal: () => ({
                        toText: () => `mock-principal-${btoa(email).slice(0, 8)}`
                    })
                });
            } else {
                setIdentity(null);
            }
            setIsInitializing(false);
        };
        init();
    }, []);

    const login = (userName?: string, email?: string) => {
        if (userName) localStorage.setItem('userName', userName);
        if (email) localStorage.setItem('userEmail', email);
        localStorage.setItem('isAuthenticated', 'true');
        const finalEmail = email || 'guest';
        setIdentity({
            getPrincipal: () => ({
                toText: () => `mock-principal-${btoa(finalEmail).slice(0, 8)}`
            })
        });
    };

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPlan');
        localStorage.removeItem('chatHistory');
        setIdentity(null);
    };

    return (
        <InternetIdentityContext.Provider value={{ identity, login, logout, isInitializing }}>
            {children}
        </InternetIdentityContext.Provider>
    );
};
