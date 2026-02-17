import { CareerRoadmap } from 'declarations/backend/backend.did';

export function generateCareerRoadmap(degree: string, targetJob: string, timeline: string): CareerRoadmap {
    if (!degree.trim() || !targetJob.trim() || !timeline.trim()) {
        throw new Error('All fields are required');
    }

    // Deterministic generation based on inputs
    const skillRoadmap = [
        `Master ${degree} fundamentals`,
        `Learn industry-standard tools for ${targetJob}`,
        'Build problem-solving skills',
        'Develop soft skills and communication',
        'Stay updated with latest trends',
    ];

    const recommendedTools = [
        'Git & GitHub',
        'VS Code / IDE',
        'Project management tools',
        'Communication platforms',
        'Portfolio website',
    ];

    const projectSuggestions = [
        `Build a ${targetJob.toLowerCase()}-related project`,
        'Contribute to open source',
        'Create a personal portfolio',
        'Develop a full-stack application',
        'Participate in hackathons',
    ];

    const internshipPath = [
        'Research companies in your field',
        'Prepare resume and cover letter',
        'Apply to internships early',
        'Network with professionals',
        'Gain practical experience',
    ];

    return {
        degree,
        targetJob,
        timeline,
        skillRoadmap,
        recommendedTools,
        projectSuggestions,
        internshipPath,
    };
}
