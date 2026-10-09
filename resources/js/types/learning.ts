export type LearningResource = {
    id: number;
    name: string;
    url: string;
    mime_type: string;
};

export type LearningTopic = {
    id: number;
    position: number;
    title: string;
    description: string | null;
    content_type: string;
    content: string | null;
    lesson_status: 'queued' | 'generating' | 'completed' | 'failed';
    resources: LearningResource[];
};

export type LearningMilestone = {
    id: number;
    position: number;
    title: string;
    description: string | null;
    topics: LearningTopic[];
};

export type LearningPath = {
    id: number;
    title: string;
    description: string;
    category: string | null;
    level: string;
    duration_weeks: number;
    generation_status: string;
    topics_count: number;
    milestones: LearningMilestone[];
    resources: LearningResource[];
};
