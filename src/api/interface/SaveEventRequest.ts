import {TagInterface} from "./TagInterface";
import {HashtagInterface} from "./HashtagInterface";

export interface SaveEventRequest {
    title: string;
    tag: TagInterface;
    hashtags: HashtagInterface[];
    description: string;
    startDateTime: string;
    dueDateTime: string;
    location: string;

}