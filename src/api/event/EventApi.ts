import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'http://your-api-url'; // 실제 API URL로 대체

// Event Response Interface
interface EventResponse {
    id: number;
    title: string;
    tag: { id: number; title: string; color: string };
    hashtags: { id: number; name: string }[];
    description: string;
    startDateTime: string;
    dueDateTime: string;
    location: string;
}

// Event Summary Interface
interface EventSummary {
    id: number;
    title: string;
    tagTitle: string;
    tagColor: string;
    startDateTime: string;
    dueDateTime: string;
}

// Save Event Request Interface
interface SaveEventRequest {
    title: string;
    tag?: { id: number; title: string; color: string };
    hashtags?: { id: number; name: string }[];
    description?: string;
    startDateTime?: string;
    dueDateTime?: string;
    location?: string;
}

// API 요청 함수들 정의

// 1. Get All Events in a Period
export const getEventsInPeriod = async (startDate: string, dueDate: string): Promise<AxiosResponse<EventResponse[]>> => {
    return axios.get(`${BASE_URL}/event`, {
        params: { startDate, dueDate }
    });
};

// 2. Get Monthly Events
export const getMonthlyEvents = async (date: string): Promise<AxiosResponse<EventSummary[]>> => {
    return axios.get(`${BASE_URL}/event/month`, {
        params: { date }
    });
};

// 3. Create an Event
export const createEvent = async (event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
    return axios.post(`${BASE_URL}/event/create`, event);
};

// 4. Update an Event
export const updateEvent = async (eventId: number, event: SaveEventRequest): Promise<AxiosResponse<EventResponse>> => {
    return axios.put(`${BASE_URL}/event/update`, { eventId, ...event });
};

// 5. Delete an Event
export const deleteEvent = async (eventId: number): Promise<AxiosResponse<{ status: number; message: string }>> => {
    return axios.delete(`${BASE_URL}/event/delete`, {
        params: { eventId }
    });
};

// 6. Get an Event by ID
export const getEventById = async (eventId: number): Promise<AxiosResponse<EventResponse>> => {
    return axios.get(`${BASE_URL}/event/${eventId}`);
};

// 7. Get All Events for a User
export const getAllEvents = async (): Promise<AxiosResponse<EventResponse[]>> => {
    return axios.get(`${BASE_URL}/event/all`);
};
