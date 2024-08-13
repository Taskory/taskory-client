import axios, { AxiosResponse } from 'axios';
import { EventResponse, EventSummary, SaveEventRequest } from './EventsTypes';
import {API_URL} from "../../constants";

// API 요청 함수들 정의
export const getMonthlyEvents = async (date: string): Promise<AxiosResponse<EventSummary[]>> => {
    return axios.get(`${API_URL}/event/month`, {
        params: { date }
    });
};

export const createEvent = async (event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
    return axios.post(`${API_URL}/event/create`, event);
};

export const updateEvent = async (eventId: number, event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
    return axios.put(`${API_URL}/event/update`, { eventId, ...event });
};

export const deleteEvent = async (eventId: number): Promise<AxiosResponse<{ status: number; message: string }>> => {
    return axios.delete(`${API_URL}/event/delete`, {
        params: { eventId }
    });
};

export const getEventById = async (eventId: number): Promise<AxiosResponse<EventResponse>> => {
    return axios.get(`${API_URL}/event/${eventId}`);
};

export const getAllEvents = async (): Promise<AxiosResponse<EventResponse[]>> => {
    return axios.get(`${API_URL}/event/all`);
};
