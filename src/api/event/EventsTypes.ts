import {HashtagResponse} from "../hashtag/HashtagTypes";
import {TagResponse} from "../tag/TagTypes";
import {TaskStatus} from "../task/TaskTypes";

export interface EventResponse {
    id: number;
    title: string;
    tag: TagResponse;
    tasks: TaskInEventDto[];
    hashtags: HashtagResponse[];
    description: string;
    startDateTime: string;
    dueDateTime: string;
    location: string;
}

export interface EventSummary {
    id: number;
    title: string;
    tag: TagResponse;
    startDateTime: string;
    dueDateTime: string;
}

export interface SaveEventRequest {
    title: string;
    tagId?: number;
    tasks: TaskInEventDto[];
    hashtagIds?: number[];
    description?: string;
    startDateTime?: string;
    dueDateTime?: string;
    location?: string;
}

export interface TaskInEventDto {
    id: number | null;
    title: string;
    status: TaskStatus;
}

export type DateEventInfo = {
    date: DateInfo | null
    events: EventSummary[];
}

export type DateInfo = {
    year: number;
    month: number;
    day: number;
}
