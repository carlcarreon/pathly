export type GeneratedTopic = {
    id: number;
    title: string;
    description: string | null;
    content_type: string;
    content?: string | null;
    lesson_status?: 'queued' | 'generating' | 'completed' | 'failed';
};

export type GeneratedMilestone = {
    id: number;
    position: number;
    title: string;
    description: string | null;
    topics: GeneratedTopic[];
};

export type GeneratedPath = {
    id: number;
    title: string;
    description: string;
    level: string;
    duration_weeks: number;
    generation_status?: string;
    milestones: GeneratedMilestone[];
};

export type UploadedResource = {
    id: number;
    name: string;
    url: string;
    mime_type: string;
};

export type CreatePathInput = {
    topic: string;
    level: string;
    duration: string;
    preferences: {
        practical: boolean;
        resources: boolean;
        exercises: boolean;
    };
};
