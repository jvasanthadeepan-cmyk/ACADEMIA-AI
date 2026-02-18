export const idlFactory = ({ IDL }) => {
    return IDL.Service({});
};

export const YearOfStudy = {
    year1: "year1",
    year2: "year2",
    year3: "year3",
    year4: "year4",
};

export const PlanType = {
    free: "free",
    pro: "pro",
};

export const TaskStatus = {
    pending: 'pending',
    completed: 'completed',
};

export const canisterId = "rrkah-fqaaa-aaaaa-aaaaa-cai";

export const createActor = (canisterId, options) => {
    // Helper to get tasks from localStorage
    const getTasks = () => {
        const tasks = localStorage.getItem('app_tasks');
        if (!tasks) {
            const defaults = [
                { id: 1n, subject: "Math", topic: "Calculus", deadline: "2023-12-31", status: "completed" },
                { id: 2n, subject: "Physics", topic: "Mechanics", deadline: "2023-12-31", status: "pending" },
                { id: 3n, subject: "CS", topic: "Algorithms", deadline: "2023-12-31", status: "completed" },
                { id: 4n, subject: "Math", topic: "Algebra", deadline: "2023-12-31", status: "pending" },
                { id: 5n, subject: "History", topic: "World War II", deadline: "2023-12-31", status: "pending" },
            ];
            const store = defaults.map(t => ({ ...t, id: t.id.toString() }));
            localStorage.setItem('app_tasks', JSON.stringify(store));
            return defaults;
        }
        return JSON.parse(tasks).map(t => ({ ...t, id: BigInt(t.id) }));
    };

    const saveTasks = (tasks) => {
        const store = tasks.map(t => ({ ...t, id: t.id.toString() }));
        localStorage.setItem('app_tasks', JSON.stringify(store));
    };

    // Helper to get users from localStorage
    const getUsers = () => {
        const users = localStorage.getItem('app_users');
        return users ? JSON.parse(users) : {};
    };

    // Helper to save users to localStorage
    const saveUsers = (users) => {
        localStorage.setItem('app_users', JSON.stringify(users));
    };

    return {
        // AUTHENTICATION
        registerUser: async (email, password, fullName) => {
            const users = getUsers();
            if (users[email]) return { error: "User already exists" };
            users[email] = {
                password,
                profile: {
                    fullName,
                    collegeName: "Not Set",
                    course: "Not Set",
                    yearOfStudy: YearOfStudy.year1,
                    targetCareer: "Not Set",
                    plan: PlanType.free,
                }
            };
            saveUsers(users);
            return { success: true };
        },

        loginUser: async (email, password) => {
            const users = getUsers();
            const user = users[email];
            if (user && user.password === password) {
                localStorage.setItem('currentUserEmail', email);
                return { success: true, profile: user.profile };
            }
            return { error: "Invalid username or password" };
        },

        getCallerUserProfile: async () => {
            const email = localStorage.getItem('currentUserEmail');
            if (!email) return null;
            const users = getUsers();
            return users[email]?.profile || null;
        },

        saveCallerUserProfile: async (profile) => {
            const email = localStorage.getItem('currentUserEmail');
            if (!email) return { error: "Not logged in" };
            const users = getUsers();
            if (users[email]) {
                users[email].profile = profile;
                saveUsers(users);
                return { success: true };
            }
            return { error: "User not found" };
        },

        // CORE FEATURES
        getStudyTasks: async () => getTasks(),
        addStudyTask: async (task) => {
            const tasks = getTasks();
            tasks.push({ ...task, id: BigInt(Date.now()) });
            saveTasks(tasks);
            return { success: true };
        },
        updateStudyTask: async (id, task) => {
            const tasks = getTasks();
            const index = tasks.findIndex((t) => t.id === id);
            if (index !== -1) {
                tasks[index] = { ...task, id };
                saveTasks(tasks);
            }
            return { success: true };
        },
        deleteStudyTask: async (id) => {
            const tasks = getTasks();
            const index = tasks.findIndex((t) => t.id === id);
            if (index !== -1) {
                tasks.splice(index, 1);
                saveTasks(tasks);
            }
            return { success: true };
        },
        getDashboardData: async () => {
            const tasks = getTasks();
            const completed = tasks.filter(t => t.status === 'completed').length;
            const email = localStorage.getItem('currentUserEmail');
            const users = getUsers();
            const profile = users[email]?.profile || { fullName: 'Student' };
            return {
                totalTasks: tasks.length,
                completedTasks: completed,
                studyHours: 12.5,
                streak: 3,
                profile
            };
        },
        getTaskSummary: async () => {
            const tasks = getTasks();
            const completed = tasks.filter(t => t.status === 'completed').length;
            return {
                totalTasks: tasks.length,
                completedTasks: completed,
                completionPercentage: tasks.length > 0 ? (completed / tasks.length) * 100 : 0
            };
        },
        getChatHistory: async () => {
            try {
                const email = localStorage.getItem('currentUserEmail');
                const history = localStorage.getItem(`chatHistory_${email}`);
                if (!history) return [];
                const messages = JSON.parse(history);
                return messages.filter(msg => msg && msg.role && msg.content);
            } catch (e) {
                return [];
            }
        },
        addChatMessage: async (msg) => {
            const email = localStorage.getItem('currentUserEmail');
            const history = localStorage.getItem(`chatHistory_${email}`);
            const messages = history ? JSON.parse(history) : [];
            messages.push(msg);
            localStorage.setItem(`chatHistory_${email}`, JSON.stringify(messages));
            return { success: true };
        },
        clearChatHistory: async () => {
            const email = localStorage.getItem('currentUserEmail');
            localStorage.removeItem(`chatHistory_${email}`);
            return { success: true };
        },
        // HABIT TRACKER
        getHabits: async () => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`habits_${email}`);
            return data ? JSON.parse(data) : [];
        },
        addHabit: async (habit) => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`habits_${email}`);
            const habits = data ? JSON.parse(data) : [];
            const newHabit = { ...habit, id: Math.random().toString(36).substr(2, 9), completedDays: [] };
            habits.push(newHabit);
            localStorage.setItem(`habits_${email}`, JSON.stringify(habits));
            return { success: true };
        },
        toggleHabit: async (id, date) => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`habits_${email}`);
            let habits = data ? JSON.parse(data) : [];
            habits = habits.map(h => {
                if (h.id === id) {
                    const exists = h.completedDays.includes(date);
                    if (exists) h.completedDays = h.completedDays.filter(d => d !== date);
                    else h.completedDays.push(date);
                }
                return h;
            });
            localStorage.setItem(`habits_${email}`, JSON.stringify(habits));
            return { success: true };
        },
        deleteHabit: async (id) => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`habits_${email}`);
            let habits = data ? JSON.parse(data) : [];
            habits = habits.filter(h => h.id !== id);
            localStorage.setItem(`habits_${email}`, JSON.stringify(habits));
            return { success: true };
        },
        // FLASHCARDS
        getFlashcards: async () => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`flashcards_${email}`);
            return data ? JSON.parse(data) : [];
        },
        addFlashcard: async (card) => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`flashcards_${email}`);
            const cards = data ? JSON.parse(data) : [];
            const newCard = { ...card, id: Math.random().toString(36).substr(2, 9) };
            cards.push(newCard);
            localStorage.setItem(`flashcards_${email}`, JSON.stringify(cards));
            return { success: true };
        },
        deleteFlashcard: async (id) => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`flashcards_${email}`);
            let cards = data ? JSON.parse(data) : [];
            cards = cards.filter(c => c.id !== id);
            localStorage.setItem(`flashcards_${email}`, JSON.stringify(cards));
            return { success: true };
        },
        // RESOURCES
        getStudyResources: async () => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`resources_${email}`);
            return data ? JSON.parse(data) : [];
        },
        addStudyResource: async (resource) => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`resources_${email}`);
            const resources = data ? JSON.parse(data) : [];
            const newRes = { ...resource, id: Math.random().toString(36).substr(2, 9) };
            resources.push(newRes);
            localStorage.setItem(`resources_${email}`, JSON.stringify(resources));
            return { success: true };
        },
        getFocusSessions: async () => [
            { durationMinutes: 25, timestamp: "2023-01-01" },
            { durationMinutes: 50, timestamp: "2023-01-02" }
        ],
        addFocusSession: async (session) => {
            return { success: true };
        },
        getCareerRoadmap: async () => {
            const email = localStorage.getItem('currentUserEmail');
            const data = localStorage.getItem(`careerRoadmap_${email}`);
            if (!data) return null;
            try {
                const parsed = JSON.parse(data);
                if (!parsed.skillRoadmap) return null;
                return parsed;
            } catch (e) {
                return null;
            }
        },
        saveCareerRoadmap: async (roadmap) => {
            const email = localStorage.getItem('currentUserEmail');
            localStorage.setItem(`careerRoadmap_${email}`, JSON.stringify(roadmap));
            return { success: true };
        },
        upgradeToPro: async () => {
            const email = localStorage.getItem('currentUserEmail');
            const users = getUsers();
            if (users[email]) {
                users[email].profile.plan = PlanType.pro;
                saveUsers(users);
                return { success: true };
            }
            return { error: "User not found" };
        },
    };
};

export const backend = createActor(canisterId);
