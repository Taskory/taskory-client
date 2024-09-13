import axios, { AxiosResponse } from 'axios';
import { EventResponse, EventSummary, SaveEventRequest } from './EventsTypes';
import { API_URL } from "../../constants";
import {getAuthCookie} from "../../util/CookieUtil";

// Common requestOptions with Authorization header
const requestOptions = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getAuthCookie(),
    },
};

// API 요청 함수들 정의
export const getMonthlyEvents = async (date: string): Promise<AxiosResponse<EventSummary[]>> => {
    return axios.get(`${API_URL}/event/month`, {
        ...requestOptions,   // Spread the requestOptions to include the headers
        params: { date }
    });
};

export const createEvent = async (event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
    return axios.post(`${API_URL}/event/create`, event, {
        ...requestOptions,  // Include headers in the post request
    });
};

export const updateEvent = async (eventId: number, event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
    return axios.put(`${API_URL}/event/update`, {...event }, {
        ...requestOptions,  // Include headers in the put request
        params: {eventId}
    });
};

export const deleteEvent = async (eventId: number): Promise<AxiosResponse<{ status: number; message: string }>> => {
    return axios.delete(`${API_URL}/event/delete`, {
        ...requestOptions,   // Include headers for the delete request
        params: { eventId }
    });
};

export const getEventById = async (eventId: number): Promise<AxiosResponse<EventResponse>> => {
    return axios.get(`${API_URL}/event/${eventId}`, {
        ...requestOptions,   // Include headers for the get request
    });
};
export const getAllEvents = async (): Promise<AxiosResponse<EventResponse[]>> => {
    return axios.get(`${API_URL}/event/all`, {
        ...requestOptions,   // Include headers for the get request
    });
};
