export declare const idlFactory: any;
export declare enum YearOfStudy {
    year1 = "year1",
    year2 = "year2",
    year3 = "year3",
    year4 = "year4",
}
export declare enum PlanType {
    free = "free",
    pro = "pro",
}

export declare enum TaskStatus {
    pending = "pending",
    completed = "completed",
}


export type UserProfile = {
    fullName: string;
    collegeName: string;
    course: string;
    yearOfStudy: YearOfStudy;
    targetCareer: string;
    plan: PlanType;
};

export type StudyTask = {
    subject: string;
    topic: string;
    deadline: string;
    status: TaskStatus;
    id?: bigint;
};

export type FocusSession = {
    durationMinutes: number;
    timestamp: string;
};

export type ChatMessage = {
    role: "user" | "system" | "assistant";
    content: string;
    timestamp: string;
};

export type CareerRoadmap = {
    degree: string;
    targetJob: string;
    timeline: string;
    skillRoadmap: string[];
    recommendedTools: string[];
    projectSuggestions: string[];
    internshipPath: string[];
};

export type Habit = {
    id: string;
    name: string;
    icon: string;
    color: string;
    completedDays: string[];
};

export type Flashcard = {
    id: string;
    front: string;
    back: string;
    category: string;
    level: number; // 0: Easy, 1: Medium, 2: Hard
};

export type StudyResource = {
    id: string;
    title: string;
    url: string;
    type: string; // PDF, Video, Link
};

export interface BackendActor {
    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<any>;
    getDashboardData: () => Promise<any>;
    getStudyTasks: () => Promise<StudyTask[]>;
    addStudyTask: (task: StudyTask) => Promise<any>;
    updateStudyTask: (id: bigint, task: StudyTask) => Promise<any>;
    deleteStudyTask: (id: bigint) => Promise<any>;
    getTaskSummary: () => Promise<any>;
    getFocusSessions: () => Promise<FocusSession[]>;
    addFocusSession: (session: FocusSession) => Promise<any>;
    getChatHistory: () => Promise<ChatMessage[]>;
    addChatMessage: (msg: ChatMessage) => Promise<any>;
    clearChatHistory: () => Promise<any>;
    getHabits: () => Promise<Habit[]>;
    addHabit: (habit: Omit<Habit, 'id' | 'completedDays'>) => Promise<any>;
    toggleHabit: (id: string, date: string) => Promise<any>;
    deleteHabit: (id: string) => Promise<any>;
    getFlashcards: () => Promise<Flashcard[]>;
    addFlashcard: (card: Omit<Flashcard, 'id'>) => Promise<any>;
    deleteFlashcard: (id: string) => Promise<any>;
    getStudyResources: () => Promise<StudyResource[]>;
    addStudyResource: (resource: Omit<StudyResource, 'id'>) => Promise<any>;
    getCareerRoadmap: () => Promise<CareerRoadmap | null>;
    saveCareerRoadmap: (roadmap: CareerRoadmap) => Promise<any>;
    registerUser: (email: string, password: string, fullName: string) => Promise<{ success?: boolean; error?: string }>;
    loginUser: (email: string, password: string) => Promise<{ success?: boolean; profile?: UserProfile; error?: string }>;
    upgradeToPro: () => Promise<any>;
}
