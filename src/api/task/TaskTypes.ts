// Interface for TaskResponse
import {EventSummary} from "../event/EventsTypes";
import {HashtagResponse} from "../hashtag/HashtagTypes";
import {TagResponse} from "../tag/TagTypes";

export interface TaskResponse {
    id: number;
    title: string;
    event: EventSummary | undefined;
    tag: TagResponse | undefined;
    hashtags: HashtagResponse[];
    description: string;
    status: string;
    items: TaskItemResponse[];
}

// Interface for SaveTaskRequest
export interface SaveTaskRequest {
    title: string;
    eventId: number | undefined;
    tagId: number | undefined;
    hashtagIds: number[];
    description: string;
    status: string;
}


// Interface for TaskItemResponse
export interface TaskItemResponse {
    id: number;
    title: string;
    completed: boolean;
    taskId: number;
    createdAt: string;
    updatedAt: string;
}

// Interface for SaveTaskItemRequest
export interface SaveTaskItemRequest {
    title: string;
    taskId: number;
    completed?: boolean;  // Optional field
}

// Interface for TaskSummary
export interface TaskSummary {
    id: number;
    title: string;
    event: EventSummary | undefined;
    tagTitle: string;
    tagColor: string;
    hashtags: HashtagResponse[];
    status: string;
}

export enum TaskStatus {
    TO_DO = "TO_DO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
