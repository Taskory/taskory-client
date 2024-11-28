export interface TagResponse {
    id: number;
    title: string;
    color: TagColor;
}

export interface SaveTagRequest {
    title: string;
    color: TagColor;
}


export enum TagColor {
    // Don't modify color sequence
    RED = "RED",
    PINK = "PINK",
    ORANGE = "ORANGE",
    YELLOW = "YELLOW",
    LIME = "LIME",
    GREEN = "GREEN",
    CYAN = "CYAN",
    BLUE = "BLUE",
    PURPLE = "PURPLE",
}