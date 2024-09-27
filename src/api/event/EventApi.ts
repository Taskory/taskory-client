// EventApi.ts
import axios, { AxiosResponse } from 'axios';
import { EventResponse, EventSummary, SaveEventRequest } from './EventsTypes';
import { API_URL } from "../../constants";
import { getAuthCookie } from "../../util/CookieUtil";
import {TimeUtil} from "../../util/TimeUtil";

// API 요청 함수들 정의
export const getMonthlyEvents = async (date: string): Promise<AxiosResponse<EventSummary[]>> => {
    const {start, end} = TimeUtil.getFirstSundayAndLastSaturday(date);
    console.log("start", start);
    console.log("end", end);

    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    return axios.get(`${API_URL}/event/period`, {
        ...requestOptions,
        params: { startDate: start, endDate: end }
    });
};

export const createEvent = async (event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    return axios.post(`${API_URL}/event/create`, event, {
        ...requestOptions,
    });
};

export const updateEvent = async (eventId: number, event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    return axios.put(`${API_URL}/event/update`, {...event }, {
        ...requestOptions,
        params: { eventId }
    });
};

export const deleteEvent = async (eventId: number): Promise<AxiosResponse<{ status: number; message: string }>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    return axios.delete(`${API_URL}/event/delete`, {
        ...requestOptions,
        params: { eventId }
    });
};

export const getEventById = async (eventId: number): Promise<AxiosResponse<EventResponse>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    return axios.get(`${API_URL}/event/${eventId}`, {
        ...requestOptions,
    });
};

export const getAllEvents = async (): Promise<AxiosResponse<EventResponse[]>> => {
    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    return axios.get(`${API_URL}/event/all`, {
        ...requestOptions,
    });
};
