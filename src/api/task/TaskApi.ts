import {
    TaskResponse,
    SaveTaskRequest,
    TaskSummary,
    TaskStatus
} from './TaskTypes';
import axios, {AxiosResponse} from 'axios';
import {getAuthCookie} from "../../util/CookieUtil";
import {API_URL} from "../../constants";

// Creates a new task
export const request_createTask = async (saveTaskRequest: SaveTaskRequest): Promise<TaskResponse> => {
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
export const request_getTaskById = async (taskId: number): Promise<TaskResponse> => {
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
export const request_getAllTasks = async (): Promise<TaskSummary[]> => {
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
export const request_updateTask = async (taskId: number, saveTaskRequest: SaveTaskRequest): Promise<TaskResponse> => {
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
export const request_deleteTask = async (taskId: number): Promise<void> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    await axios.delete(`${API_URL}/task/${taskId}`, requestOptions);
};

export const request_updateTaskStatus = async (taskId: number, taskStatus: TaskStatus, deadline: string): Promise<TaskSummary> => {
    const requestUrl = `${API_URL}/task/status/${taskId}`

    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    const response = await axios.patch<TaskSummary>(requestUrl, null, {
        ...requestOptions,
        params: {
            status: taskStatus.toString(),
            deadline: deadline,
        },
    });
    return response.data;
};

export async function request_getTasksByTags(tagIds: number[]) {
    const requestUrl = `${API_URL}/task/tags`

    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    try {
        const response: AxiosResponse<TaskSummary[]> = await axios.get(requestUrl, {
            ...requestOptions,
            params: {
                tag_ids: tagIds.join(","), // Send tag IDs as query parameters
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

export async function request_getTasksByEvent(eventId: number) {
    const requestUrl = `${API_URL}/task/filter`

    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    try {
        const response: AxiosResponse<TaskSummary[]> = await axios.get(requestUrl, {
            ...requestOptions,
            params: {
                eventId: eventId, // Send tag IDs as query parameters
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

export const ItemType = "TASK";
