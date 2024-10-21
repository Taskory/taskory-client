export interface TagResponse {
    id: number;
    title: string;
    color: TagColor | null;
}

export interface SaveTagRequest {
    title: string;
    color: TagColor;
}


export enum TagColor {
    BLACK = "BLACK",
    RED = "RED",
    GREEN = "GREEN",
    BLUE = "BLUE",
    YELLOW = "YELLOW",
    ORANGE = "ORANGE",
    PURPLE = "PURPLE",
    BROWN = "BROWN",
    PINK = "PINK",
    CYAN = "CYAN",
    NONE = "NONE"
}