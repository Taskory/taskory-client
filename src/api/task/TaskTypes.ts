// Interface for TaskResponse
import {EventSummary} from "../event/EventsTypes";
import {HashtagResponse} from "../hashtag/HashtagTypes";
import {TagResponse} from "../tag/TagTypes";

export interface TaskResponse {
    id: number | null;
    title: string;
    event: EventSummary | null;
    tag: TagResponse;
    hashtags: HashtagResponse[];
    description: string;
    status: string;
    items: TaskItemDto[];
}

// Interface for SaveTaskRequest
export interface SaveTaskRequest {
    title: string;
    eventId: number | null;
    tagId: number | null;
    hashtagIds: number[];
    description: string;
    status: string;
    items: TaskItemDto[]
}

export interface TaskItemDto {
    id: number | null;
    taskId: number | null;
    title: string;
    completed: boolean;
}

// Interface for TaskSummary
export interface TaskSummary {
    id: number;
    title: string;
    event: EventSummary | undefined;
    tagTitle: string;
    tagColor: string;
    hashtags: HashtagResponse[];
    status: TaskStatus;
    progressRate: number;
}

export enum TaskStatus {
    TO_DO = "TO_DO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
