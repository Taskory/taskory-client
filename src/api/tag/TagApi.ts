import axios, { AxiosResponse } from 'axios';
import { TagResponse, SaveTagRequest } from './TagTypes';
import { API_URL } from '../../constants';

// API 요청 함수들 정의
export const getTagById = async (id: number): Promise<AxiosResponse<TagResponse>> => {
    return axios.get(`${API_URL}/tags/${id}`);
};

export const getAllTags = async (): Promise<AxiosResponse<TagResponse[]>> => {
    return axios.get(`${API_URL}/tags`);
};

export const createTag = async (tag: SaveTagRequest): Promise<AxiosResponse<TagResponse>> => {
    return axios.post(`${API_URL}/tags`, tag);
};

export const updateTag = async (id: number, tag: SaveTagRequest): Promise<AxiosResponse<TagResponse>> => {
    return axios.put(`${API_URL}/tags/${id}`, tag);
};

export const deleteTag = async (id: number): Promise<AxiosResponse<void>> => {
    return axios.delete(`${API_URL}/tags/${id}`);
};
