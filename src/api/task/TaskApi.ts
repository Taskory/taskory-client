import {TaskResponse, SaveTaskRequest, SaveTaskItemRequest, TaskItemResponse, TaskSummary} from './TaskTypes';
import axios, {AxiosResponse} from 'axios';
import {getAuthCookie} from "../../util/CookieUtil";
import {API_URL} from "../../constants";

// Creates a new task
export const createTask = async (saveTaskRequest: SaveTaskRequest): Promise<TaskResponse> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    const response = await axios.post<TaskResponse>(`${API_URL}/task`, saveTaskRequest, requestOptions);
    return response.data;
};

// Retrieves a task by ID
export const getTaskById = async (taskId: number): Promise<TaskResponse> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    const response = await axios.get<TaskResponse>(`${API_URL}/task/${taskId}`, requestOptions);
    return response.data;
};

// Retrieves all tasks for the current user
export const getAllTasks = async (): Promise<TaskSummary[]> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value

    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    try {
        const response: AxiosResponse<TaskSummary[]> = await axios.get(`${API_URL}/task`, requestOptions);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

// Updates an existing task by ID
export const updateTask = async (taskId: number, saveTaskRequest: SaveTaskRequest): Promise<TaskResponse> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    const response = await axios.put<TaskResponse>(`${API_URL}/task/${taskId}`, saveTaskRequest, requestOptions);
    return response.data;
};

// Deletes a task by ID
export const deleteTask = async (taskId: number): Promise<void> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    await axios.delete(`${API_URL}/task/${taskId}`, requestOptions);
};

// Adds a new task item to an existing task
export const createTaskItem = async (saveTaskItemRequest: SaveTaskItemRequest): Promise<TaskItemResponse> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    const response = await axios.post<TaskItemResponse>(`${API_URL}/task/items`, saveTaskItemRequest, requestOptions);
    return response.data;
};

// Retrieves a task item by ID
export const getTaskItemById = async (taskItemId: number): Promise<TaskItemResponse> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    const response = await axios.get<TaskItemResponse>(`${API_URL}/task/items/${taskItemId}`, requestOptions);
    return response.data;
};

// Updates the title of a task item by ID
export const updateTaskItemTitle = async (taskItemId: number, newTitle: string): Promise<TaskItemResponse> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    const response = await axios.patch<TaskItemResponse>(`${API_URL}/task/items/${taskItemId}/title`, { newTitle }, requestOptions);
    return response.data;
};

// Updates the completion status of a task item by ID
export const setTaskItemCompleted = async (taskItemId: number, completed: boolean): Promise<TaskItemResponse> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    const response = await axios.patch<TaskItemResponse>(`${API_URL}/task/items/${taskItemId}/completed`, { completed }, requestOptions);
    return response.data;
};

// Deletes a task item by ID
export const deleteTaskItem = async (taskItemId: number): Promise<void> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    await axios.delete(`${API_URL}/task/items/${taskItemId}`, requestOptions);
};
