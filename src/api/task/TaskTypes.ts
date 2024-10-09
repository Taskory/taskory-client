// Interface for TaskResponse
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
    description?: string;  // Optional field
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
