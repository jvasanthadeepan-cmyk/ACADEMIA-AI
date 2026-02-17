import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, StudyTask, FocusSession, ChatMessage, CareerRoadmap, Habit, Flashcard, StudyResource } from 'declarations/backend/backend.did';

export function useGetCallerUserProfile() {
    const { actor, isFetching: actorFetching } = useActor();

    const query = useQuery<UserProfile | null>({
        queryKey: ['currentUserProfile'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserProfile();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });

    return {
        ...query,
        isLoading: actorFetching || query.isLoading,
        isFetched: !!actor && query.isFetched,
    };
}

export function useSaveCallerUserProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: UserProfile) => {
            if (!actor) throw new Error('Actor not available');
            return actor.saveCallerUserProfile(profile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
        },
    });
}

export function useGetDashboardData() {
    const { actor, isFetching } = useActor();

    return useQuery({
        queryKey: ['dashboardData'],
        queryFn: async () => {
            if (!actor) return null;
            return actor.getDashboardData();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetStudyTasks() {
    const { actor, isFetching } = useActor();

    return useQuery<StudyTask[]>({
        queryKey: ['studyTasks'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getStudyTasks();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddStudyTask() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (task: StudyTask) => {
            if (!actor) throw new Error('Actor not available');
            return actor.addStudyTask(task);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studyTasks'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
            queryClient.invalidateQueries({ queryKey: ['taskSummary'] });
        },
    });
}

export function useUpdateStudyTask() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ index, task }: { index: number; task: StudyTask }) => {
            if (!actor) throw new Error('Actor not available');
            return actor.updateStudyTask(BigInt(index), task);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studyTasks'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
            queryClient.invalidateQueries({ queryKey: ['taskSummary'] });
        },
    });
}

export function useDeleteStudyTask() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (index: number) => {
            if (!actor) throw new Error('Actor not available');
            return actor.deleteStudyTask(BigInt(index));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studyTasks'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
            queryClient.invalidateQueries({ queryKey: ['taskSummary'] });
        },
    });
}

export function useGetTaskSummary() {
    const { actor, isFetching } = useActor();

    return useQuery({
        queryKey: ['taskSummary'],
        queryFn: async () => {
            if (!actor) return null;
            return actor.getTaskSummary();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetFocusSessions() {
    const { actor, isFetching } = useActor();

    return useQuery<FocusSession[]>({
        queryKey: ['focusSessions'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getFocusSessions();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddFocusSession() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (session: FocusSession) => {
            if (!actor) throw new Error('Actor not available');
            return actor.addFocusSession(session);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['focusSessions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
        },
    });
}

export function useGetChatHistory() {
    const { actor, isFetching } = useActor();

    return useQuery<ChatMessage[]>({
        queryKey: ['chatHistory'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getChatHistory();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddChatMessage() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (chat: ChatMessage) => {
            if (!actor) throw new Error('Actor not available');
            return actor.addChatMessage(chat);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
        },
    });
}

export function useClearChatHistory() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.clearChatHistory();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
        },
    });
}

export function useGetHabits() {
    const { actor, isFetching } = useActor();

    return useQuery<Habit[]>({
        queryKey: ['habits'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getHabits();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddHabit() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (habit: Omit<Habit, 'id' | 'completedDays'>) => {
            if (!actor) throw new Error('Actor not available');
            return actor.addHabit(habit);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
}

export function useToggleHabit() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, date }: { id: string; date: string }) => {
            if (!actor) throw new Error('Actor not available');
            return actor.toggleHabit(id, date);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
}

export function useDeleteHabit() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!actor) throw new Error('Actor not available');
            return actor.deleteHabit(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });
}

export function useGetCareerRoadmap() {
    const { actor, isFetching } = useActor();

    return useQuery<CareerRoadmap | null>({
        queryKey: ['careerRoadmap'],
        queryFn: async () => {
            if (!actor) return null;
            return actor.getCareerRoadmap();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useSaveCareerRoadmap() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roadmap: CareerRoadmap) => {
            if (!actor) throw new Error('Actor not available');
            return actor.saveCareerRoadmap(roadmap);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['careerRoadmap'] });
        },
    });
}

export function useUpgradeToPro() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.upgradeToPro();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
        },
    });
}

export function useGetFlashcards() {
    const { actor, isFetching } = useActor();

    return useQuery<Flashcard[]>({
        queryKey: ['flashcards'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getFlashcards();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddFlashcard() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (card: Omit<Flashcard, 'id'>) => {
            if (!actor) throw new Error('Actor not available');
            return actor.addFlashcard(card);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flashcards'] });
        },
    });
}

export function useDeleteFlashcard() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!actor) throw new Error('Actor not available');
            return actor.deleteFlashcard(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flashcards'] });
        },
    });
}

export function useGetStudyResources() {
    const { actor, isFetching } = useActor();

    return useQuery<StudyResource[]>({
        queryKey: ['studyResources'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getStudyResources();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddStudyResource() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (resource: Omit<StudyResource, 'id'>) => {
            if (!actor) throw new Error('Actor not available');
            return actor.addStudyResource(resource);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studyResources'] });
        },
    });
}
