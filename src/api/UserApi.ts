import {getAuthCookie} from "../util/CookieUtil";
import {API_URL} from "../constants";
import {ProfileUpdateRequestInterface} from "./interface/ProfileUpdateRequestInterface";

export async function requestUsernameCheck(username: string) {
    if (!username) {
        throw new Error("Username is required.");
    }

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getAuthCookie(),
        },
    };

    try {
        const params = new URLSearchParams({username: username});
        const response = await fetch(`${API_URL}/user/check-username?${params.toString()}`, requestOptions);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error(error);
    }
}

export async function requestProfile() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getAuthCookie(),
        },
    };

    try {
        const response = await fetch(API_URL + "/user/profile", requestOptions)
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error(error);
    }
}

export async function requestProfileUpdate(data: ProfileUpdateRequestInterface) {
    console.log(data);
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getAuthCookie(),
        },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(API_URL + "/user/profile", requestOptions);
        if (response.ok) {
            return await response.json();
        } else {
            console.error(response.json());
        }
    } catch (error) {
        console.error(error);
    }
}

export async function requestZoneid() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getAuthCookie(),
        },
    };

    try {
        const response = await fetch(API_URL + "/user/zoneid", requestOptions);

        // Check if the response is ok
        if (response.ok) {
            // Since the server is returning a plain text response, use response.text()
            return await response.text();
        } else {
            console.error('Failed to fetch zone ID:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching zone ID:', error);
    }
}
