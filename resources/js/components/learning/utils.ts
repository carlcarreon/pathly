import type { LearningPath } from '@/types/learning';

export function topicCount(path: LearningPath): number {
    return path.milestones.reduce(
        (total, milestone) => total + milestone.topics.length,
        0,
    );
}
