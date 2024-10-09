// Interface for TaskResponse
import {EventSummary} from "../event/EventsTypes";
import {HashtagResponse} from "../hashtag/HashtagTypes";

export interface TaskResponse {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

// Interface for SaveTaskRequest
export interface SaveTaskRequest {
    title: string;
    eventId: number;
    tagId: number;
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
    event: EventSummary;
    tagTitle: string;
    tagColor: string;
    hashtags: HashtagResponse[];
    status: string;
}
