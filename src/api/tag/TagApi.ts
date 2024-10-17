import axios, { AxiosResponse } from 'axios';
import { TagResponse, SaveTagRequest } from './TagTypes';
import { API_URL } from '../../constants';
import {getAuthCookie} from "../../util/CookieUtil";

// API 요청 함수들 정의
export const request_getTagById = async (id: number): Promise<AxiosResponse<TagResponse>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };
    return axios.get(`${API_URL}/tags/${id}`, requestOptions);
};

export const request_getAllTags = async (): Promise<AxiosResponse<TagResponse[]>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };
    return axios.get(`${API_URL}/tags`, requestOptions);
};

// API Request Function with Error Handling
export const request_createTag = async (tag: SaveTagRequest): Promise<TagResponse> => {
    const authToken = getAuthCookie();
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    try {
        const response = await axios.post<TagResponse>(`${API_URL}/tags`, tag, requestOptions);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("API request failed:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Failed to create tag.");
        } else {
            console.error("An unexpected error occurred:", error);
            throw new Error("An unexpected error occurred.");
        }
    }
};


export const request_updateTag = async (id: number, tag: SaveTagRequest): Promise<AxiosResponse<TagResponse>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };
    return axios.put(`${API_URL}/tags/${id}`, tag, requestOptions);
};

export const request_deleteTag = async (id: number): Promise<AxiosResponse<void>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };
    return axios.delete(`${API_URL}/tags/${id}`, requestOptions);
};
