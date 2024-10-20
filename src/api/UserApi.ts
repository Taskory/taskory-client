import axios from 'axios';
import { getAuthCookie } from '../util/CookieUtil';
import { API_URL } from '../constants';
import { ProfileUpdateRequestInterface } from './interface/ProfileUpdateRequestInterface';
import { UserInfoInterface } from './interface/UserInfoInterface'; // Import interface for profile response

// Helper function to generate request options with the latest token
function getRequestOptions(): { headers: { [key: string]: string } } {
    const authToken = getAuthCookie(); // Fetch the latest cookie value here
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    };
}

// Username check
export async function requestUsernameCheck(username: string): Promise<boolean> {
    if (!username) {
        throw new Error('Username is required.');
    }

    try {
        const response = await axios.get<boolean>(`${API_URL}/user/check-username`, {
            ...getRequestOptions(),
            params: { username },
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Profile request
export async function requestProfile(): Promise<UserInfoInterface> {
    try {
        const response = await axios.get<UserInfoInterface>(`${API_URL}/user/profile`, getRequestOptions());
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Profile update
export async function requestProfileUpdate(
    data: ProfileUpdateRequestInterface
): Promise<UserInfoInterface> {
    try {
        const response = await axios.put<UserInfoInterface>(`${API_URL}/user/profile`, data, getRequestOptions());
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Error handling helper function
function handleAxiosError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
    } else {
        console.error('Unexpected error:', error);
    }
    throw error;
}
