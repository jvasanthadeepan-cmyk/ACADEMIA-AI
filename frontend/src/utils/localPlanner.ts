export interface GeneratedTask {
    topic: string;
    deadline: Date;
}

export function generateStudyPlan(syllabusText: string, startDate: Date, endDate: Date): GeneratedTask[] {
    if (!syllabusText.trim()) {
        throw new Error('Syllabus text cannot be empty');
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (end <= start) {
        throw new Error('End date must be after start date');
    }

    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 1) {
        throw new Error('Date range must be at least 1 day');
    }

    // Parse syllabus into topics
    const topics = syllabusText
        .split(/[,;\n]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

    if (topics.length === 0) {
        throw new Error('No topics found in syllabus');
    }

    // Distribute topics across available days
    const tasks: GeneratedTask[] = [];
    const topicsPerDay = Math.max(1, Math.ceil(topics.length / daysDiff));

    let currentDay = 0;
    for (let i = 0; i < topics.length; i += topicsPerDay) {
        const batch = topics.slice(i, i + topicsPerDay);
        const taskDate = new Date(start);
        taskDate.setDate(taskDate.getDate() + currentDay);

        batch.forEach((topic) => {
            tasks.push({
                topic,
                deadline: new Date(taskDate),
            });
        });

        currentDay++;
    }

    return tasks;
}
