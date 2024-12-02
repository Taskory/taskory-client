// EventApi.ts
import axios, { AxiosResponse } from 'axios';
import { EventResponse, EventSummary, SaveEventRequest } from './EventsTypes';
import { API_URL } from "../../constants";
import { getAuthCookie } from "../../util/CookieUtil";
import {TimeUtil} from "../../util/TimeUtil";
import {TaskSummary} from "../task/TaskTypes";

// API 요청 함수들 정의
export const request_getMonthlyEvents = async (date: string): Promise<AxiosResponse<EventSummary[]>> => {
    const {start, end} = TimeUtil.getFirstSundayAndLastSaturday(date);

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

export const request_createEvent = async (event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
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

export const request_updateEvent = async (eventId: number, event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
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

export const request_deleteEvent = async (eventId: number): Promise<AxiosResponse<{ status: number; message: string }>> => {
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

export const request_getEventById = async (eventId: number): Promise<AxiosResponse<EventResponse>> => {
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

export const request_getAllEvents = async (): Promise<AxiosResponse<EventSummary[]>> => {
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

export async function request_getEventsByTags(tagIds: number[]) {
    const requestUrl = `${API_URL}/event/tags`

    const authToken = getAuthCookie();  // Fetch the latest cookie value here
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    try {
        const response: AxiosResponse<EventSummary[]> = await axios.get(requestUrl, {
            ...requestOptions,
            params: {
                tag_ids: tagIds.join(","), // Send tag IDs as query parameters
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }

}

