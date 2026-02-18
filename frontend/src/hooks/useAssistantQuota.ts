import { useMemo } from 'react';
import { useGetCallerUserProfile } from './useQueries';
import { useGetChatHistory } from './useQueries';
import { PlanType } from 'declarations/backend/backend.did';

const FREE_DAILY_LIMIT = 10;

export function useAssistantQuota() {
    const { data: profile } = useGetCallerUserProfile();
    const { data: chatHistory } = useGetChatHistory();

    const quotaInfo = useMemo(() => {
        if (!profile) {
            // Check if logged in via localStorage as a fallback for demo mode
            const isLocalAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            if (isLocalAuthenticated) {
                const isLocalPro = localStorage.getItem('userPlan') === 'pro';
                if (isLocalPro) return { remaining: Infinity, limit: Infinity, isPro: true, canSend: true };
                return { remaining: FREE_DAILY_LIMIT, limit: FREE_DAILY_LIMIT, isPro: false, canSend: true, used: 0 };
            }
            return { remaining: 0, limit: FREE_DAILY_LIMIT, isPro: false, canSend: false };
        }

        const isPro = profile.plan === PlanType.pro;

        if (isPro) {
            return { remaining: Infinity, limit: Infinity, isPro: true, canSend: true };
        }

        // Count today's messages
        const now = Date.now();
        const todayStart = new Date(now).setHours(0, 0, 0, 0);
        const todayMessages = (chatHistory || []).filter((msg) => {
            let msgTime: number;
            if (/^\d+$/.test(msg.timestamp)) {
                msgTime = Number(msg.timestamp) / 1_000_000;
            } else {
                msgTime = new Date(msg.timestamp).getTime();
            }
            return msgTime >= todayStart;
        });

        const used = todayMessages.length;
        const remaining = Math.max(0, FREE_DAILY_LIMIT - used);
        const canSend = remaining > 0;

        return { remaining, limit: FREE_DAILY_LIMIT, isPro: false, canSend, used };
    }, [profile, chatHistory]);

    return quotaInfo;
}
