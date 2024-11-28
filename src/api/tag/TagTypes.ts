export interface TagResponse {
    id: number;
    title: string;
    color: TagColor | null;
}

export interface SaveTagRequest {
    title: string;
    color: TagColor | null;
}


export enum TagColor {
    RED = "RED",
    ORANGE = "ORANGE",
    YELLOW = "YELLOW",
    LIME = "LIME",
    GREEN = "GREEN",
    CYAN = "CYAN",
    BLUE = "BLUE",
    PURPLE = "PURPLE",
    PINK = "PINK",
}