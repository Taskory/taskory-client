import axios, { AxiosResponse } from 'axios';
import { TagResponse, SaveTagRequest } from './TagTypes';
import { API_URL } from '../../constants';
import {getAuthCookie} from "../../util/CookieUtil";

// API 요청 함수들 정의
export const getTagById = async (id: number): Promise<AxiosResponse<TagResponse>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };
    return axios.get(`${API_URL}/tags/${id}`, requestOptions);
};

export const getAllTags = async (): Promise<AxiosResponse<TagResponse[]>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };
    return axios.get(`${API_URL}/tags`, requestOptions);
};

export const createTag = async (tag: SaveTagRequest): Promise<AxiosResponse<TagResponse>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };
    return axios.post(`${API_URL}/tags`, tag, requestOptions);
};

export const updateTag = async (id: number, tag: SaveTagRequest): Promise<AxiosResponse<TagResponse>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };
    return axios.put(`${API_URL}/tags/${id}`, tag, requestOptions);
};

export const deleteTag = async (id: number): Promise<AxiosResponse<void>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };
    return axios.delete(`${API_URL}/tags/${id}`, requestOptions);
};
