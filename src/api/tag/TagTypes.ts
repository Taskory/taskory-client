export interface TagResponse {
    id: number;
    title: string;
    color: string;
}

export interface SaveTagRequest {
    title: string;
    color: string;
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
    LINE = "LINE"
}