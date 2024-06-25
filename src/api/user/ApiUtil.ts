import {getAuthCookie} from "../../util/CookieUtil";
import {API_URL} from "../../constants";
import {ProfileUpdateRequestInterface} from "../interface/ProfileUpdateRequestInterface";

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
