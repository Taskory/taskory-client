import {HashtagResponse} from "../hashtag/HashtagTypes";
import {TagResponse} from "../tag/TagTypes";

export interface EventResponse {
    id: number;
    title: string;
    tag: TagResponse;
    hashtags: HashtagResponse[];
    description: string;
    startDateTime: string;
    dueDateTime: string;
    location: string;
}

export interface EventSummary {
    id: number;
    title: string;
    tagTitle: string;
    tagColor: string;
    startDateTime: string;
    dueDateTime: string;
}

export interface SaveEventRequest {
    title: string;
    tagId?: number;
    hashtagIds?: number[];
    description?: string;
    startDateTime?: string;
    dueDateTime?: string;
    location?: string;
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
