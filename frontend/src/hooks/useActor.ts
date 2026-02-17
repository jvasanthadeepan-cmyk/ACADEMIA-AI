import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { createActor, canisterId } from 'declarations/backend';
import { BackendActor } from 'declarations/backend/backend.did';

export const useActor = () => {
    const { identity } = useInternetIdentity();
    const [actor, setActor] = useState<BackendActor | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (identity) {
            const _actor = createActor(canisterId, {
                agentOptions: {
                    identity,
                },
            });
            // Simplified mock casting
            setActor(_actor as unknown as BackendActor);
        } else {
            setActor(null);
        }
    }, [identity]);

    return { actor, isFetching };
};
